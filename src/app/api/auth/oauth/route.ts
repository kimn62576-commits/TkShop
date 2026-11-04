import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { UserRole } from "@/types";

const oauthSchema = z.object({
  provider: z.enum(["google", "facebook", "discord", "roblox", "github"]),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  robloxUsername: z.string().optional(),
});

// Dữ liệu mẫu hồ sơ tự động khi đăng nhập mạng xã hội
const PROVIDER_DEFAULTS = {
  google: {
    name: "Google Creator",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    emailSuffix: "@gmail.com",
    robloxPrefix: "GDev_",
  },
  facebook: {
    name: "Meta Creator",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    emailSuffix: "@facebook.com",
    robloxPrefix: "FBCreator_",
  },
  discord: {
    name: "Discord Modder",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150",
    emailSuffix: "@discord.gg",
    robloxPrefix: "DiscordRBX_",
  },
  roblox: {
    name: "Robloxian Studio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    emailSuffix: "@roblox.com",
    robloxPrefix: "StudioPro_",
  },
  github: {
    name: "Luau Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    emailSuffix: "@github.dev",
    robloxPrefix: "LuauCoder_",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = oauthSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Nhà cung cấp OAuth không hợp lệ" }, { status: 400 });
    }

    const { provider } = validated.data;
    const defaults = PROVIDER_DEFAULTS[provider];

    // Xác định email đăng nhập
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const email = (validated.data.email || `${provider}.developer${randomSuffix}${defaults.emailSuffix}`).toLowerCase();
    const displayName = validated.data.displayName || `${defaults.name} #${randomSuffix}`;
    const avatarUrl = validated.data.avatarUrl || defaults.avatar;
    const robloxUsername = validated.data.robloxUsername || `${defaults.robloxPrefix}${randomSuffix}`;

    // Tìm kiếm user hiện có theo email
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        wallet: true,
      },
    });

    if (user) {
      // Kiểm tra tài khoản bị cấm
      if (user.isBanned) {
        return NextResponse.json(
          { error: `Tài khoản ${provider.toUpperCase()} của bạn đã bị khóa: ${user.banReason || "Vi phạm điều khoản"}` },
          { status: 403 }
        );
      }

      // Cập nhật avatar nếu chưa có
      if (!user.profile?.avatarUrl && avatarUrl) {
        await prisma.userProfile.update({
          where: { userId: user.id },
          data: { avatarUrl },
        });
      }
    } else {
      // Đăng ký tự động tài khoản mới qua mạng xã hội
      const dummyPassword = crypto.randomUUID();
      const passwordHash = await hashPassword(dummyPassword);

      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "USER",
          emailVerified: new Date(),
          profile: {
            create: {
              displayName,
              avatarUrl,
              robloxUsername,
              bio: `Thành viên liên kết qua ${provider.toUpperCase()} tại TKSHOP.VN`,
            },
          },
          wallet: {
            create: {
              balance: 50000, // Tặng 50.000đ khi đăng ký bằng mạng xã hội
            },
          },
          notifications: {
            create: {
              title: `Chào mừng bạn gia nhập TKSHOP.VN!`,
              message: `Bạn đã liên kết thành công tài khoản ${provider.toUpperCase()}. Ví của bạn đã được cộng 50.000đ quà tặng khởi đầu.`,
              type: "WELCOME",
            },
          },
        },
        include: {
          profile: true,
          wallet: true,
        },
      });
    }

    // Tạo JWT session
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: `Đăng nhập thành công với ${provider.toUpperCase()}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName || displayName,
        avatarUrl: user.profile?.avatarUrl || avatarUrl,
        robloxUsername: user.profile?.robloxUsername || robloxUsername,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err: any) {
    console.error("OAuth error:", err);
    return NextResponse.json({ error: "Lỗi kết nối mạng xã hội: " + err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { UserRole } from "@/types";

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  displayName: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  robloxUsername: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Dữ liệu đăng ký không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, password, displayName, robloxUsername } = validated.data;

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user, profile, and initial wallet in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          role: "USER",
          profile: {
            create: {
              displayName,
              robloxUsername: robloxUsername || null,
            },
          },
          wallet: {
            create: {
              balance: 0,
              totalDeposited: 0,
              totalSpent: 0,
            },
          },
        },
        include: {
          profile: true,
          wallet: true,
        },
      });

      // Welcome Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Chào mừng bạn đến với Roblox Studio Asset Marketplace! 🚀",
          message: "Khám phá các Assets, Scripts và Systems đỉnh cao phục vụ xây dựng game Roblox chuyên nghiệp.",
          type: "INFO",
          link: "/marketplace",
        },
      });

      return user;
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as UserRole,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.profile?.displayName,
        robloxUsername: newUser.profile?.robloxUsername,
        walletBalance: newUser.wallet?.balance || 0,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

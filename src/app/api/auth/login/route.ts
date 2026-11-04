import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { UserRole } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, password, rememberMe = true } = validated.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        wallet: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: `Tài khoản của bạn đã bị khóa. Lý do: ${user.banReason || "Vi phạm điều khoản cộng đồng"}` },
        { status: 403 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Tài khoản này được đăng ký qua liên kết mạng xã hội (Google/Discord/...). Vui lòng sử dụng nút đăng nhập tương ứng." },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // Cập nhật thời điểm đăng nhập gần nhất
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    await setAuthCookie(token, rememberMe);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName || user.email.split("@")[0],
        avatarUrl: user.profile?.avatarUrl,
        robloxUsername: user.profile?.robloxUsername,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Lỗi đăng nhập máy chủ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

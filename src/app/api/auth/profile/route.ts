import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự").max(50).optional(),
  robloxUsername: z.string().max(50).optional().nullable(),
  avatarUrl: z.string().url("Đường dẫn ảnh đại diện không hợp lệ").optional().nullable(),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      profile: true,
      accounts: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { displayName, robloxUsername, avatarUrl } = validated.data;

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.id },
      update: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(robloxUsername !== undefined ? { robloxUsername } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
      create: {
        userId: session.id,
        displayName: displayName || session.email.split("@")[0],
        robloxUsername: robloxUsername || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật hồ sơ cá nhân" },
      { status: 500 }
    );
  }
}

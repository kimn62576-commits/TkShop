import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, hashPassword, verifyPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      profile: true,
      wallet: {
        include: {
          transactions: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  files: true,
                  images: { where: { isThumbnail: true }, take: 1 },
                },
              },
            },
          },
        },
      },
      _count: {
        select: { orders: true, wishlists: true, supportTickets: true },
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, robloxUsername, bio, avatarUrl, currentPassword, newPassword } = await req.json();

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Vui lòng nhập mật khẩu hiện tại." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: session.id } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      if (user.passwordHash) {
        const isMatch = await verifyPassword(currentPassword, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ error: "Mật khẩu hiện tại không đúng." }, { status: 400 });
        }
      }

      const passwordHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: session.id },
        data: { passwordHash },
      });
    }

    // Update profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.id },
      update: {
        ...(displayName && { displayName }),
        ...(robloxUsername !== undefined && { robloxUsername }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      create: {
        userId: session.id,
        displayName: displayName || session.email.split("@")[0],
        robloxUsername: robloxUsername || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}

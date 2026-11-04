import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const role = searchParams.get("role");

  const where: any = {};
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { profile: { displayName: { contains: q } } },
      { profile: { robloxUsername: { contains: q } } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      wallet: true,
      _count: {
        select: { orders: true, deposits: true },
      },
    },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isBanned: u.isBanned,
      banReason: u.banReason,
      createdAt: u.createdAt,
      displayName: u.profile?.displayName || "N/A",
      robloxUsername: u.profile?.robloxUsername || "N/A",
      avatarUrl: u.profile?.avatarUrl,
      walletBalance: u.wallet?.balance || 0,
      totalOrders: u._count.orders,
      totalDeposits: u._count.deposits,
    })),
  });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, role, isBanned, banReason } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security Check: Normal ADMIN cannot modify SUPER_ADMIN or grant SUPER_ADMIN
    if (session.role !== "SUPER_ADMIN") {
      if (targetUser.role === "SUPER_ADMIN") {
        return NextResponse.json({ error: "Chỉ Super Admin mới có quyền quản lý tài khoản Super Admin." }, { status: 403 });
      }
      if (role === "SUPER_ADMIN") {
        return NextResponse.json({ error: "Bạn không có quyền cấp quyền Super Admin." }, { status: 403 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(isBanned !== undefined && { isBanned }),
        ...(banReason !== undefined && { banReason }),
      },
    });

    await recordAdminLog({
      adminId: session.id,
      action: isBanned !== undefined ? (isBanned ? "BAN_USER" : "UNBAN_USER") : "UPDATE_USER_ROLE",
      targetType: "USER",
      targetId: userId,
      details: { role, isBanned, banReason },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

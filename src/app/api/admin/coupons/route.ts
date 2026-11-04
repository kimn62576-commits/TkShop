import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt } = await req.json();

    if (!code || !discountValue || !expiresAt) {
      return NextResponse.json({ error: "Vui lòng nhập mã, giá trị giảm và ngày hết hạn." }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: discountType || "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        maxUses: Number(maxUses || 100),
        expiresAt: new Date(expiresAt),
        isActive: true,
      },
    });

    await recordAdminLog({
      adminId: session.id,
      action: "CREATE_COUPON",
      targetType: "COUPON",
      targetId: coupon.id,
      details: { code: coupon.code, discountValue: coupon.discountValue },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete coupon" }, { status: 500 });
  }
}

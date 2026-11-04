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
  const status = searchParams.get("status");

  const where: any = {};
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { user: { email: { contains: q } } },
    ];
  }
  if (status && status !== "ALL") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { include: { profile: true } },
      items: { include: { product: true } },
    },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  // Refund order
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId, reason } = await req.json();
    if (!orderId || !reason) {
      return NextResponse.json({ error: "Order ID and refund reason are required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { include: { wallet: true } }, items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "REFUNDED") {
      return NextResponse.json({ error: "Đơn hàng này đã được hoàn tiền trước đó." }, { status: 400 });
    }

    const refundAmount = order.totalAmount;

    await prisma.$transaction(async (tx) => {
      // 1. Mark order refunded
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "REFUNDED",
          adminNotes: `Hoàn tiền bởi Admin ${session.displayName}: ${reason}`,
        },
      });

      // 2. Refund to wallet if totalAmount > 0
      if (refundAmount > 0 && order.user.wallet) {
        const wallet = order.user.wallet;
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore + refundAmount;

        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: balanceAfter,
            totalSpent: Math.max(0, wallet.totalSpent - refundAmount),
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "REFUND",
            amount: refundAmount,
            balanceBefore,
            balanceAfter,
            referenceId: order.orderNumber,
            description: `Hoàn tiền đơn hàng ${order.orderNumber}: ${reason}`,
            status: "COMPLETED",
          },
        });
      }

      // 3. Notification to user
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: "Đơn hàng đã được hoàn tiền ↩️",
          message: `Đơn hàng ${order.orderNumber} đã được hoàn lại ${refundAmount.toLocaleString("vi-VN")}đ vào ví của bạn. Lý do: ${reason}.`,
          type: "WALLET",
          link: "/dashboard/wallet",
        },
      });
    });

    await recordAdminLog({
      adminId: session.id,
      action: "REFUND_ORDER",
      targetType: "ORDER",
      targetId: orderId,
      details: { orderNumber: order.orderNumber, refundAmount, reason },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({ success: true, message: "Hoàn tiền đơn hàng thành công!" });
  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: error.message || "Failed to refund order" }, { status: 500 });
  }
}

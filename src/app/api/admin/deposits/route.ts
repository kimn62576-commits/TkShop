import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";
import { processDepositCompletion } from "@/lib/payment/adapter";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }

  const deposits = await prisma.deposit.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { profile: true },
      },
    },
  });

  return NextResponse.json({ deposits });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { depositId, action, notes } = await req.json(); // action: "APPROVE" | "REJECT"

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ error: `Giao dịch này đã ở trạng thái ${deposit.status}` }, { status: 400 });
    }

    if (action === "APPROVE") {
      const result = await processDepositCompletion({
        transactionCode: deposit.transactionCode,
        amount: deposit.amount,
        notes: `Duyệt thủ công bởi Admin ${session.displayName}: ${notes || "Xác nhận đã nhận chuyển khoản"}`,
      });

      await recordAdminLog({
        adminId: session.id,
        action: "MANUAL_APPROVE_DEPOSIT",
        targetType: "WALLET",
        targetId: deposit.userId,
        details: { transactionCode: deposit.transactionCode, amount: deposit.amount, notes },
        ipAddress: req.headers.get("x-forwarded-for"),
      });

      return NextResponse.json({
        success: true,
        message: "Đã duyệt và cộng tiền vào ví thành công!",
        deposit: result.deposit,
      });
    } else {
      const rejected = await prisma.deposit.update({
        where: { id: depositId },
        data: {
          status: "FAILED",
          adminNotes: `Từ chối bởi Admin ${session.displayName}: ${notes || "Không khớp thông tin"}`,
        },
      });

      await recordAdminLog({
        adminId: session.id,
        action: "MANUAL_REJECT_DEPOSIT",
        targetType: "WALLET",
        targetId: deposit.userId,
        details: { transactionCode: deposit.transactionCode, amount: deposit.amount, notes },
        ipAddress: req.headers.get("x-forwarded-for"),
      });

      return NextResponse.json({
        success: true,
        message: "Đã từ chối giao dịch nạp tiền.",
        deposit: rejected,
      });
    }
  } catch (error: any) {
    console.error("Admin deposit action error:", error);
    return NextResponse.json({ error: error.message || "Failed to process deposit action" }, { status: 500 });
  }
}

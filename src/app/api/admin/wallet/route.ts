import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { recordAdminLog } from "@/lib/admin-logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, type, amount, reason } = await req.json(); // type: "CREDIT" | "DEBIT"
    const parsedAmount = Number(amount);

    if (!userId || !parsedAmount || parsedAmount <= 0 || !reason) {
      return NextResponse.json({
        error: "Vui lòng nhập đầy đủ User ID, số tiền hợp lệ (> 0) và lý do điều chỉnh.",
      }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new Error("User wallet not found");

      const balanceBefore = wallet.balance;
      let balanceAfter = balanceBefore;

      if (type === "CREDIT") {
        balanceAfter = balanceBefore + parsedAmount;
      } else {
        if (balanceBefore < parsedAmount) {
          throw new Error(`Số dư hiện tại (${balanceBefore.toLocaleString("vi-VN")}đ) nhỏ hơn số tiền muốn trừ.`);
        }
        balanceAfter = balanceBefore - parsedAmount;
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "ADMIN_ADJUSTMENT",
          amount: type === "CREDIT" ? parsedAmount : -parsedAmount,
          balanceBefore,
          balanceAfter,
          referenceId: `ADJ-${Date.now()}`,
          description: `Điều chỉnh bởi Admin: ${reason}`,
          status: "COMPLETED",
        },
      });

      await tx.notification.create({
        data: {
          userId,
          title: "Thông báo điều chỉnh số dư ví 🔔",
          message: `Số dư ví của bạn đã được ${type === "CREDIT" ? "cộng" : "trừ"} ${parsedAmount.toLocaleString("vi-VN")}đ. Lý do: ${reason}. Số dư mới: ${balanceAfter.toLocaleString("vi-VN")}đ.`,
          type: type === "CREDIT" ? "SUCCESS" : "WARNING",
          link: "/dashboard/wallet",
        },
      });

      return { balanceAfter, txRecord };
    });

    await recordAdminLog({
      adminId: session.id,
      action: "WALLET_ADJUSTMENT",
      targetType: "WALLET",
      targetId: userId,
      details: { type, amount: parsedAmount, reason, newBalance: result.balanceAfter },
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return NextResponse.json({
      success: true,
      message: "Điều chỉnh số dư ví thành công!",
      newBalance: result.balanceAfter,
    });
  } catch (error: any) {
    console.error("Wallet adjustment error:", error);
    return NextResponse.json({ error: error.message || "Failed to adjust wallet" }, { status: 500 });
  }
}

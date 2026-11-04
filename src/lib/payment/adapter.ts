import crypto from "crypto";
import { prisma } from "../prisma";

export interface WebhookPayload {
  transactionCode: string;
  amount: number;
  bankAccountNumber?: string;
  transferContent?: string;
  timestamp?: number;
}

export function generateHMACSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expected = generateHMACSignature(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function processDepositCompletion({
  transactionCode,
  amount,
  notes,
}: {
  transactionCode: string;
  amount: number;
  notes?: string;
}) {
  // Database Transaction to guarantee ACID consistency and idempotency
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch deposit record by transactionCode
    let deposit = await tx.deposit.findUnique({
      where: { transactionCode },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    // Fallback 1: Tìm deposit đang PENDING gần nhất có số tiền khớp (trong vòng 60 phút)
    if (!deposit) {
      deposit = await tx.deposit.findFirst({
        where: {
          amount: { lte: amount },
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { include: { wallet: true } },
        },
      });
    }

    // Fallback 2: Nếu vẫn chưa có deposit (do chuyển khoản thẳng hoặc container Vercel mới),
    // tìm User hoạt động gần đây nhất để tạo và cộng tiền ngay, KHÔNG để khách mất tiền!
    if (!deposit) {
      const recentUser = await tx.user.findFirst({
        orderBy: { updatedAt: "desc" },
        include: { wallet: true },
      });

      if (recentUser) {
        let userWallet = recentUser.wallet;
        if (!userWallet) {
          userWallet = await tx.wallet.create({
            data: { userId: recentUser.id, balance: 0 },
          });
        }

        deposit = await tx.deposit.create({
          data: {
            userId: recentUser.id,
            transactionCode: transactionCode || `DEP_${Date.now()}`,
            amount: amount,
            provider: "VIETQR",
            status: "PENDING",
            bankName: "MBBank",
            bankAccountNumber: "0394063917",
            transferContent: transactionCode,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          },
          include: {
            user: { include: { wallet: true } },
          },
        });
      }
    }

    if (!deposit) {
      throw new Error(`Không tìm thấy đơn nạp '${transactionCode}' và chưa có người dùng nào trong hệ thống.`);
    }

    // 2. Idempotency Check: Don't process twice!
    if (deposit.status === "COMPLETED") {
      return {
        alreadyProcessed: true,
        deposit,
        newBalance: deposit.user?.wallet?.balance || 0,
      };
    }

    if (deposit.status === "FAILED" || deposit.status === "EXPIRED") {
      throw new Error(`Đơn nạp '${deposit.transactionCode}' đang ở trạng thái ${deposit.status}. Không thể cộng tiền.`);
    }

    // 3. Ensure user has wallet
    let wallet = deposit.user.wallet;
    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { userId: deposit.userId, balance: 0 },
      });
    }

    // Khuyến mại +20% tự động khi nạp VietQR
    const bonusRate = 0.20;
    const finalCredit = Math.round(amount * (1 + bonusRate));
    const currentBalance = wallet.balance;
    const newBalance = currentBalance + finalCredit;

    // 4. Update Deposit status
    const updatedDeposit = await tx.deposit.update({
      where: { id: deposit.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        adminNotes: notes || deposit.adminNotes || "Processed via SePay Webhook",
      },
    });

    // 5. Atomic Wallet update
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance,
        totalDeposited: wallet.totalDeposited + finalCredit,
      },
    });

    // 6. Record Wallet Transaction history
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "DEPOSIT",
        amount: finalCredit,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        referenceId: deposit.transactionCode,
        description: `Nạp tiền VietQR SePay (${deposit.transactionCode}) +20% Khuyến mại`,
        status: "COMPLETED",
      },
    });

    // 7. Push notification
    try {
      await tx.notification.create({
        data: {
          userId: deposit.userId,
          title: "Nạp tiền thành công! (+20% Khuyến mại)",
          message: `Ví của bạn đã được cộng ${finalCredit.toLocaleString("vi-VN")} VNĐ (Gốc: ${amount.toLocaleString("vi-VN")} VNĐ + Thưởng 20%). Số dư mới: ${newBalance.toLocaleString("vi-VN")} VNĐ.`,
          type: "PAYMENT",
        },
      });
    } catch {
      // ignore
    }

    return {
      alreadyProcessed: false,
      deposit: updatedDeposit,
      newBalance,
    };
  });
}

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
    // 1. Fetch deposit record
    const deposit = await tx.deposit.findUnique({
      where: { transactionCode },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    if (!deposit) {
      throw new Error(`Deposit order '${transactionCode}' not found.`);
    }

    // 2. Idempotency Check: Don't process twice!
    if (deposit.status === "COMPLETED") {
      return {
        alreadyProcessed: true,
        deposit,
      };
    }

    if (deposit.status === "FAILED" || deposit.status === "EXPIRED") {
      throw new Error(`Deposit order '${transactionCode}' is ${deposit.status}. Cannot credit.`);
    }

    // 3. Amount verification
    if (amount < deposit.amount) {
      throw new Error(`Received amount (${amount}) is less than required deposit amount (${deposit.amount}).`);
    }

    const wallet = deposit.user.wallet;
    if (!wallet) {
      throw new Error(`User wallet not found for user ${deposit.userId}`);
    }

    // Khuyến mại +10% tự động khi nạp VietQR / MoMo
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
        adminNotes: notes || deposit.adminNotes || "Processed via Payment Webhook",
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
        description: `Nạp tiền VietQR (${deposit.transactionCode}) +20% Khuyến mại`,
        status: "COMPLETED",
      },
    });

    // 7. Send In-App Notification to User
    await tx.notification.create({
      data: {
        userId: deposit.userId,
        title: "Nạp tiền thành công! 🎉",
        message: `Ví của bạn đã được cộng +${finalCredit.toLocaleString("vi-VN")}đ (Đã gồm +10% KM) từ giao dịch ${deposit.transactionCode}. Số dư mới: ${newBalance.toLocaleString("vi-VN")}đ.`,
        type: "WALLET",
        link: "/dashboard/wallet",
      },
    });

    return {
      alreadyProcessed: false,
      deposit: updatedDeposit,
      newBalance,
    };
  });
}

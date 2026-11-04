import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { generateVietQRUrl, getBankBin } from "@/lib/payment/vietqr";

const depositSchema = z.object({
  amount: z.number().min(20000, "Số tiền nạp tối thiểu là 20.000đ").max(20000000, "Số tiền nạp tối đa là 20.000.000đ"),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để nạp tiền vào ví" }, { status: 401 });
    }

    const body = await req.json();
    const validated = depositSchema.safeParse(body);
    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Số tiền nạp không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { amount } = validated.data;

    // Fetch active bank provider or default settings
    const provider = await prisma.paymentProvider.findFirst({
      where: { code: "VIETQR", isActive: true },
    });

    const bankName = process.env.BANK_NAME || provider?.bankName || "MBBank";
    const bankBin = process.env.BANK_BIN || getBankBin(bankName);
    const bankAccount = process.env.BANK_ACCOUNT || provider?.bankAccount || "0394063917";
    const bankAccountName = process.env.BANK_ACCOUNT_NAME || provider?.bankAccountName || "NGUYEN TRONG KHANG";

    // Generate unique concise transaction code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const transactionCode = `RBXDEP${Date.now().toString().slice(-6)}${randomSuffix}`;
    const transferContent = transactionCode;

    // Generate VietQR URL
    const qrUrl = generateVietQRUrl({
      bankBin,
      accountNumber: bankAccount,
      accountName: bankAccountName,
      amount,
      transferContent,
    });

    // Expiration: 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const deposit = await prisma.deposit.create({
      data: {
        userId: session.id,
        transactionCode,
        amount,
        provider: "VIETQR",
        qrUrl,
        status: "PENDING",
        bankName,
        bankAccountNumber: bankAccount,
        transferContent,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        transactionCode: deposit.transactionCode,
        amount: deposit.amount,
        qrUrl: deposit.qrUrl,
        bankName: deposit.bankName,
        bankAccountNumber: deposit.bankAccountNumber,
        bankAccountName,
        transferContent: deposit.transferContent,
        expiresAt: deposit.expiresAt,
        status: deposit.status,
      },
    });
  } catch (error) {
    console.error("Deposit creation error:", error);
    return NextResponse.json({ error: "Lỗi tạo yêu cầu nạp tiền" }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Thiếu mã giao dịch" }, { status: 400 });
    }

    const deposit = await prisma.deposit.findFirst({
      where: { 
        transactionCode: code,
        userId: session.id,
      },
      select: {
        id: true,
        transactionCode: true,
        amount: true,
        status: true,
        completedAt: true,
      },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Không tìm thấy giao dịch" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deposit,
      isCompleted: deposit.status === "COMPLETED",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Lỗi kiểm tra trạng thái" }, { status: 500 });
  }
}

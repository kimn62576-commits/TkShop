import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { processDepositCompletion } from "@/lib/payment/adapter";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionCode } = await req.json();
    if (!transactionCode) {
      return NextResponse.json({ error: "Missing transactionCode" }, { status: 400 });
    }

    const deposit = await prisma.deposit.findUnique({
      where: { transactionCode },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.userId !== session.id && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await processDepositCompletion({
      transactionCode,
      amount: deposit.amount,
      notes: "Sandbox Simulator Test Deposit (Verified)",
    });

    return NextResponse.json({
      success: true,
      message: "Sandbox payment simulation successful",
      deposit: result.deposit,
      newBalance: result.newBalance,
    });
  } catch (error: any) {
    console.error("Sandbox payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm sandbox deposit" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { handleCardCallbackResult } from "@/lib/card-service";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, outcome } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: "Thiếu requestId" }, { status: 400 });
    }

    const card = await prisma.cardDeposit.findUnique({
      where: { requestId },
    });

    if (!card) {
      return NextResponse.json({ error: "Không tìm thấy thẻ cào" }, { status: 404 });
    }

    // outcome: 'SUCCESS' (status: 1), 'WRONG_AMOUNT' (status: 2), 'FAILED' (status: 3)
    let status = 1;
    let realAmount = card.declaredAmount;
    let message = "Nạp thẻ thành công (Sandbox Simulate)";

    if (outcome === "WRONG_AMOUNT") {
      status = 2;
      realAmount = Math.max(10000, Math.floor(card.declaredAmount / 2));
      message = `Thẻ sai mệnh giá (Khai ${card.declaredAmount.toLocaleString()}đ, thực ${realAmount.toLocaleString()}đ)`;
    } else if (outcome === "FAILED") {
      status = 3;
      message = "Thẻ cào không hợp lệ hoặc đã qua sử dụng (Sandbox Simulate)";
    }

    const result = await handleCardCallbackResult({
      requestId,
      status,
      realAmount,
      message,
    });

    return NextResponse.json({
      success: true,
      message: `Đã giả lập kết quả: ${outcome}`,
      result,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi mô phỏng gạch thẻ" },
      { status: 500 }
    );
  }
}

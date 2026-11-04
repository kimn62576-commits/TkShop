import { NextRequest, NextResponse } from "next/server";
import { processDepositCompletion } from "@/lib/payment/adapter";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key") || "";
    const signature = req.headers.get("x-signature") || req.headers.get("x-sepay-signature") || "";
    const expectedSecret = process.env.SEPAY_API_KEY || process.env.PAYMENT_WEBHOOK_SECRET || "spsk_live_3ynKZLKeSY4oPc4RtGD53KZ8EukdVm24";

    // 01. Xác thực bảo mật từ SePay:
    // SePay gửi header: "Authorization: Apikey spsk_live_..." hoặc "Authorization: Bearer spsk_live_..."
    const isAuthorized = 
      authHeader.includes(expectedSecret) || 
      authHeader.includes("spsk_live_3ynKZLKeSY4oPc4RtGD53KZ8EukdVm24") ||
      signature === expectedSecret ||
      process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      console.warn("[SePay Webhook] Không vượt qua xác thực API Key từ SePay:", authHeader);
      return NextResponse.json({ error: "Unauthorized SePay Webhook" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 02. Kiểm tra chiều giao dịch (transferType):
    // Chỉ xử lý tiền vào ("in"), nếu là tiền ra ("out") thì bỏ qua để không lỗi
    if (payload.transferType && payload.transferType.toLowerCase() === "out") {
      return NextResponse.json({
        success: true,
        message: "Giao dịch chuyển tiền ra (out) — Đã bỏ qua",
      });
    }

    // 03. Trích xuất thông tin giao dịch từ SePay:
    const transferContent = (payload.content || payload.description || payload.transferContent || "").toString();
    const amount = Number(payload.transferAmount || payload.amount || 0);

    // Tìm mã giao dịch RBXDEP... trong nội dung chuyển khoản
    const match = transferContent.match(/RBXDEP[0-9A-Za-z]+/i);
    const transactionCode = payload.transactionCode || (match ? match[0].toUpperCase() : null);

    if (!transactionCode || amount <= 0) {
      console.warn(`[SePay Webhook] Không tìm thấy mã nạp RBXDEP trong nội dung: "${transferContent}"`);
      return NextResponse.json({
        error: "Không tìm thấy mã giao dịch RBXDEP hợp lệ trong nội dung chuyển khoản",
        content: transferContent,
      }, { status: 400 });
    }

    // 04. Cộng tiền vào ví user và cộng thêm +10% khuyến mại tự động
    const result = await processDepositCompletion({
      transactionCode,
      amount,
      notes: `SePay tự động: ${payload.gateway || "Ngân hàng"} - GD: ${payload.referenceCode || payload.id || "Live"}`,
    });

    return NextResponse.json({
      success: true,
      message: result.alreadyProcessed ? "Giao dịch này đã được cộng tiền trước đó" : "Cộng tiền ví thành công (+10% Bonus)",
      transactionCode,
      newBalance: result.newBalance,
    });

  } catch (error: any) {
    console.error("Lỗi xử lý SePay webhook:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi xử lý webhook nạp tiền" },
      { status: 500 }
    );
  }
}

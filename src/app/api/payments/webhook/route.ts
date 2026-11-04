import { NextRequest, NextResponse } from "next/server";
import { processDepositCompletion } from "@/lib/payment/adapter";

// Hỗ trợ GET để SePay hoặc trình duyệt kiểm tra ping endpoint (tránh lỗi 405 Method Not Allowed)
export async function GET() {
  return NextResponse.json({
    success: true,
    status: "READY",
    message: "SePay Webhook Endpoint is Active & Ready to receive bank transactions",
    endpoint: "/api/payments/webhook",
    timestamp: new Date().toISOString(),
  });
}

// Hỗ trợ OPTIONS cho CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

// Hỗ trợ HEAD
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// Xử lý POST Webhook từ SePay khi có biến động số dư
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key") || "";
    const signature = req.headers.get("x-signature") || req.headers.get("x-sepay-signature") || "";
    const expectedSecret = process.env.SEPAY_API_KEY || process.env.PAYMENT_WEBHOOK_SECRET || "spsk_live_3ynKZLKeSY4oPc4RtGD53KZ8EukdVm24";

    // 01. Xác thực bảo mật từ SePay:
    // Hỗ trợ cả 2 chế độ: "API Key" hoặc "Không xác thực"
    const isAuthorized =
      !authHeader || // Nếu người dùng chọn 'Không xác thực' trên SePay
      authHeader.includes(expectedSecret) ||
      authHeader.includes("spsk_live_3ynKZLKeSY4oPc4RtGD53KZ8EukdVm24") ||
      signature === expectedSecret ||
      process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      console.warn("[SePay Webhook] Không vượt qua xác thực API Key từ SePay:", authHeader);
      return NextResponse.json({ error: "Unauthorized SePay Webhook" }, { status: 401 });
    }

    let payload: any = {};
    if (rawBody && rawBody.trim()) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
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

    // Xử lý gói tin PING kiểm tra thử nghiệm (nếu số tiền <= 0 hoặc nội dung chỉ là test ping)
    if (amount <= 0 || transferContent.toLowerCase().includes("test ping") || transferContent.toLowerCase().includes("kiem tra webhook")) {
      console.log(`[SePay Webhook] Gói tin ping kiểm tra kết nối: "${transferContent}"`);
      return NextResponse.json({
        success: true,
        message: "SePay Webhook Test Ping Thành Công! Endpoint hoạt động hoàn hảo.",
        receivedContent: transferContent,
      }, { status: 200 });
    }

    // Tìm mã giao dịch RBXDEP... trong nội dung chuyển khoản
    const match = transferContent.match(/RBXDEP[0-9A-Za-z]+/i);
    const transactionCode = payload.transactionCode || (match ? match[0].toUpperCase() : `DEP_SEPAY_${payload.id || payload.referenceCode || Date.now()}`);

    console.log(`[SePay Webhook] Bắt đầu xử lý nạp tiền tự động: Số tiền=${amount}, Mã GD=${transactionCode}, ND="${transferContent}"`);

    // 04. Cộng tiền vào ví user và cộng thêm +20% khuyến mại tự động
    const result = await processDepositCompletion({
      transactionCode,
      amount,
      notes: `SePay tự động: ${payload.gateway || "MBBank"} - Mã GD: ${payload.referenceCode || payload.id || "Live"} - ND: ${transferContent}`,
    });

    return NextResponse.json({
      success: true,
      message: result.alreadyProcessed ? "Giao dịch này đã được cộng tiền trước đó" : "Cộng tiền ví thành công (+20% Bonus)",
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

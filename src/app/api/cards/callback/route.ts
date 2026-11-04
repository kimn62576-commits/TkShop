import { NextRequest, NextResponse } from "next/server";
import { handleCardCallbackResult, md5 } from "@/lib/card-service";

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  try {
    let params: Record<string, string> = {};

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
    } else {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        params = await req.json();
      } else {
        const formData = await req.formData();
        formData.forEach((val, key) => {
          params[key] = val.toString();
        });
      }
    }

    // Các biến phổ biến từ TheSieuRe, TrumThe, CardVIP, Doithecao
    const statusRaw = params.status || params.trangthai || params.Status;
    const requestId = params.request_id || params.requestid || params.RequestId || params.content;
    const declaredAmountRaw = params.amount || params.pricesvalue || params.menhgia;
    const realAmountRaw = params.value || params.value_receive || params.real_amount || params.amount;
    const message = params.message || params.msg || params.ghichu || "";
    const callbackSign = params.callback_sign || params.sign || "";

    if (!requestId) {
      return NextResponse.json({ status: "error", message: "Thiếu request_id" }, { status: 400 });
    }

    const partnerKey = process.env.CARD_PARTNER_KEY;
    // Kiểm tra chữ ký an toàn nếu partnerKey được cấu hình
    if (partnerKey && callbackSign) {
      const code = params.code || params.card_code || "";
      const serial = params.serial || params.card_seri || "";
      const expectedSign = md5(partnerKey + code + serial);
      if (callbackSign !== expectedSign && callbackSign !== md5(partnerKey + requestId)) {
        console.warn(`[Card Webhook] Sai chữ ký callback_sign cho request ${requestId}`);
      }
    }

    const status = parseInt(statusRaw || "0", 10);
    const realAmount = realAmountRaw ? parseInt(realAmountRaw.toString(), 10) : undefined;
    const declaredAmount = declaredAmountRaw ? parseInt(declaredAmountRaw.toString(), 10) : undefined;

    const result = await handleCardCallbackResult({
      requestId,
      status,
      realAmount,
      declaredAmount,
      message,
    });

    return NextResponse.json({
      status: "success",
      message: "Đã xử lý callback thẻ cào thành công",
      result,
    });

  } catch (error: any) {
    console.error("Lỗi xử lý callback thẻ cào:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Lỗi xử lý callback" },
      { status: 500 }
    );
  }
}

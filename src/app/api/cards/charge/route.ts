import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { 
  generateCardRequestId, 
  sendToTheSieuReGateway, 
  handleCardCallbackResult 
} from "@/lib/card-service";

const cardChargeSchema = z.object({
  telco: z.string().min(2, "Vui lòng chọn loại thẻ"),
  declaredAmount: z.number().min(10000, "Mệnh giá tối thiểu là 10.000đ"),
  pin: z.string().min(5, "Mã thẻ PIN tối thiểu 5 ký tự"),
  serial: z.string().min(5, "Số seri tối thiểu 5 ký tự"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để nạp thẻ cào" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = cardChargeSchema.safeParse(body);
    if (!validated.success) {
      const msg = validated.error.issues?.[0]?.message || "Thông tin thẻ không hợp lệ";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { telco, declaredAmount, pin, serial } = validated.data;
    const cleanPin = pin.trim().replace(/\s+/g, "");
    const cleanSerial = serial.trim().replace(/\s+/g, "");

    // 01. Kiểm tra xem mã thẻ & seri này đã từng được gửi lên hệ thống chưa
    const existing = await prisma.cardDeposit.findFirst({
      where: {
        pin: cleanPin,
        serial: cleanSerial,
        telco: telco.toUpperCase(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Thẻ này đã tồn tại trong hệ thống, vui lòng không gửi lại!" },
        { status: 400 }
      );
    }

    // 02. Kiểm tra giới hạn thẻ đang xử lý của user (chống spam flood)
    const pendingCount = await prisma.cardDeposit.count({
      where: {
        userId: session.id,
        status: "PENDING",
      },
    });

    if (pendingCount >= 5) {
      return NextResponse.json(
        { error: "Bạn đang có 5 thẻ đang chờ xử lý. Vui lòng đợi trong giây lát!" },
        { status: 429 }
      );
    }

    // 03. Lấy mức chiết khấu hiện tại cho loại thẻ và mệnh giá này
    const discountRecord = await prisma.cardDiscount.findFirst({
      where: {
        telco: telco.toUpperCase(),
        amount: declaredAmount,
        isActive: true,
      },
    });

    const discountFee = discountRecord ? discountRecord.discount : 15; // Mặc định 15% nếu chưa cấu hình
    if (discountRecord && discountRecord.discount === 0) {
      // 0% có thể là nạp 1:1 hoặc đang bảo trì, nếu isActive = false thì bảo trì
      if (!discountRecord.isActive) {
        return NextResponse.json(
          { error: `Loại thẻ ${telco} mệnh giá này đang bảo trì, vui lòng quay lại sau` },
          { status: 400 }
        );
      }
    }

    const receivedAmount = Math.round(declaredAmount - (declaredAmount * discountFee) / 100);
    const requestId = generateCardRequestId();

    // 04. Tạo bản ghi CardDeposit trong cơ sở dữ liệu
    const newCard = await prisma.cardDeposit.create({
      data: {
        userId: session.id,
        requestId,
        telco: telco.toUpperCase(),
        declaredAmount,
        receivedAmount,
        discountFee,
        pin: cleanPin,
        serial: cleanSerial,
        status: "PENDING",
        gateway: process.env.CARD_PARTNER_ID ? "THESIEURE" : "SANDBOX",
        note: "Đang chờ duyệt từ nhà mạng",
      },
    });

    // 05. Kiểm tra xem có cấu hình Gateway thật (TheSieuRe / TrumThe / GachThe1s) không
    const partnerId = process.env.CARD_PARTNER_ID;
    const partnerKey = process.env.CARD_PARTNER_KEY;
    const gatewayUrl = process.env.CARD_GATEWAY_URL;

    if (partnerId && partnerKey) {
      // Gửi sang cổng đối tác thật
      const gatewayResponse = await sendToTheSieuReGateway({
        telco: telco.toUpperCase(),
        pin: cleanPin,
        serial: cleanSerial,
        amount: declaredAmount,
        requestId,
        partnerId,
        partnerKey,
        endpoint: gatewayUrl,
      });

      // Nếu cổng đối tác xử lý tức thì (status: 1, 2, 3)
      if (gatewayResponse && gatewayResponse.status !== 99) {
        await handleCardCallbackResult({
          requestId,
          status: gatewayResponse.status,
          realAmount: gatewayResponse.amount || declaredAmount,
          message: gatewayResponse.message,
        });

        const refreshed = await prisma.cardDeposit.findUnique({ where: { id: newCard.id } });
        return NextResponse.json({
          success: true,
          deposit: refreshed,
          message: gatewayResponse.message || "Đã xử lý kết quả thẻ cào",
        });
      }
    }

    return NextResponse.json({
      success: true,
      deposit: newCard,
      message: "Gửi thẻ thành công! Hệ thống đang tự động gạch thẻ qua cổng kết nối.",
    });

  } catch (error: any) {
    console.error("Lỗi nạp thẻ cào:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi gửi thẻ cào" },
      { status: 500 }
    );
  }
}

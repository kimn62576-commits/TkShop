import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { handleCardCallbackResult } from "@/lib/card-service";

// GET: Lấy danh sách thẻ cào và cấu hình chiết khấu cho Admin
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const telco = searchParams.get("telco");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (telco && telco !== "ALL") where.telco = telco;

    const [cards, discounts, stats] = await Promise.all([
      prisma.cardDeposit.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { displayName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.cardDiscount.findMany({
        orderBy: [{ telco: "asc" }, { amount: "asc" }],
      }),
      prisma.cardDeposit.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { receivedAmount: true, declaredAmount: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      cards,
      discounts,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi tải dữ liệu thẻ cào" },
      { status: 500 }
    );
  }
}

// POST: Admin duyệt thẻ hoặc từ chối thẻ thủ công
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId, action, realAmount, note } = await req.json();
    const card = await prisma.cardDeposit.findUnique({ where: { id: cardId } });

    if (!card) {
      return NextResponse.json({ error: "Không tìm thấy thẻ" }, { status: 404 });
    }

    if (card.status !== "PENDING") {
      return NextResponse.json({ error: "Thẻ này đã được xử lý" }, { status: 400 });
    }

    let status = 1; // Duyệt thành công
    if (action === "REJECT") status = 3;
    if (action === "WRONG_AMOUNT") status = 2;

    const result = await handleCardCallbackResult({
      requestId: card.requestId,
      status,
      realAmount: realAmount ? parseInt(realAmount, 10) : card.declaredAmount,
      message: note || (action === "APPROVE" ? "Admin duyệt thủ công" : "Admin từ chối thẻ"),
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi xử lý duyệt thẻ" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật chiết khấu thẻ cào
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discountId, discount, isActive } = await req.json();

    const updated = await prisma.cardDiscount.update({
      where: { id: discountId },
      data: {
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi cập nhật chiết khấu" },
      { status: 500 }
    );
  }
}

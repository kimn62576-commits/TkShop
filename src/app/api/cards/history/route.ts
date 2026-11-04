import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { maskSerial } from "@/lib/card-service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await prisma.cardDeposit.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const sanitized = cards.map((c) => ({
      ...c,
      pin: "••••••••" + c.pin.slice(-4),
      serial: maskSerial(c.serial),
    }));

    return NextResponse.json({
      success: true,
      cards: sanitized,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi lấy lịch sử thẻ" },
      { status: 500 }
    );
  }
}

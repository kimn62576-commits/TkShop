import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SUPPORTED_TELCOS, STANDARD_AMOUNTS } from "@/lib/card-service";

export async function GET() {
  try {
    const discounts = await prisma.cardDiscount.findMany({
      where: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      telcos: SUPPORTED_TELCOS,
      amounts: STANDARD_AMOUNTS,
      discounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi lấy bảng chiết khấu thẻ" },
      { status: 500 }
    );
  }
}

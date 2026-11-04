import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ items: [] });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.id },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { where: { isThumbnail: true }, take: 1 },
        },
      },
    },
  });

  return NextResponse.json({
    items: wishlist.map((w) => ({
      id: w.id,
      product: {
        id: w.product.id,
        title: w.product.title,
        slug: w.product.slug,
        price: w.product.price,
        originalPrice: w.product.originalPrice,
        discountPercent: w.product.discountPercent,
        isFree: w.product.isFree,
        category: w.product.category,
        thumbnail: w.product.images[0]?.imageUrl || "",
      },
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ added: false, message: "Đã xóa khỏi danh sách yêu thích" });
  } else {
    await prisma.wishlist.create({
      data: {
        userId: session.id,
        productId,
      },
    });
    return NextResponse.json({ added: true, message: "Đã thêm vào danh sách yêu thích" });
  }
}

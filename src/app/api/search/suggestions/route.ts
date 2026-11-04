import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim() || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q } },
        { subtitle: { contains: q } },
      ],
    },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      isFree: true,
      category: {
        select: { name: true, slug: true },
      },
      images: {
        where: { isThumbnail: true },
        take: 1,
        select: { imageUrl: true },
      },
    },
  });

  const suggestions = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    isFree: p.isFree,
    categoryName: p.category.name,
    thumbnail: p.images[0]?.imageUrl || "",
  }));

  return NextResponse.json({ suggestions });
}

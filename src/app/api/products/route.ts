import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");
    const isFree = searchParams.get("isFree");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12")));

    // Prisma query builder
    const where: any = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = {
        slug: categorySlug,
      };
    }

    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      };
    }

    if (isFree === "true") {
      where.isFree = true;
    } else if (isFree === "false") {
      where.isFree = false;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "popular") {
      orderBy = { salesCount: "desc" };
    } else if (sort === "rating") {
      orderBy = { ratingAverage: "desc" };
    } else if (sort === "price-low") {
      orderBy = { price: "asc" };
    } else if (sort === "price-high") {
      orderBy = { price: "desc" };
    }

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          where: { isThumbnail: true },
          take: 1,
        },
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      isFree: p.isFree,
      isFeatured: p.isFeatured,
      isTrending: p.isTrending,
      isBestSeller: p.isBestSeller,
      ratingAverage: p.ratingAverage,
      ratingCount: p.ratingCount,
      salesCount: p.salesCount,
      fileFormat: p.fileFormat,
      creatorName: p.creatorName,
      category: p.category,
      thumbnail: p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      products: formatted,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

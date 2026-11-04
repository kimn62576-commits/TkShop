import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { checkUserOwnership } from "@/lib/storage/delivery";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Nội dung đánh giá ít nhất 5 ký tự"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { profile: true },
      },
    },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        displayName: r.user.profile?.displayName || "Roblox Dev",
        avatarUrl: r.user.profile?.avatarUrl,
        robloxUsername: r.user.profile?.robloxUsername,
      },
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Vui lòng đăng nhập để đánh giá" }, { status: 401 });
  }

  const body = await req.json();
  const validated = reviewSchema.safeParse(body);
  if (!validated.success) {
    const msg = validated.error.issues?.[0]?.message || "Đánh giá không hợp lệ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { productId, rating, comment } = validated.data;

  // Check ownership
  const owns = await checkUserOwnership(session.id, productId);
  if (!owns) {
    return NextResponse.json({ error: "Chỉ người đã sở hữu sản phẩm mới có thể gửi đánh giá." }, { status: 403 });
  }

  // Create or update review
  const review = await prisma.review.upsert({
    where: {
      productId_userId: {
        productId,
        userId: session.id,
      },
    },
    update: { rating, comment, isApproved: true },
    create: {
      productId,
      userId: session.id,
      rating,
      comment,
      isApproved: true,
    },
  });

  // Recalculate average rating for product
  const allReviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    select: { rating: true },
  });

  const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / (allReviews.length || 1);

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingAverage: parseFloat(avg.toFixed(1)),
      ratingCount: allReviews.length,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Cảm ơn bạn đã gửi đánh giá!",
    review,
  });
}

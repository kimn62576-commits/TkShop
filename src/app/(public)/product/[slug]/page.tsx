import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { title: true, subtitle: true },
  });

  if (!product) return { title: "Product Not Found - Roblox Asset Marketplace" };

  return {
    title: `${product.title} - Roblox Studio Asset Marketplace`,
    description: product.subtitle || "Tải tài nguyên Roblox Studio chất lượng cao.",
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      files: { orderBy: { createdAt: "desc" } },
      versions: { orderBy: { releaseDate: "desc" } },
      tags: { include: { tag: true } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        include: {
          user: { include: { profile: true } },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Increment view count asynchronously
  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  // Check if current user owns this product
  let isPurchased = false;
  if (session) {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          userId: session.id,
          status: "COMPLETED",
        },
      },
    });
    isPurchased = !!orderItem;
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isThumbnail: true }, take: 1 },
    },
  });

  return (
    <ProductDetailClient
      product={product}
      isPurchased={isPurchased}
      currentUser={session}
      relatedProducts={relatedProducts}
    />
  );
}

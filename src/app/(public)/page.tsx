import React from "react";
import { prisma } from "@/lib/prisma";
import EditorialHero from "@/components/home/EditorialHero";
import EditorialShowcase from "@/components/home/EditorialShowcase";
import EditorialWorkflow from "@/components/home/EditorialWorkflow";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import HomeFAQ from "@/components/home/HomeFAQ";

export const revalidate = 60;

export default async function HomePage() {
  const [
    categories, 
    featuredProducts, 
    recentProducts, 
    bestSellerProducts
  ] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: 10,
      orderBy: { salesCount: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isThumbnail: true }, take: 1 },
      },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isThumbnail: true }, take: 1 },
      },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isBestSeller: true },
      take: 4,
      orderBy: { ratingAverage: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isThumbnail: true }, take: 1 },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12 sm:space-y-16">
      
      {/* 01. CINEMATIC EDITORIAL HERO SECTION */}
      <EditorialHero />

      {/* 02. ASYMMETRIC CURATED BENTO SHOWCASE */}
      <EditorialShowcase products={featuredProducts as any} categories={categories as any} />

      {/* 03. ENGINEERED STUDIO WORKFLOW PIPELINE */}
      <EditorialWorkflow />

      {/* 04. BẢNG XẾP HẠNG ĐUA TOP NẠP */}
      <div id="bxh-nap" className="scroll-mt-24">
        <LeaderboardSection />
      </div>

      {/* 05. TIN TỨC & CẨM NANG ROBLOX STUDIO */}
      <HomeNewsSection />

      {/* 06. CÂU HỎI THƯỜNG GẶP */}
      <HomeFAQ />

    </div>
  );
}

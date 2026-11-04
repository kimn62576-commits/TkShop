"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Star, Download, Eye, ShoppingCart, 
  ArrowRight, ShieldCheck, Zap, Layers, Check 
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import ScrollReveal from "../motion/ScrollReveal";
import TextReveal from "../motion/TextReveal";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  salesCount: number;
  ratingAverage: number;
  fileFormat: string;
  category?: { name: string; slug: string };
  images?: { imageUrl: string; isThumbnail?: boolean }[];
  isFeatured?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface EditorialShowcaseProps {
  products: Product[];
  categories: Category[];
}

export default function EditorialShowcase({ products, categories }: EditorialShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredProducts = selectedCategory === "ALL"
    ? products
    : products.filter((p) => p.category?.slug === selectedCategory);

  const heroAsset = filteredProducts[0] || products[0];
  const sideAssets = filteredProducts.slice(1, 4);
  const remainingAssets = filteredProducts.slice(4, 8);

  return (
    <section className="py-10 select-none">
      
      {/* 01. SECTION HEADER & FLUID CATEGORY TABS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BỘ SƯU TẬP TUYỂN CHỌN</span>
            </div>
          </ScrollReveal>
          
          <TextReveal
            as="h2"
            text="ASSET NỔI BẬT DÀNH CHO DỰ ÁN CỦA BẠN"
            className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
          />
        </div>

        {/* Fluid Pill Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === "ALL"
                ? "text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            {selectedCategory === "ALL" && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-md shadow-sky-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">Tất Cả ({products.length})</span>
          </button>

          {categories.slice(0, 4).map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-md shadow-sky-500/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 02. ASYMMETRIC CURATED BENTO SHOWCASE */}
      {heroAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          
          {/* HERO SPOTLIGHT ASSET (lg:col-span-7) */}
          <ScrollReveal className="lg:col-span-7">
            <Link
              href={`/product/${heroAsset.slug}`}
              className="group block relative h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 shadow-xl transition-all duration-500 hover:border-sky-500/60"
              data-cursor="card"
              data-cursor-text="CHI TIẾT"
            >
              {/* Image with scale and mask effect */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                <img
                  src={heroAsset.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"}
                  alt={heroAsset.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-sky-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                    ★ TIÊU ĐIỂM TUẦN
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold">
                    {heroAsset.category?.name || "Roblox Asset"}
                  </span>
                </div>
              </div>

              {/* Bottom Spotlight Info */}
              <div className="p-6 sm:p-7 space-y-3 relative -mt-12 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                    Đã bán {heroAsset.salesCount || 128} lượt • {heroAsset.fileFormat || ".RBXM"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{heroAsset.ratingAverage?.toFixed(1) || "5.0"}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  {heroAsset.title}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                      {heroAsset.price === 0 ? "MIỄN PHÍ" : formatVND(heroAsset.price)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">/ Sở hữu vĩnh viễn</span>
                  </div>

                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all">
                    <span>Xem Thử</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* SECONDARY STACK: 3 CURATED ASSETS (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {sideAssets.map((asset, idx) => (
              <ScrollReveal key={asset.id} delay={idx * 0.1}>
                <Link
                  href={`/product/${asset.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 hover:border-sky-500/60 transition-all duration-300 shadow-md hover:shadow-xl"
                  data-cursor="card"
                  data-cursor-text="XEM"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-200 dark:border-white/10">
                    <img
                      src={asset.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[9px] font-mono font-bold text-sky-400">
                      {asset.fileFormat || ".rbxm"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {asset.category?.name || "Asset"}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold font-mono">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{asset.ratingAverage?.toFixed(1) || "5.0"}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-sky-500 transition-colors">
                      {asset.title}
                    </h4>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono font-bold text-amber-500 dark:text-amber-400 text-sm">
                        {asset.price === 0 ? "Miễn Phí" : formatVND(asset.price)}
                      </span>
                      <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

        </div>
      )}

      {/* 03. REMAINING CURATED ASSETS GRID (4 COLUMNS) */}
      {remainingAssets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {remainingAssets.map((asset, idx) => (
            <ScrollReveal key={asset.id} delay={idx * 0.08}>
              <Link
                href={`/product/${asset.slug}`}
                className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 overflow-hidden hover:border-sky-500/60 transition-all duration-300 shadow-sm hover:shadow-xl"
                data-cursor="card"
                data-cursor-text="XEM"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={asset.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-sky-400 text-[10px] font-mono font-bold border border-white/10">
                    {asset.fileFormat || ".rbxm"}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">
                      {asset.category?.name || "Studio Asset"}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors">
                      {asset.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="font-mono font-black text-amber-500 text-xs sm:text-sm">
                      {asset.price === 0 ? "Miễn Phí" : formatVND(asset.price)}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-sky-500 group-hover:text-slate-950 flex items-center justify-center transition-colors text-slate-700 dark:text-white">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Bottom CTA to View All */}
      <div className="mt-10 text-center">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 transition-all hover:scale-105 cursor-pointer"
        >
          <span>Xem Toàn Bộ {products.length}+ Tài Nguyên Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight, Flame, Sparkles } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    isFree?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    ratingAverage?: number;
    ratingCount?: number;
    fileFormat?: string;
    salesCount?: number;
    category?: {
      name: string;
      slug: string;
    };
    images?: {
      imageUrl: string;
      isThumbnail: boolean;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail =
    product.images?.find((img) => img.isThumbnail)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800";

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-b from-sky-400/35 via-blue-200/50 to-slate-200 dark:from-sky-500/50 dark:via-blue-500/25 dark:to-[#1A2642] hover:from-sky-400 hover:via-blue-400 hover:to-indigo-500 dark:hover:from-sky-400 dark:hover:via-cyan-400 dark:hover:to-indigo-500 shadow-md hover:shadow-xl dark:hover:shadow-[0_10px_35px_rgba(56,189,248,0.35)] transition-all duration-300 group hover:-translate-y-1">
      <div className="bg-white dark:bg-gradient-to-b dark:from-[#111C38] dark:via-[#0E162C] dark:to-[#080D1A] rounded-[15px] overflow-hidden flex flex-col h-full transition-colors duration-300">
        
        {/* Khung Thumbnail Hình Ảnh */}
        <Link href={`/product/${product.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950 block">
          <img
            src={thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {/* Lớp gradient bóng đổ chân ảnh */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-[#080D1A] via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Huy Hiệu Bán Chạy / Nổi Bật / Khuyến Mãi */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {product.isBestSeller ? (
              <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-500/30">
                <Flame className="w-3 h-3 fill-current" />
                <span>BÁN CHẠY</span>
              </span>
            ) : product.isFeatured ? (
              <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/30">
                <Sparkles className="w-3 h-3" />
                <span>HOT</span>
              </span>
            ) : null}

            {discountPercent && (
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-black shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Định Dạng File (.rbxm, .luau) */}
          <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-sky-300 border border-sky-400/30 text-[10px] font-mono font-bold shadow-sm z-10">
            {product.fileFormat || ".rbxm"}
          </div>
        </Link>

        {/* Nội Dung Sản Phẩm */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          
          <div>
            {/* Tên Danh Mục Kiểu Gradient Nổi Bật */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-700 dark:from-sky-500/25 dark:via-blue-500/25 dark:to-indigo-500/25 dark:border-sky-400/40 dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider mb-1.5 shadow-xs transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse" />
              <span>{product.category?.name || "Roblox Asset"}</span>
            </div>

            {/* Tiêu Đề Sản Phẩm */}
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                {product.title}
              </h3>
            </Link>
          </div>

          {/* Thống Số: Số File & Đã Bán */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#050811] border border-slate-200/80 dark:border-[#16233B] rounded-xl px-3 py-2 font-mono shadow-xs dark:shadow-inner transition-colors">
            <span>File: <strong className="text-slate-800 dark:text-emerald-400 font-bold">Gốc 100%</strong></span>
            <span>Đã bán: <strong className="text-blue-600 dark:text-amber-400 font-black">{product.salesCount || 148}</strong></span>
          </div>

          {/* Giá Bán & Đánh Giá */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-400 dark:to-cyan-300 font-mono tracking-tight">
                {product.isFree ? "Miễn Phí" : formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && !product.isFree && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-400/15 border border-amber-200 dark:border-amber-400/30 px-2 py-0.5 rounded-lg font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
              <span>{product.ratingAverage?.toFixed(1) || "5.0"}</span>
            </div>
          </div>

          {/* Nút Xem Chi Tiết Gaming CTA Nổi Bật */}
          <Link
            href={`/product/${product.slug}`}
            className="w-full py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/40 active:scale-[0.98] mt-2 cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>

        </div>
      </div>
    </div>
  );
}

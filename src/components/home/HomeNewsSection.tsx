"use client";

import React from "react";
import Link from "next/link";
import { 
  Newspaper, Clock, ArrowRight, BookOpen, 
  Sparkles, Flame, CheckCircle2 
} from "lucide-react";
import { NEWS_ARTICLES } from "@/data/newsArticles";

export default function HomeNewsSection() {
  const articles = NEWS_ARTICLES.slice(0, 4);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "CHO NGƯỜI MỚI":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "LẬP TRÌNH LUAU":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "KIẾN THỨC NỀN TẢNG":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "HƯỚNG DẪN DỊCH VỤ":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30";
    }
  };

  return (
    <section className="space-y-6 select-none">
      
      {/* 01. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            <span>CẨM NANG & KINH NGHIỆM THỰC CHIẾN</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            TIN TỨC & HƯỚNG DẪN ROBLOX STUDIO
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Tài liệu nhập môn, cẩm nang lập trình Luau và hướng dẫn sử dụng dịch vụ nạp tự động tại TKSHOP.
          </p>
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all self-start sm:self-auto group"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 02. GRID 4 BÀI VIẾT NỔI BẬT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {articles.map((article, idx) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#0D1528] border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-sky-500/50 transition-all duration-300"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeClass(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                {article.tags[0]}
              </span>

              <span className="font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[11px]">
                <span>Đọc ngay</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}

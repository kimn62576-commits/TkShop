"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Newspaper, Sparkles, Clock, Calendar, ArrowRight, 
  Search, BookOpen, ShieldCheck, Zap, PhoneCall, Gift,
  CheckCircle2, Flame, User, ChevronRight
} from "lucide-react";
import { NEWS_ARTICLES, NewsArticle } from "@/data/newsArticles";

export default function NewsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "ALL", label: "Tất Cả Bài Viết" },
    { id: "CHO NGƯỜI MỚI", label: "Cho Người Mới" },
    { id: "LẬP TRÌNH LUAU", label: "Lập Trình Luau" },
    { id: "KIẾN THỨC NỀN TẢNG", label: "Kiến Thức Cốt Lõi" },
    { id: "HƯỚNG DẪN DỊCH VỤ", label: "Hướng Dẫn Nạp Tiền" },
  ];

  const filteredArticles = NEWS_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === "ALL" || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = NEWS_ARTICLES.find(a => a.featured) || NEWS_ARTICLES[0];
  const regularArticles = filteredArticles.filter(a => a.slug !== featuredArticle.slug || selectedCategory !== "ALL" || searchQuery);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      
      {/* 01. BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-sky-500 transition-colors">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-bold">Tin Tức & Cẩm Nang Studio</span>
      </nav>

      {/* 02. HERO HEADER SECTION */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#0B1325] to-slate-950 text-white overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KHO TRI THỨC ROBLOX STUDIO</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            CẨM NANG & HƯỚNG DẪN DÀNH CHO CREATOR
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Tổng hợp các bài viết hướng dẫn từ số 0 dành cho Newbie, kinh nghiệm lập trình Luau, mẹo tối ưu hóa 60 FPS trong Roblox Studio và quy trình nạp tiền nhận ưu đãi tại TKSHOP.
          </p>

          {/* Ô Tìm Kiếm Bài Viết */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết: người mới, học code, nạp tiền..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 text-xs text-white placeholder-slate-400 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 03. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-400/40"
                : "bg-white dark:bg-[#0E172A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] border border-slate-200 dark:border-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 04. FEATURED SPOTLIGHT ARTICLE (CHỈ HIỆN KHI CHỌN ALL VÀ KHÔNG SEARCH) */}
      {selectedCategory === "ALL" && !searchQuery && featuredArticle && (
        <div className="relative group">
          <Link 
            href={`/news/${featuredArticle.slug}`}
            className="block rounded-3xl overflow-hidden bg-white dark:bg-[#0D1528] border border-slate-200/90 dark:border-sky-500/25 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-sky-400/50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Ảnh Cover Nổi Bật Bên Trái */}
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-950">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>BÀI VIẾT ĐỀ XUẤT</span>
                  </span>
                </div>
              </div>

              {/* Nội Dung Bên Phải */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(featuredArticle.category)}`}>
                      {featuredArticle.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{featuredArticle.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-sky-500 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={featuredArticle.author.avatar} 
                      alt={featuredArticle.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-sky-400/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                        {featuredArticle.author.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {featuredArticle.publishedAt}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

            </div>
          </Link>
        </div>
      )}

      {/* 05. DANH SÁCH BÀI VIẾT (GRID CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-sky-500" />
            <span>Danh Sách Cẩm Nang ({filteredArticles.length} bài viết)</span>
          </h3>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0D1528] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Không tìm thấy bài viết phù hợp</p>
            <p className="text-xs text-slate-500">Vui lòng thử tìm với từ khóa khác hoặc chọn mục Tất Cả Bài Viết.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#0D1528] border border-slate-200/90 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:border-sky-500/50 transition-all duration-300"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeClass(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{article.publishedAt}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Tag & CTA */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Xem</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 06. BANNER CALL TO ACTION DƯỚI CÙNG */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>HỖ TRỢ LÀM GAME ROBLOX TẬN TÂM</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-black uppercase">
            BẠN GẶP KHÓ KHĂN KHI TÍCH HỢP ASSET VÀO STUDIO?
          </h4>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            Liên hệ ngay Zalo 0394.063.917 để được đội ngũ kỹ thuật TKSHOP hỗ trợ import map, sửa lỗi script qua Ultraview hoàn toàn miễn phí.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="https://zalo.me/0394063917"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Zalo Kỹ Thuật 24/7</span>
          </a>

          <Link
            href="/marketplace"
            className="px-5 py-3 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap"
          >
            <span>Vào Cửa Hàng</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

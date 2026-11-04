"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/marketplace/ProductCard";
import PurchaseModal from "@/components/marketplace/PurchaseModal";
import DepositModal from "@/components/wallet/DepositModal";
import { 
  Filter, Search, SlidersHorizontal, RotateCcw, 
  ChevronLeft, ChevronRight, X, LayoutGrid, List, Sparkles, ShieldCheck 
} from "lucide-react";
import { formatVND } from "@/lib/utils";

function MarketplaceContent() {
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialIsFree = searchParams.get("isFree") || "all";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [q, setQ] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFree, setIsFree] = useState(initialIsFree);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals
  const [selectedProductForBuy, setSelectedProductForBuy] = useState<any | null>(null);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchUserBalance();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, isFree, sort, page, selectedFormat]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) setUserBalance(data.user.walletBalance);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
      if (isFree !== "all") params.set("isFree", isFree === "free" ? "true" : "false");
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("limit", "16");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      
      let prods = data.products || [];
      if (selectedFormat !== "all") {
        prods = prods.filter((p: any) => p.fileFormat?.toLowerCase().includes(selectedFormat.toLowerCase()));
      }

      setProducts(prods);
      setTotalCount(data.pagination?.totalCount || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setQ("");
    setSelectedCategory("all");
    setIsFree("all");
    setSelectedFormat("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Tiêu Đề Đầu Trang */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">
              HỆ SINH THÁI ROBLOX STUDIO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Kho Tài Nguyên Studio
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Hệ thống vũ khí, bản đồ môi trường và framework Luau chuẩn hóa cho nhà phát triển.
          </p>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tài nguyên..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white/95 border border-slate-200 rounded text-xs text-slate-900 placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
          />
        </form>
      </div>

      {/* Lưới Chính: Bộ Lọc Bên Trái + Sản Phẩm Bên Phải */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Bộ Lọc Bên Trái */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white/95 border border-slate-200 rounded-lg p-5 space-y-6 sticky top-20">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Bộ Lọc
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-white transition-colors"
              >
                Đặt Lại
              </button>
            </div>

            {/* Lọc Theo Danh Mục */}
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-2 uppercase">
                Danh Mục
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => { setSelectedCategory("all"); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between font-bold ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-700 hover:bg-slate-100 hover:text-sky-600"
                  }`}
                >
                  <span>Tất Cả Danh Mục</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between font-bold ${
                      selectedCategory === c.slug
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                        : "text-slate-700 hover:bg-slate-100 hover:text-sky-600"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      selectedCategory === c.slug ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {c._count?.products || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lọc Theo Mức Giá */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-mono text-slate-600 mb-2 uppercase">
                Mức Giá
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => { setIsFree("all"); setPage(1); }}
                  className={`py-1 rounded text-center transition-colors ${
                    isFree === "all" ? "bg-white/95 text-slate-900 font-medium" : "text-slate-600"
                  }`}
                >
                  Tất Cả
                </button>
                <button
                  type="button"
                  onClick={() => { setIsFree("free"); setPage(1); }}
                  className={`py-1 rounded text-center transition-colors ${
                    isFree === "free" ? "bg-white/95 text-slate-900 font-medium" : "text-slate-600"
                  }`}
                >
                  Miễn Phí
                </button>
                <button
                  type="button"
                  onClick={() => { setIsFree("paid"); setPage(1); }}
                  className={`py-1 rounded text-center transition-colors ${
                    isFree === "paid" ? "bg-white/95 text-slate-900 font-medium" : "text-slate-600"
                  }`}
                >
                  Có Phí
                </button>
              </div>

              {/* Ô Nhập Khoảng Giá */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Giá từ ₫"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-[#626D7D]"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Đến ₫"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-[#626D7D]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setPage(1); fetchProducts(); }}
                  className="w-full py-1 rounded bg-blue-50 hover:bg-[#263554] border border-slate-200 text-xs text-slate-900 transition-colors"
                >
                  Áp Dụng Khoảng Giá
                </button>
              </div>
            </div>

            {/* Lọc Theo Định Dạng File */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-mono text-slate-600 mb-2 uppercase">
                Định Dạng File
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { label: "Mọi Định Dạng", value: "all" },
                  { label: ".rbxm (File Model)", value: ".rbxm" },
                  { label: ".rbxl (Bản Đồ Hoàn Chỉnh)", value: ".rbxl" },
                  { label: ".luau (Mã Nguồn Script)", value: ".luau" },
                  { label: ".zip (Gói Tổng Hợp)", value: ".zip" },
                ].map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => { setSelectedFormat(fmt.value); setPage(1); }}
                    className={`w-full text-left px-2.5 py-1 rounded transition-colors flex items-center justify-between ${
                      selectedFormat === fmt.value
                        ? "bg-blue-50 text-slate-900 font-medium"
                        : "text-slate-600 hover:text-white"
                    }`}
                  >
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Khu Vực Hiển Thị Sản Phẩm */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Thanh Đếm Kết Quả & Chọn Sắp Xếp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/95 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-600 font-mono">
              Hiển thị <strong className="text-slate-900">{products.length}</strong> trên <strong className="text-slate-900">{totalCount}</strong> tài nguyên
            </span>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono uppercase text-[11px]">Sắp Xếp:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded px-2.5 py-1 focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="newest">Mới Nhất</option>
                <option value="popular">Phổ Biến Nhất</option>
                <option value="price-asc">Giá: Thấp Đến Cao</option>
                <option value="price-desc">Giá: Cao Đến Thấp</option>
                <option value="rating">Đánh Giá Cao Nhất</option>
              </select>
            </div>
          </div>

          {/* Lưới Sản Phẩm */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-lg bg-white/95 border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center rounded-lg bg-white/95 border border-slate-200 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Không tìm thấy tài nguyên phù hợp</p>
              <p className="text-xs text-slate-600">Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 rounded bg-[#38BDF8] text-[#0B111E] text-xs font-semibold hover:bg-[#0EA5E9]"
              >
                Đặt Lại Bộ Lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    ...p,
                    thumbnail: p.images?.[0]?.imageUrl,
                  }}
                />
              ))}
            </div>
          )}

          {/* Điều Hướng Phân Trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-200 text-xs font-mono">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded border border-slate-200 bg-white/95 text-slate-900 disabled:opacity-30 hover:border-blue-400"
              >
                Trang Trước
              </button>
              <span className="text-slate-600">
                Trang {page} trên {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded border border-slate-200 bg-white/95 text-slate-900 disabled:opacity-30 hover:border-blue-400"
              >
                Trang Sau
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-xs text-slate-600">Đang tải danh mục tài nguyên...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}

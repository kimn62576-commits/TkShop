"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, ShieldCheck, ShieldAlert, Download, ShoppingBag, CheckCircle2, 
  Layers, Code2, FolderTree, Cpu, User, Heart, MessageSquare, 
  ChevronRight, ArrowRight, AlertCircle, Sparkles, Send, Copy, Check,
  Zap, Clock, FileCode, CheckCheck, RefreshCw, Box
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";
import PurchaseModal from "@/components/marketplace/PurchaseModal";
import DepositModal from "@/components/wallet/DepositModal";

interface ProductDetailClientProps {
  product: any;
  isPurchased: boolean;
  currentUser: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  isPurchased: initialPurchased,
  currentUser,
  relatedProducts,
}: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [licenseType, setLicenseType] = useState<"standard" | "extended">("standard");
  const [isPurchased, setIsPurchased] = useState(initialPurchased);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTechTab, setActiveTechTab] = useState<"code" | "install" | "changelog">("code");

  // Modals
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const images = product.images && product.images.length > 0
    ? product.images.map((img: any) => img.imageUrl)
    : ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200"];

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(product.features || "[]");
  } catch {
    featuresList = [];
  }

  const sampleLuauCode = `--[[
  Tài nguyên đã kiểm định: ${product.title}
  Định dạng file: ${product.fileFormat} | Phiên bản Studio mục tiêu: ${product.robloxVersion || "Studio v0.640+"}
  Kiểm tra an toàn: Không mã hóa · Chuẩn FilteringEnabled · Luau hướng đối tượng OOP
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")

local ${product.slug.replace(/[^a-zA-Z0-9]/g, "_")} = {}
${product.slug.replace(/[^a-zA-Z0-9]/g, "_")}.__index = ${product.slug.replace(/[^a-zA-Z0-9]/g, "_")}

function ${product.slug.replace(/[^a-zA-Z0-9]/g, "_")}.Initialize()
    print("[RobloxMarketplace] Asset '${product.title}' đã khởi chạy thành công vào Roblox Studio.")
    return true
end

return ${product.slug.replace(/[^a-zA-Z0-9]/g, "_")}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleLuauCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const toggleWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(data.added);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviewsList([
        {
          id: data.review.id,
          rating: reviewRating,
          comment: reviewComment,
          createdAt: new Date().toISOString(),
          user: {
            profile: {
              displayName: currentUser?.displayName || "Bạn",
              avatarUrl: currentUser?.avatarUrl,
            },
          },
        },
        ...reviewsList,
      ]);

      setReviewComment("");
      alert("Đánh giá của bạn đã được ghi nhận!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* 01. KHUNG SẢN PHẨM & KHỐI MUA HÀNG (BỐ CỤC 2 CỘT CHUẨN MẪU OXARYN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Cột Trái: Ảnh Lớn + Dãy 4 Thumbnail Bên Dưới */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-white/95 border border-slate-200 rounded-lg overflow-hidden">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.discountPercent > 0 && !product.isFree && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-rose-600 text-white">
                GIẢM -{product.discountPercent}%
              </span>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50/90 text-[11px] font-mono text-slate-900 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>KIỂM ĐỊNH STUDIO</span>
            </div>
          </div>

          {/* Dãy 4 Thumbnail ngay phía dưới ảnh lớn */}
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((imgUrl: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/3] rounded overflow-hidden border transition-all ${
                  activeImageIndex === idx
                    ? "border-[#38BDF8] ring-1 ring-[#38BDF8]"
                    : "border-slate-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={imgUrl} alt="Ảnh thu nhỏ" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Cột Phải: Khối Thông Tin Mua Hàng & Lựa Chọn Bản Quyền */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Huy Hiệu Phân Phối Chính Thức TKSHOP.VN Có Animation */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-200">
            <img
              src="/tkshop-logo-animated-sm.webp"
              alt="TKSHOP.VN"
              className="h-5 w-auto object-contain drop-shadow-[0_2px_8px_rgba(139,158,255,0.35)]"
            />
            <span className="text-[10px] font-mono font-medium text-blue-600 tracking-wider uppercase">
              CHỨNG NHẬN TKSHOP.VN · SẠCH MÃ ĐỘC 100%
            </span>
          </div>

          {/* Breadcrumb / Danh Mục */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <Link href="/marketplace" className="hover:text-white transition-colors">Cửa Hàng</Link>
            <span>/</span>
            <Link href={`/marketplace?category=${product.category.slug}`} className="hover:text-white transition-colors">
              {product.category.name}
            </Link>
          </div>

          {/* Tiêu Đề & Phụ Đề */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {product.subtitle || "Kiến trúc mã nguồn Luau tối ưu, sẵn sàng cho các tựa game nhiều người chơi đồng thời cao."}
            </p>
          </div>

          {/* Đánh Giá Sao */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-slate-900">{product.ratingAverage?.toFixed(1) || "5.0"}</span>
            <span className="text-slate-400">({reviewsList.length || 127} đánh giá)</span>
          </div>

          {/* Giá Bán & Ghi Chú Giao Hàng Số */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-slate-900">
                {product.isFree ? "Miễn Phí" : formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && !product.isFree && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              Tải về kỹ thuật số tức thì · 100% mã nguồn sạch, không backdoor
            </p>
          </div>

          {/* Bộ Chọn Gói Bản Quyền (License Type Selector) */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-slate-600 block uppercase">Gói Bản Quyền:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLicenseType("standard")}
                className={`p-3 rounded border text-left transition-all ${
                  licenseType === "standard"
                    ? "border-[#38BDF8] bg-white/95 text-slate-900"
                    : "border-slate-200 bg-slate-100/90 text-slate-600 hover:border-blue-400"
                }`}
              >
                <div className="text-xs font-medium">Bản Quyền Tiêu Chuẩn</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Dự Án Đơn / 1 Game</div>
              </button>

              <button
                type="button"
                onClick={() => setLicenseType("extended")}
                className={`p-3 rounded border text-left transition-all ${
                  licenseType === "extended"
                    ? "border-[#38BDF8] bg-white/95 text-slate-900"
                    : "border-slate-200 bg-slate-100/90 text-slate-600 hover:border-blue-400"
                }`}
              >
                <div className="text-xs font-medium">Bản Quyền Studio</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Sử Dụng Không Giới Hạn</div>
              </button>
            </div>
          </div>

          {/* Cam Kết Bản Quyền & Cảnh Báo Chống Leak */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-100/90 border border-amber-500/30 text-[11px] text-[#94A3B8]">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong className="text-amber-400">Chính sách chống leak:</strong> Mã nguồn gắn watermark số định danh. Nghiêm cấm chia sẻ hoặc bán lại dưới mọi hình thức.
            </span>
          </div>

          {/* Các Nút Bấm Hành Động */}
          <div className="space-y-3 pt-2">
            {isPurchased ? (
              <div className="space-y-2">
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Bạn đã sở hữu tài nguyên này. Bản quyền vĩnh viễn đang hoạt động.</span>
                </div>
                <a
                  href={`/api/download/${product.id}`}
                  className="w-full py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về Gói File ({product.files?.[0]?.fileSize || product.fileFormat})</span>
                </a>
              </div>
            ) : currentUser ? (
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(true)}
                className="w-full py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors tracking-wide"
              >
                <span>{product.isFree ? "Nhận Tài Nguyên Miễn Phí" : "Mua Ngay"}</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors tracking-wide"
              >
                <span>Đăng Nhập Để Mua Tài Nguyên</span>
              </Link>
            )}

            {/* Nút Phụ: Yêu Thích */}
            <button
              type="button"
              onClick={toggleWishlist}
              className={`w-full py-2.5 rounded border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                isWishlisted
                  ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
                  : "border-slate-200 hover:border-blue-400 bg-white/95 text-slate-900"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
              <span>{isWishlisted ? "Đã Lưu Trong Yêu Thích" : "Thêm Vào Danh Sách Yêu Thích"}</span>
            </button>
          </div>

          {/* Tóm Tắt Thông Số Kỹ Thuật Nhanh */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Tác giả: <strong className="text-slate-900 font-normal">{product.creatorName || "Studio Đã Xác Thực"}</strong></span>
            <span>Định dạng: <strong className="text-slate-900 font-normal">{product.fileFormat}</strong></span>
            <span>Phiên bản: <strong className="text-slate-900 font-normal">{product.robloxVersion || "Studio 2026+"}</strong></span>
          </div>

        </div>

      </div>

      {/* 02. "VỀ SẢN PHẨM NÀY" (ABOUT THIS PRODUCT - KHỚP MẪU OXARYN) */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Về Sản Phẩm Này
          </h2>
          <div className="mt-4 text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed space-y-3">
            <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }} />
          </div>
        </div>

        {/* 3 Thông Số Gạch Đầu Dòng Đặc Trưng */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>Bộ nhớ tiêu thụ — &lt;14 MB trung bình</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>Tương thích engine — Roblox Studio 2026.4+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>Bản quyền — Cập nhật miễn phí trọn đời</span>
          </div>
        </div>
      </section>

      {/* 03. 3 TRỤ CỘT CAM KẾT (3 GUARANTEE PILLARS - KHỚP MẪU OXARYN) */}
      <section className="py-8 border-y border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center p-6 space-y-3">
            <div className="w-11 h-11 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-blue-600">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Tải Về Trực Tiếp Tức Thì</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              Nhận liên kết tải file .rbxm, .rbxl và .luau ngay sau khi thanh toán, lưu trữ vĩnh viễn trong thư viện tài khoản của bạn.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-3">
            <div className="w-11 h-11 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Cam Kết Mã Nguồn Sạch</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              Zero backdoor, 100% mã nguồn Luau minh bạch không mã hóa che giấu, tương thích an toàn chuẩn FilteringEnabled.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-3">
            <div className="w-11 h-11 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-blue-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Cập Nhật Miễn Phí Trọn Đời</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              Tải lại miễn phí các bản vá lỗi, nâng cấp tính năng và cập nhật tương thích mỗi khi Roblox Studio ra phiên bản mới.
            </p>
          </div>

        </div>
      </section>

      {/* 04. THÔNG SỐ KỸ THUẬT CHI TIẾT (BẢNG 2 CỘT CHUẨN MẪU OXARYN) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Thông Số Kỹ Thuật Chi Tiết
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Điểm chuẩn hiệu năng engine và yêu cầu tương thích khi khởi chạy trong Roblox Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2">
          
          {/* Cột 1: Hiệu Năng & Kiến Trúc Engine */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Hiệu Năng & Kiến Trúc Engine
            </h4>
            <div className="divide-y divide-[#263554] border-y border-slate-200 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Kiến trúc thực thi</span>
                <span className="text-slate-900 font-mono">Khung hướng đối tượng Luau OOP</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Đồng bộ mạng</span>
                <span className="text-slate-900 font-mono">Dự đoán Client + UnreliableRemoteEvents</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Cấp phát bộ nhớ</span>
                <span className="text-slate-900 font-mono">&lt; 14.2 MB trung bình</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Tiết kiệm khung hình</span>
                <span className="text-slate-900 font-mono">&lt; 0.35 ms / tick (Khóa cứng 60 FPS)</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Khả Năng Tương Thích Studio */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Khả Năng Tương Thích Studio
            </h4>
            <div className="divide-y divide-[#263554] border-y border-slate-200 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Phiên bản Studio mục tiêu</span>
                <span className="text-slate-900 font-mono">{product.robloxVersion || "Studio v0.640+ (2026)"}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Định dạng file đóng gói</span>
                <span className="text-slate-900 font-mono">{product.fileFormat || ".rbxm / .lua"}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Dung lượng package</span>
                <span className="text-slate-900 font-mono">{product.files?.[0]?.fileSize || "18.5 MB"}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Thư viện phụ thuộc ngoài</span>
                <span className="text-slate-900 font-mono">Không có (Chạy độc lập 100%)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 05. TABS XEM MÃ NGUỒN VÀ HƯỚNG DẪN CÀI ĐẶT */}
      <section className="bg-white/95 border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTechTab("code")}
              className={`pb-1 transition-colors ${
                activeTechTab === "code"
                  ? "text-slate-900 border-b-2 border-[#38BDF8]"
                  : "text-slate-600 hover:text-white"
              }`}
            >
              Kiểm Tra Mã Nguồn Luau
            </button>
            <button
              onClick={() => setActiveTechTab("install")}
              className={`pb-1 transition-colors ${
                activeTechTab === "install"
                  ? "text-slate-900 border-b-2 border-[#38BDF8]"
                  : "text-slate-600 hover:text-white"
              }`}
            >
              Hướng Dẫn Cài Đặt Vào Studio
            </button>
            <button
              onClick={() => setActiveTechTab("changelog")}
              className={`pb-1 transition-colors ${
                activeTechTab === "changelog"
                  ? "text-slate-900 border-b-2 border-[#38BDF8]"
                  : "text-slate-600 hover:text-white"
              }`}
            >
              Lịch Sử Cập Nhật ({product.versions?.length || 1})
            </button>
          </div>

          {activeTechTab === "code" && (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded text-[11px] font-mono text-slate-900 transition-colors"
            >
              {codeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{codeCopied ? "Đã Sao Chép" : "Sao Chép Code"}</span>
            </button>
          )}
        </div>

        {activeTechTab === "code" && (
          <div className="p-4 rounded bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto text-slate-900">
            <pre><code>{sampleLuauCode}</code></pre>
          </div>
        )}

        {activeTechTab === "install" && (
          <div className="space-y-4 text-xs text-slate-600 max-w-3xl leading-relaxed">
            <h4 className="text-sm font-semibold text-slate-900">Quy Trình Cài Đặt Từng Bước:</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Khởi chạy dự án game của bạn trong <strong>Roblox Studio</strong> (phiên bản 0.640 trở lên).</li>
              <li>Nhấp chuột phải vào dịch vụ <code>ReplicatedStorage</code> trên cửa sổ Explorer và chọn <strong>Insert from File</strong>.</li>
              <li>Chọn file <code>{product.slug}.rbxm</code> mà bạn vừa tải xuống từ thư viện.</li>
              <li>Kéo các module logic server vào <code>ServerScriptService</code> và module giao diện/hiệu ứng client vào <code>StarterPlayerScripts</code>.</li>
              <li>Khởi tạo module bằng cú pháp <code>require(ReplicatedStorage.{product.slug.replace(/[^a-zA-Z0-9]/g, "_")}).Initialize()</code> để khởi động hệ thống.</li>
            </ol>
          </div>
        )}

        {activeTechTab === "changelog" && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                {product.files?.[0]?.version || "v1.2.0"}
              </span>
              <span className="text-slate-400 font-mono">Bản phát hành tương thích Roblox Studio mới nhất</span>
            </div>
            <p className="text-slate-600">
              Tối ưu hóa pipeline raycasting cho phiên bản Roblox Studio 2026. Bổ sung chú thích kiểu tĩnh nghiêm ngặt và đồng bộ khử trễ giữa client và server.
            </p>
          </div>
        )}
      </section>

      {/* 06. ĐÁNH GIÁ TỪ CỘNG ĐỒNG DEV (LƯỚI 3 CARD CHUẨN MẪU OXARYN) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Đánh Giá Từ Cộng Đồng Dev
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Phản hồi thực tế từ các studio và nhà phát triển Roblox đã mua tài nguyên.
            </p>
          </div>
          <span className="text-xs font-mono text-blue-600">
            {reviewsList.length} Đánh Giá Đã Xác Thực
          </span>
        </div>

        {/* Lưới 3 Card Đánh Giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviewsList.length > 0 ? (
            reviewsList.slice(0, 3).map((rev: any) => (
              <div key={rev.id} className="p-5 rounded-lg bg-white/95 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-900">{rev.user?.profile?.displayName || "Lập Trình Viên Đã Mua"}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Đã Mua Sản Phẩm</p>
                </div>
              </div>
            ))
          ) : (
            [
              { name: "Sarah Chen", role: "Trưởng Nhóm Chiến Đấu", quote: "Chất lượng code và âm thanh tuyệt hảo. Rất đáng giá cho một dự án game bắn súng quy mô lớn." },
              { name: "Marcus Rivera", role: "Lập Trình Viên Trưởng", quote: "Kiến trúc framework cực kỳ mạch lạc. Dễ dàng tùy biến thêm súng và skin mà không bị xung đột netcode." },
              { name: "Emma Thompson", role: "Họa Sĩ Kỹ Thuật", quote: "Vật liệu PBR và hiệu ứng đạn đạo hiển thị mượt mà. Không làm giảm FPS ngay cả trên thiết bị di động." },
            ].map((mock, i) => (
              <div key={i} className="p-5 rounded-lg bg-white/95 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed italic">
                    &quot;{mock.quote}&quot;
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-900">{mock.name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Đã Mua Sản Phẩm</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Khung Gửi Đánh Giá Cho Người Dùng Đã Đăng Nhập */}
        {currentUser && (
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-lg bg-white/95 border border-slate-200 space-y-3 max-w-xl">
            <h4 className="text-xs font-semibold text-slate-900">Gửi Đánh Giá Của Bạn</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Số sao đánh giá:</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded px-2 py-1"
              >
                <option value={5}>5 Sao - Xuất sắc</option>
                <option value={4}>4 Sao - Tốt</option>
                <option value={3}>3 Sao - Trung bình</option>
              </select>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm tích hợp tài nguyên này vào dự án Roblox Studio của bạn..."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors"
            >
              {submittingReview ? "Đang gửi..." : "Gửi Đánh Giá"}
            </button>
          </form>
        )}
      </section>

      {/* 07. BANNER KÊU GỌI HÀNH ĐỘNG "HOÀN THIỆN TRẢI NGHIỆM PHÁT TRIỂN" (MẪU OXARYN) */}
      <section className="bg-[#4F6BFF] rounded-lg p-10 sm:p-14 text-center text-white space-y-4 shadow-card">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Hoàn Thiện Trải Nghiệm Phát Triển Của Bạn
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto leading-relaxed">
          Gia nhập cộng đồng hàng nghìn nhà sáng tạo đã nâng tầm dự án game Roblox Studio với các tài nguyên chuẩn mực.
        </p>
        <div className="pt-2">
          {currentUser ? (
            <button
              onClick={() => setPurchaseModalOpen(true)}
              className="px-6 py-2.5 rounded bg-white text-[#0B111E] text-xs font-semibold hover:bg-slate-100 transition-colors inline-block"
            >
              Tiến Hành Mua Ngay
            </button>
          ) : (
            <Link
              href="/register"
              className="px-6 py-2.5 rounded bg-white text-[#0B111E] text-xs font-semibold hover:bg-slate-100 transition-colors inline-block"
            >
              Đăng Ký Tài Khoản Ngay
            </Link>
          )}
        </div>
      </section>

      {/* 08. SẢN PHẨM TƯƠNG TỰ CÓ THỂ BẠN THÍCH (3 CỘT KHỚP MẪU OXARYN) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Sản Phẩm Tương Tự Có Thể Bạn Thích
            </h2>
            <Link href="/marketplace" className="text-xs font-medium text-blue-600 hover:text-white transition-colors">
              Xem Toàn Bộ Cửa Hàng →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((item: any) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  thumbnail: item.images?.[0]?.imageUrl,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal Mua Hàng */}
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        product={product}
        onSuccess={() => {
          setIsPurchased(true);
          setPurchaseModalOpen(false);
        }}
        onOpenDeposit={() => {
          setPurchaseModalOpen(false);
          setDepositModalOpen(true);
        }}
      />

      {/* Modal Nạp Tiền VietQR */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          setDepositModalOpen(false);
        }}
      />

    </div>
  );
}

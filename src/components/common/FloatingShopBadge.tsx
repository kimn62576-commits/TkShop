"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ShieldCheck, Zap, X, Play, HelpCircle, ExternalLink } from "lucide-react";

export default function FloatingShopBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      {/* Nút Huy Hiệu Góc Dưới Bên Phải */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Panel Hộp Thoại Nhanh */}
        {isOpen && (
          <div className="mb-3 w-80 rounded-xl bg-slate-100/95 border border-slate-200 shadow-2xl p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header với Animated Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <img
                  src="/tkshop-logo-animated.webp"
                  alt="TKSHOP.VN Animation"
                  className="h-8 w-auto object-contain drop-shadow-[0_2px_10px_rgba(139,158,255,0.35)]"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-white transition-colors"
                aria-label="Đóng bảng hỗ trợ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Live Video Animation */}
            <div className="relative aspect-[2.4/1] rounded-lg overflow-hidden border border-slate-200 bg-black my-2.5 group">
              <video
                src="/tkshop-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.25] object-center"
              />
              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-blue-600 border border-slate-200">
                VIDEO HOẠT HỌA GỐC
              </div>
            </div>

            {/* Nội Dung Nổi Bật */}
            <div className="py-3 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900">100% Không Backdoor:</strong> Toàn bộ model và script được quét mã độc thủ công trước khi đăng bán.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900">Nạp Tự Động 24/7:</strong> Quét VietQR nhận số dư sau 5-10 giây, mua và tải file tức thì.
                </p>
              </div>
            </div>

            {/* Xem Video Giới Thiệu Shop */}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsVideoOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-xs font-medium text-slate-900 transition-colors group"
              >
                <Play className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Xem Video Trailer TKSHOP.VN</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span>Hỗ Trợ Discord / Zalo</span>
                <Link
                  href="/support"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  Trung Tâm Trợ Giúp <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Nút Kích Hoạt Góc Dưới Với Animated Logo */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-blue-50 border border-slate-200 hover:border-[#38BDF8] shadow-2xl backdrop-blur-md transition-all duration-200"
        >
          {/* Logo Brand Animated */}
          <img
            src="/tkshop-logo-animated-sm.webp"
            alt="TKSHOP.VN Live Animation"
            className="h-7 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(139,158,255,0.4)]"
          />

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-900">TKSHOP Live</span>
          </div>

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-blue-600">
            ANIMATED
          </span>
        </button>
      </div>

      {/* Modal Video Trailer */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-2xl">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <img
                  src="/tkshop-logo.png"
                  alt="TKSHOP.VN"
                  className="h-6 w-auto object-contain"
                />
                <span className="text-xs font-mono font-medium text-slate-900">
                  TKSHOP.VN — OFFICIAL VIDEO SHOWCASE
                </span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="text-slate-600 hover:text-white p-1 rounded hover:bg-blue-50 transition-colors"
                aria-label="Đóng video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src="/tkshop-video.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Cung cấp tài nguyên Roblox Studio chất lượng cao giá sinh viên</span>
              <Link
                href="/marketplace"
                onClick={() => setIsVideoOpen(false)}
                className="px-4 py-2 rounded-md bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] font-semibold transition-colors"
              >
                Khám Phá Cửa Hàng Ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

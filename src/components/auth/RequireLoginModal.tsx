"use client";

import React from "react";
import Link from "next/link";
import { Lock, LogIn, UserPlus, X, Sparkles, ShieldCheck } from "lucide-react";

interface RequireLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function RequireLoginModal({
  isOpen,
  onClose,
  title = "Yêu Cầu Đăng Nhập Để Nạp Tiền",
  message = "Để bảo vệ an toàn số dư ví của bạn và tự động cộng thêm +20% khuyến mãi, vui lòng đăng nhập trước khi thực hiện giao dịch nạp tiền.",
}: RequireLoginModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#111A2E] text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-sky-500/30 text-center space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Viền sáng trên cùng */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Ổ Khóa Bảo Mật Vàng Kim */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-pulse" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* Tiêu đề & Thông điệp */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-[11px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>XÁC THỰC TÀI KHOẢN</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Lợi ích khi đăng nhập */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0A101D] border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 text-left space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>Cộng tiền tự động vào ví cá nhân ngay sau 3 giây.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span>Tặng thêm <strong>+20% giá trị nạp</strong> vào tài khoản.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
            <span>Lưu trữ vĩnh viễn giấy phép và tải file asset không giới hạn.</span>
          </div>
        </div>

        {/* Nút Hành Động: Đăng Nhập & Đăng Ký */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <Link
            href="/login?redirect=deposit"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 fill-slate-950" />
            <span>ĐĂNG NHẬP NGAY</span>
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>TẠO TÀI KHOẢN</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

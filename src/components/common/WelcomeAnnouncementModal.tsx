"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface WelcomeAnnouncementModalProps {
  onOpenDeposit?: () => void;
}

export default function WelcomeAnnouncementModal({ onOpenDeposit }: WelcomeAnnouncementModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lắng nghe sự kiện để có thể mở lại bảng thông báo bất kỳ lúc nào từ thanh Menu
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openAnnouncementModal", handleOpen);
    return () => window.removeEventListener("openAnnouncementModal", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={handleClose}
    >
      {/* Bảng Popup Thông Báo Gọn Gàng, Đúng Chuẩn Tỉ Lệ, Không AI Slop */}
      <div 
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "24px",
          textAlign: "center",
        }}
        className="relative w-full max-w-[420px] bg-white dark:bg-[#111A2E] text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-700/60 text-center space-y-4 animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút Đóng 'X' góc phải trên */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tiêu Đề: 🔔 Thông Báo Mới 🔔 */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5 pt-1">
          <span>🔔</span>
          <span>Thông Báo Mới</span>
          <span>🔔</span>
        </h3>

        {/* Nội Dung Thông Báo Tối Giản, Căn Giữa Chuẩn Mẫu */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <p className="font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <span>📢</span>
            <span className="tracking-wide">SALE CỰC SỐC ĐẾN 79%</span>
            <span>🦅</span>
          </p>

          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            NẠP ATM--THẺ CÀO TỰ ĐỘNG 24/7
          </p>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>💬</span>
            <span>Hỗ trợ khách hàng <strong>24/7</strong></span>
          </p>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>🔥</span>
            <span>Uy tín – Nhanh chóng – Tận tâm</span>
          </p>

          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 pt-0.5 flex items-center justify-center gap-1">
            <span>❤️</span>
            <span>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</span>
          </p>

          <p className="pt-1.5 text-xs text-slate-700 dark:text-slate-300">
            Cần Hỗ Trợ Về Tìm Acc, Nạp ATM{" "}
            <a
              href="https://zalo.me/0394063917"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-rose-400 font-extrabold hover:underline"
            >
              (Bấm Vào Đây)
            </a>
          </p>
        </div>

        {/* Nút Bấm 'OK' Màu Đỏ Tròn Nổi Bật Chính Giữa */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="px-8 py-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wide shadow-md shadow-red-500/30 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

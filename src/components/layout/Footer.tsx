"use client";

import React from "react";
import Link from "next/link";
import { 
  PhoneCall, Clock, MessageCircle, ShieldCheck, Download, 
  RefreshCw, QrCode, Mail, Send, ExternalLink 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/95 dark:bg-[#070C16] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs mt-16 shadow-sm transition-colors duration-300">
      
      {/* 01. CAM KẾT CHẤT LƯỢNG (4 TRỤ CỘT) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090F1D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-sky-500/15 text-blue-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Mã Nguồn Đã Kiểm Định</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  100% không backdoor, không script độc hại, kiểm duyệt gắt gao trước khi lên kệ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Tải Về Tức Thì 24/7</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Hệ thống tự động bàn giao file .rbxm và .luau vào thư viện ngay sau khi thanh toán.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Nạp Tiền VietQR Tự Động</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Quét mã QR ngân hàng nhận số dư ví tức thì 3-5 giây, khuyến mãi nạp +20%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Cập Nhật Miễn Phí Trọn Đời</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Tải lại miễn phí mọi phiên bản sửa lỗi khi Roblox Studio cập nhật engine mới.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 02. THANH BANNER GRADIENT HOTLINE & KÊNH HỖ TRỢ TRỰC TUYẾN */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl mb-12">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-blue-100 uppercase font-semibold tracking-wider">HOTLINE HỖ TRỢ KỸ THUẬT 24/7</div>
              <div className="text-2xl sm:text-3xl font-black">0394.063.917</div>
              <div className="text-xs text-blue-100 font-medium">
                Chủ shop: <strong className="text-white">Nguyễn Trọng Khang</strong> — Hỗ trợ cài đặt Ultraview 24/7
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 justify-center lg:justify-end">
            {/* Nút Chat Zalo */}
            <a
              href="https://zalo.me/0394063917"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chat Zalo</span>
            </a>

            {/* Nút Chat Telegram */}
            <a
              href="https://t.me/+84394063917"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Telegram: 0394063917</span>
            </a>

            {/* Nút Tham Gia Discord */}
            <a
              href="https://discord.gg/94j4kJF3Ht"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Discord: TKhang098</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* 03. CÁC CỘT THÔNG TIN VÀ THỐNG KÊ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin thương hiệu & Chủ Shop */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/tkshop-logo-animated-sm.webp"
                alt="TKSHOP.VN Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              TKSHOP.VN — Shop Model Roblox Uy Tín Giá Rẻ Số 1 Việt Nam. Cung Cấp Model ACS, Script Luau, Bản Đồ RPG Chất Lượng Cao.
            </p>
            
            {/* Bảng liên hệ trực tiếp chủ shop */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400">Chủ shop:</span>{" "}
                <strong className="text-slate-800 dark:text-slate-100 font-bold">Nguyễn Trọng Khang</strong>
              </div>
              <div>
                <span className="text-slate-400">Hotline / Zalo:</span>{" "}
                <a href="https://zalo.me/0394063917" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                  0394063917
                </a>
              </div>
              <div>
                <span className="text-slate-400">Telegram:</span>{" "}
                <a href="https://t.me/+84394063917" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                  0394063917
                </a>
              </div>
              <div>
                <span className="text-slate-400">Discord:</span>{" "}
                <a href="https://discord.gg/94j4kJF3Ht" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] font-bold hover:underline">
                  TKhang098
                </a>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>{" "}
                <a href="mailto:lilkhang211@gmail.com" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                  lilkhang211@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin chung */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
              Thông tin chung
            </h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/support" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Hướng dẫn cài đặt file .rbxm và bảo mật
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors font-medium text-amber-600 dark:text-amber-400">
                  › Cẩm Nang & Kinh Nghiệm Roblox Studio
                </Link>
              </li>
              <li>
                <Link href="/support#uy-tin" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Uy tín của Shop & Đánh giá
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Điều khoản bản quyền & Chống leak
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Chính sách bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Kho Model & Asset */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
              Kho Asset Roblox
            </h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/marketplace?category=systems" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Hệ thống súng Apex Combat (ACS)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=maps-terrain" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Bản đồ đô thị Neo-Tokyo Cyberpunk
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=vehicles" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Gói siêu xe tinh chỉnh A-Chassis
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=systems" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › OmniSave Pro — DataStore Chống Dupe
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=ui-kits" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                  › Giao diện Omni UI Dark Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thống Kê Sàn */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
              Thống kê sàn
            </h4>
            <div className="bg-slate-50 dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Asset đã bán ra:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">31.484</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-1.5">
                <span>Tổng số thành viên:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">34.679</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-1.5">
                <span>Đang online:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">128</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-1.5">
                <span>Số lần truy cập:</span>
                <span className="font-bold text-blue-600 dark:text-sky-400">24.660.746</span>
              </div>
            </div>
          </div>

        </div>

        {/* Địa chỉ & Bản quyền */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-[11px] space-y-1">
          <p>📍 Chủ sở hữu: <strong>Nguyễn Trọng Khang</strong> • Email: <a href="mailto:lilkhang211@gmail.com" className="hover:underline text-sky-600 dark:text-sky-400 font-medium">lilkhang211@gmail.com</a> • Discord: <a href="https://discord.gg/94j4kJF3Ht" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#5865F2] font-medium">TKhang098</a></p>
          <p>© 2026, Bản quyền thuộc về TKSHOP.VN — Shop Model Roblox Uy Tín - Giá Rẻ - Chất Lượng.</p>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  ArrowRight, Sparkles, ShieldCheck, Zap, 
  Gamepad2, Layers, PhoneCall, Cpu, Search, CheckCircle2,
  Clock, ExternalLink, BookOpen
} from "lucide-react";
import MagneticButton from "../motion/MagneticButton";

interface EditorialHeroProps {
  onOpenDeposit?: () => void;
}

interface TopDepositor {
  rank: number;
  maskedName: string;
  totalAmount: number;
  avatar: string;
}

const FALLBACK_TOP_5: TopDepositor[] = [
  { rank: 1, maskedName: "an***23", totalAmount: 3840000, avatar: "/avatars/top1.png" },
  { rank: 2, maskedName: "du***98", totalAmount: 3500000, avatar: "/avatars/top2.png" },
  { rank: 3, maskedName: "md***3b", totalAmount: 3200000, avatar: "/avatars/top3.png" },
  { rank: 4, maskedName: "m6***d0", totalAmount: 3200000, avatar: "/avatars/top4.png" },
  { rank: 5, maskedName: "vu***uy", totalAmount: 2400000, avatar: "/avatars/top5.png" },
];

export default function EditorialHero({ onOpenDeposit }: EditorialHeroProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [topUsers, setTopUsers] = useState<TopDepositor[]>(FALLBACK_TOP_5);

  // Hiệu ứng chuột 3D Tilt mượt mà cho Banner
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    damping: 25,
    stiffness: 220,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    damping: 25,
    stiffness: 220,
  });

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleBannerMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Lấy dữ liệu Top Nạp tự động nếu có
  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch("/api/public/activities");
        const data = await res.json();
        if (data.success && Array.isArray(data.topDepositors) && data.topDepositors.length > 0) {
          const mapped: TopDepositor[] = data.topDepositors.slice(0, 5).map((u: any, idx: number) => ({
            rank: idx + 1,
            maskedName: u.maskedName || `user***${idx + 1}`,
            totalAmount: Number(u.totalAmount) || 0,
            avatar: `/avatars/top${(idx % 5) + 1}.png`,
          }));
          setTopUsers(mapped);
        }
      } catch {
        // Giữ fallback mặc định giống ảnh mẫu
      }
    };
    fetchTop();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleDepositClick = () => {
    if (onOpenDeposit) {
      onOpenDeposit();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("openDepositModal"));
    }
  };

  // Marquee items
  const marqueeItems = [
    "ACS Combat Framework v2.5",
    "OmniSave DataStore System",
    "Bản Đồ Neo-Tokyo Cyberpunk",
    "RPG Modular Inventory Kit",
    "Giao Dịch VietQR Tự Động 3s",
    "Mã Hóa ID Chống Leak File",
    "Hỗ Trợ Cài Đặt Qua Ultraview",
    "Tối Ưu Hóa 60 FPS Roblox Studio",
  ];

  return (
    <section
      ref={containerRef}
      className="relative pt-2 sm:pt-4 pb-8 overflow-hidden select-none"
    >
      {/* 01. AMBIENT GLOW TẠO CHIỀU SÂU */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-r from-sky-500/15 via-blue-600/15 to-amber-500/12 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="space-y-5 sm:space-y-6">

        {/* 02. TOP STATUS PILL */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex items-center justify-between flex-wrap gap-2 px-1"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-md shadow-xs text-[11px] font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>HỆ THỐNG MODEL ROBLOX STUDIO CHÍNH HÃNG • TỰ ĐỘNG 24/7</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bảo mật chống leak ID</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Giao dịch tức thì 3s</span>
            </span>
          </div>
        </motion.div>

        {/* 03. KHỐI TRÊN CÙNG: TOP NẠP TIỀN THÁNG 11 + HERO BANNER (SIDE-BY-SIDE CHUẨN ẢNH MẪU) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* CỘT TRÁI (~28-30% WIDTH): THẺ ⭐ TOP NẠP TIỀN THÁNG 11 */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-[#0D1528] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm dark:shadow-md flex flex-col justify-between">
            <div>
              {/* Tiêu đề thẻ Top Nạp */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-base select-none">⭐</span>
                  <h3 className="font-bold text-xs sm:text-sm tracking-wide uppercase text-slate-900 dark:text-slate-100">
                    TOP NẠP TIỀN THÁNG 11
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 font-semibold border border-blue-500/20">
                  Realtime
                </span>
              </div>

              {/* Danh sách 5 dòng Top Nạp */}
              <div className="space-y-2.5 sm:space-y-3">
                {topUsers.slice(0, 5).map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between text-xs py-1 border-b border-dashed border-slate-100 dark:border-slate-800/60 last:border-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Số thứ hạng #1, #2... màu xanh dương đậm nét */}
                      <span className="font-black text-blue-600 dark:text-sky-400 w-5 flex-shrink-0 text-left text-xs sm:text-sm">
                        #{item.rank}
                      </span>
                      {/* Avatar tròn viền gọn */}
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-xs">
                        <img
                          src={item.avatar || `/avatars/top${item.rank}.png`}
                          alt={item.maskedName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Tên tài khoản che sao */}
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs">
                        {item.maskedName}
                      </span>
                    </div>

                    {/* Số tiền nạp màu cam vàng nổi bật */}
                    <span className="font-bold text-amber-500 dark:text-amber-400 flex-shrink-0 ml-2 whitespace-nowrap text-xs sm:text-sm">
                      {item.totalAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút Đua Top Nạp Ngay */}
            <button
              onClick={handleDepositClick}
              className="w-full mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/25 transition-all cursor-pointer group active:scale-98"
            >
              <span>Nạp ví nhận +20% • Đua Top</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CỘT PHẢI (~70-72% WIDTH): BANNER TKSHOP VỚI HIỆU ỨNG 3D TILT, CHIP HOLOGRAPHIC & NÚT TRUY CẬP */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }}
            onMouseMove={handleBannerMouseMove}
            onMouseLeave={handleBannerMouseLeave}
            className="lg:col-span-8 xl:col-span-9 relative rounded-2xl overflow-hidden border-2 border-slate-200/90 dark:border-sky-500/30 shadow-md group bg-slate-950 flex flex-col justify-center min-h-[300px] sm:min-h-[330px] transition-all duration-300 hover:border-sky-400/60 hover:shadow-[0_0_35px_rgba(56,189,248,0.25)] will-change-transform"
          >
            <Link
              href="/marketplace"
              className="relative w-full h-full block overflow-hidden"
              data-cursor="card"
              data-cursor-text="KHÁM PHÁ"
            >
              <img
                src="/tkshop-hero-banner.png"
                alt="TKSHOP.VN - Shop Model Roblox Giá Rẻ Uy Tín"
                className="w-full h-full object-cover object-center group-hover:scale-[1.025] transition-transform duration-700 ease-out"
              />
              
              {/* Lớp gradient bóng mờ và phản quang sang trọng */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-2xl pointer-events-none" />

              {/* Tia sáng quét nhẹ qua banner khi hover (Shimmer Beam Animation) */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* 3 CHIP HOLOGRAPHIC NỔI 3D TRÊN BANNER */}
              {/* Chip 1: ACS 2.5 Engine (Góc trên bên trái) */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-sky-400/50 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-2 shadow-xl shadow-black/60 pointer-events-none"
              >
                <div className="w-5 h-5 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                </div>
                <div>
                  <span className="block text-white leading-tight font-black text-[11px]">ACS Combat v2.5</span>
                  <span className="text-[8px] sm:text-[9px] text-emerald-400 leading-none">Lock 60 FPS • Sẵn Sàng</span>
                </div>
              </motion.div>

              {/* Chip 2: Token Chống Leak File (Góc dưới bên trái, trên thanh slider) */}
              <motion.div
                animate={{ y: [3, -3, 3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="hidden sm:flex absolute bottom-9 left-4 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-emerald-400/50 text-white text-[11px] font-bold items-center gap-2 shadow-xl shadow-black/60 pointer-events-none"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-white leading-tight font-black text-[11px]">Chống Leak File</span>
                  <span className="text-[9px] text-slate-300 leading-none">Mã hóa ID người mua</span>
                </div>
              </motion.div>

              {/* Chip 3: VietQR Auto 3s (Góc trên bên phải) */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="hidden sm:flex absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-amber-400/50 text-white text-[11px] font-bold items-center gap-2 shadow-xl shadow-black/60 pointer-events-none"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-amber-300 leading-tight font-black text-[11px]">VietQR Auto 3s</span>
                  <span className="text-[9px] text-emerald-300 leading-none">Khuyến mãi nạp +20%</span>
                </div>
              </motion.div>

              {/* NÚT "TRUY CẬP NGAY →" NỔI BẬT GÓC DƯỚI PHẢI (CHUẨN ẢNH MẪU USER UPLOAD) */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 pointer-events-none">
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-500/40 border border-sky-300/40 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.7)] transition-all">
                  <span>TRUY CẬP NGAY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Slider Dots Indicator ở đáy chính giữa */}
              <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 pointer-events-none shadow-md">
                <span className="w-6 h-1.5 rounded-full bg-white shadow-sm" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 04. THANH TƯƠNG TÁC NHANH: TÌM KIẾM ASSET + CÁC NÚT HÀNH ĐỘNG CHÍNH */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-white/90 dark:bg-[#0E172A]/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#1E2E4E] shadow-lg space-y-3"
        >
          {/* Hàng 1: Ô Tìm Kiếm Asset Trực Tiếp và Nút CTA */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            
            {/* Form Tìm Kiếm Lớn Trực Quan */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm Framework ACS, Map Cyberpunk, RPG Inventory, UI Kit..."
                className="w-full pl-11 pr-24 py-3 bg-slate-100 dark:bg-[#070C16] hover:bg-slate-200/70 dark:hover:bg-[#0B1322] border border-slate-300 dark:border-[#223354] rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#080E1C] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Tìm</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>

            {/* Cụm 2 Nút Hành Động Trọng Tâm */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-shrink-0">
              {/* Nút Khám Phá Cửa Hàng */}
              <MagneticButton
                as="a"
                href="/marketplace"
                className="relative group overflow-hidden px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 border border-sky-400/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial justify-center"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Vào Cửa Hàng</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              {/* Nút Nạp Tiền Vào Ví Nhận +20% với Ảnh 500k */}
              <MagneticButton
                as="button"
                onClick={handleDepositClick}
                className="relative group overflow-hidden px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 border-2 border-yellow-200/90 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial justify-center"
              >
                <div className="relative w-8 h-6 flex-shrink-0 flex items-center justify-center group-hover:scale-120 group-hover:-rotate-3 transition-transform duration-300">
                  <img
                    src="/money-vnd-sm.png"
                    alt="Tiền 500k VNĐ"
                    className="w-8 h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <span>Nạp Ví Tự Động</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-bold border border-amber-400/50">
                  +20%
                </span>
              </MagneticButton>
            </div>

          </div>

          {/* Hàng 2: Các Phím Danh Mục Nhanh (Quick Category Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs font-semibold no-scrollbar">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex-shrink-0">
              Danh mục:
            </span>
            <Link
              href="/marketplace"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              ✦ Tất Cả Asset
            </Link>
            <Link
              href="/marketplace?category=systems"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Hệ Thống ACS</span>
            </Link>
            <Link
              href="/marketplace?category=maps-terrain"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>Bản Đồ & Terrain</span>
            </Link>
            <Link
              href="/marketplace?q=RPG"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              Hệ Thống RPG
            </Link>
            <Link
              href="/marketplace?q=UI"
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#162238] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              UI Kits
            </Link>
            <Link
              href="/news"
              className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors whitespace-nowrap flex items-center gap-1 font-bold"
            >
              <BookOpen className="w-3 h-3 text-amber-500" />
              <span>Cẩm Nang Studio</span>
            </Link>
          </div>
        </motion.div>

        {/* 05. 3 THẺ TÍNH NĂNG UY TÍN (BENTO TRUST PILLARS) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
        >
          {/* Thẻ 1: Hỗ Trợ Kỹ Thuật Ultraview */}
          <a
            href="https://zalo.me/0394063917"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#0D1528]/80 border border-slate-200/90 dark:border-emerald-500/25 shadow-xs hover:shadow-md transition-all flex items-center justify-between group hover:border-emerald-500/50"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Hỗ Trợ Kỹ Thuật Studio
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Zalo / Tele: 0394.063.917
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate font-medium">
                  Chủ shop: Nguyễn Trọng Khang • Discord: TKhang098
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </a>

          {/* Thẻ 2: Giao Dịch Siêu Tốc 24/7 */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0D1528]/80 border border-slate-200/90 dark:border-sky-500/25 shadow-xs hover:shadow-md transition-all flex items-center justify-between group hover:border-sky-500/50">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tải Asset Tức Thì
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Tự Động 24/7
                </div>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 truncate font-medium">
                  Nhận file .rbxm tải vĩnh viễn trong 3s
                </div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
          </div>

          {/* Thẻ 3: Khuyến Mại Nạp Ví VietQR */}
          <button
            onClick={handleDepositClick}
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#0D1528]/80 border border-slate-200/90 dark:border-amber-500/25 shadow-xs hover:shadow-md transition-all flex items-center justify-between group hover:border-amber-500/50 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <img src="/money-vnd-sm.png" alt="500k" className="w-8 h-auto object-contain drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ưu Đãi Nạp Ví
                </div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 truncate">
                  VietQR +20% Khuyến Mãi
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300 truncate font-medium">
                  Cộng tiền tự động ngay lập tức
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        </motion.div>

      </div>

      {/* 06. TICKER MARQUEE CÔNG NGHỆ CHẠY DƯỚI ĐÁY */}
      <div className="mt-6 sm:mt-8 overflow-hidden py-2.5 bg-slate-100/80 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
        <div className="flex w-max animate-marquee space-x-8 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

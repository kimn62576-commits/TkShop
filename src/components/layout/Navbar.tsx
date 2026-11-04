"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, Wallet, Plus, User, Library, ShoppingBag, 
  Settings, Shield, LogOut, ChevronDown, Menu, X, Command,
  Zap, ShieldCheck, PhoneCall, Home, HelpCircle, Award, CreditCard, Layers, Sparkles, Bell, Newspaper
} from "lucide-react";
import { SessionUser } from "@/types";
import { formatVND } from "@/lib/utils";
import DepositModal from "../wallet/DepositModal";
import WelcomeAnnouncementModal from "../common/WelcomeAnnouncementModal";
import ThemeToggle from "../common/ThemeToggle";
import RequireLoginModal from "../auth/RequireLoginModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [requireLoginOpen, setRequireLoginOpen] = useState(false);

  const handleOpenDeposit = () => {
    if (!user) {
      setRequireLoginOpen(true);
      return;
    }
    setDepositModalOpen(true);
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUser();
    const handleRefresh = () => fetchUser();
    const handleOpenDepositEvent = () => handleOpenDeposit();
    window.addEventListener("refreshUser", handleRefresh);
    window.addEventListener("openDepositModal", handleOpenDepositEvent);
    return () => {
      window.removeEventListener("refreshUser", handleRefresh);
      window.removeEventListener("openDepositModal", handleOpenDepositEvent);
    };
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (e) {
        console.error(e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("refreshUser"));
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* 01. BẢNG POPUP THÔNG BÁO CHÀO MỪNG SỰ KIỆN (TỰ ĐỘNG HIỆN KHI VÀO WEB) */}
      <WelcomeAnnouncementModal onOpenDeposit={handleOpenDeposit} />

      {/* 02. DẢI THÔNG BÁO TRÊN CÙNG (TOP ANNOUNCEMENT BAR) */}
      <div className="bg-slate-100 dark:bg-[#050811] border-b border-slate-200 dark:border-[#141F36] text-xs text-slate-700 dark:text-slate-300 py-1.5 px-4 sm:px-8 shadow-inner transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 animate-bounce" /> 
              <span>Nạp VietQR / MoMo Tự Động +10% Đến +20%</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> 
              <span>Giao dịch tự động 24/7 tức thì</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://zalo.me/0394063917" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Hotline / Zalo: 0394.063.917</span>
            </a>
            <a
              href="https://discord.gg/94j4kJF3Ht"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#5865F2] font-bold transition-colors"
            >
              <span>Discord: TKhang098</span>
            </a>
          </div>
        </div>
      </div>

      {/* 03. THANH HEADER ĐIỀU HƯỚNG CHÍNH */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B111E]/95 backdrop-blur-xl border-b border-slate-200/90 dark:border-[#1E2B48] shadow-sm dark:shadow-2xl shadow-black/50 transition-colors duration-300">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3 overflow-visible">
          
          {/* Logo TKSHOP.VN Hoạt Họa */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative h-10 flex items-center transition-transform duration-200 group-hover:scale-105">
              <img
                src="/tkshop-logo-animated-sm.webp"
                alt="TKSHOP.VN"
                className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              />
            </div>
            <div className="hidden sm:flex flex-col border-l border-slate-300 dark:border-slate-700/80 pl-2.5">
              <span className="font-black text-xs tracking-wider uppercase text-sky-600 dark:text-sky-400">
                TKSHOP.VN
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium font-mono">
                Roblox Asset VIP
              </span>
            </div>
          </Link>

          {/* Navigation Menu: CHỈ 4 MỤC CHÍNH TINH GỌN, VỪA KHÍT 100% ZOOM */}
          <nav className="hidden lg:flex items-center gap-1.5 flex-shrink-0 text-xs font-semibold">
            {/* 1. Trang chủ */}
            <Link 
              href="/" 
              className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                pathname === "/" 
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                  : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${pathname === "/" ? "text-white" : "text-sky-500"}`} />
              <span>Trang chủ</span>
            </Link>

            {/* 2. Cửa Hàng Asset (Kèm Dropdown Danh Mục Nhanh) */}
            <div className="relative group py-2">
              <Link 
                href="/marketplace" 
                className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  pathname === "/marketplace" 
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
                }`}
              >
                <ShoppingBag className={`w-3.5 h-3.5 ${pathname === "/marketplace" ? "text-white" : "text-emerald-500"}`} />
                <span>Cửa Hàng</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dropdown danh mục: hiển thị mượt mà khi hover với cầu nối hover chống mất chuột */}
              <div className="absolute top-[85%] left-0 pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5">
                  <Link href="/marketplace" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Tất Cả Asset</span>
                  </Link>
                  <Link href="/marketplace?category=systems" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Hệ Thống (ACS)</span>
                  </Link>
                  <Link href="/marketplace?category=maps-terrain" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-indigo-500 transition-colors">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">Bản Đồ & Terrain</span>
                  </Link>
                  <Link href="/marketplace?q=RPG" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Hệ Thống RPG</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Tin Tức & Cẩm Nang */}
            <Link 
              href="/news" 
              className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                pathname.startsWith("/news") 
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                  : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
              }`}
            >
              <Newspaper className={`w-3.5 h-3.5 ${pathname.startsWith("/news") ? "text-white" : "text-sky-400"}`} />
              <span>Tin Tức</span>
            </Link>

            {/* 4. Nút Xem Thông Báo Nổi Bật (Mở Popup Bảng Tin) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("openAnnouncementModal"))}
              className="nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-amber-600 dark:text-amber-300 hover:text-slate-950 bg-amber-500/15 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 border border-amber-500/40 hover:border-amber-300 font-bold shadow-xs cursor-pointer"
              title="Xem thông báo sự kiện shop"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-400" />
              <span>Thông Báo</span>
            </button>

            {/* 4. Hỗ Trợ & Hướng Dẫn */}
            <div className="relative group py-2">
              <Link 
                href="/support" 
                className={`nav-pill whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  pathname.startsWith("/support") 
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-xs ring-1 ring-sky-400/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-[#162036]"
                }`}
              >
                <HelpCircle className={`w-3.5 h-3.5 ${pathname.startsWith("/support") ? "text-white" : "text-sky-500"}`} />
                <span>Hỗ Trợ</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dropdown Hỗ Trợ với hiệu ứng mượt và cầu nối hover */}
              <div className="absolute top-[85%] left-0 pt-2 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5">
                  <Link href="/support" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    <span className="font-semibold">Hướng Dẫn Cài Đặt</span>
                  </Link>
                  <Link href="/news" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-amber-500 transition-colors">
                    <Newspaper className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Cẩm Nang Studio</span>
                  </Link>
                  <Link href="/support#uy-tin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-emerald-500 transition-colors">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Uy Tín Của Shop</span>
                  </Link>
                  <a href="https://discord.gg/94j4kJF3Ht" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-[#5865F2] transition-colors">
                    <Sparkles className="w-4 h-4 text-[#5865F2]" />
                    <span className="font-semibold">Discord: TKhang098</span>
                  </a>
                  <a href="https://zalo.me/0394063917" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-sky-500 transition-colors">
                    <PhoneCall className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Zalo / Tele: 0394.063.917</span>
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Action Controls: Nạp Tiền VIP 3D Coin, ThemeToggle, Quick Search, User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 z-20">
            
            {/* ================= NÚT NẠP TIỀN VIP CÓ ẢNH TIỀN VIỆT NAM VNĐ PNG ================= */}
            <button
              onClick={handleOpenDeposit}
              className="relative overflow-hidden group flex items-center gap-2 pl-2 pr-3 sm:pr-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.55)] hover:shadow-[0_0_28px_rgba(245,158,11,0.85)] border-2 border-yellow-200/90 transition-all duration-300 active:scale-95 whitespace-nowrap cursor-pointer select-none flex-shrink-0"
              title="Nạp tiền tự động vào ví (Nhận thêm +20% khuyến mãi)"
            >
              {/* Hiệu ứng tia sáng lướt qua (Shimmer Beam Animation) */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* ẢNH TIỀN 500K VIỆT NAM SẮC NÉT */}
              <div className="relative w-8 h-6 flex-shrink-0 flex items-center justify-center group-hover:scale-115 group-hover:-rotate-3 transition-transform duration-300">
                <img
                  src="/money-vnd-sm.png"
                  alt="Tiền 500k VNĐ"
                  className="w-8 h-auto object-contain relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                />
              </div>

              {/* Chữ Nạp Tiền & Huy Hiệu +20% */}
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xs tracking-wider uppercase text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  Nạp Tiền
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono font-black border border-amber-400/60 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>+20%</span>
                </span>
              </div>
            </button>

            {/* Nút Bật/Tắt Dark Mode / Light Mode */}
            <ThemeToggle />

            {/* Quick Search Input */}
            <div ref={searchRef} className="relative hidden xl:block w-32 xl:w-36">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    placeholder="Tìm asset..."
                    className="w-full pl-7 pr-2.5 py-1.5 bg-slate-100 dark:bg-[#060A12] hover:bg-slate-200 dark:hover:bg-[#0D1525] border border-slate-300 dark:border-[#1E2E4E] hover:border-sky-500/50 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#080E1C] focus:outline-none focus:border-sky-400 transition-all font-medium"
                  />
                </div>
              </form>

              {/* Suggestions Popup */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-xl shadow-2xl p-2 z-50 text-xs max-h-72 overflow-y-auto">
                  <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 px-2.5 py-1">
                    Gợi ý tìm kiếm
                  </div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2B48] transition-colors"
                    >
                      <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{item.title}</span>
                      <span className="text-amber-500 dark:text-amber-400 font-mono text-[11px] font-bold">
                        {item.price === 0 ? "Miễn Phí" : formatVND(item.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* User Section / Authentication - LUÔN flex-shrink-0 ĐẢM BẢO KHÔNG BAO GIỜ BỊ CHE KHUẤT */}
            <div className="flex-shrink-0 z-30">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : user ? (
                <div className="relative">
                  {/* Trigger Button hiển thị số dư và Avatar */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-2.5 sm:pr-3 rounded-full bg-slate-100 dark:bg-[#162036] hover:bg-slate-200 dark:hover:bg-[#1E2B48] border border-slate-300 dark:border-[#263554] hover:border-sky-500/60 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-xs overflow-hidden shadow-xs">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[85px]">
                        {user.displayName}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400 leading-none mt-1">
                        {formatVND(user.walletBalance)}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-200 dark:border-[#1E2E4E]">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                        <div className="mt-2 flex items-center justify-between p-2 bg-slate-50 dark:bg-[#162036] border border-slate-200 dark:border-[#263554] rounded-xl text-amber-600 dark:text-amber-400 font-bold">
                          <span className="text-slate-600 dark:text-slate-300 text-[11px]">Số dư ví:</span>
                          <span className="font-mono text-sm">{formatVND(user.walletBalance)}</span>
                        </div>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                        >
                          <User className="w-4 h-4 text-sky-500" />
                          <span>Tài Khoản & Hồ Sơ</span>
                        </Link>

                        <Link
                          href="/dashboard/library"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                        >
                          <Library className="w-4 h-4 text-emerald-500" />
                          <span>Kho Model Đã Mua</span>
                        </Link>

                        <Link
                          href="/dashboard/wallet"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                        >
                          <Wallet className="w-4 h-4 text-amber-500" />
                          <span>Lịch Sử Giao Dịch Ví</span>
                        </Link>

                        {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-bold transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Control Center</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 dark:border-[#1E2E4E]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng Xuất Khỏi Thiết Bị</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162036] border border-slate-300 dark:border-slate-700/80 hover:border-sky-500 transition-all whitespace-nowrap"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xs transition-all whitespace-nowrap"
                  >
                    Đăng Ký
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162036] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#0A101D] border-b border-slate-200 dark:border-[#1E2E4E] px-4 py-3 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-150">
            {/* Nạp Tiền Mobile Button Nổi Bật với Ảnh Tiền VNĐ */}
            <button
              onClick={() => { setMobileMenuOpen(false); handleOpenDeposit(); }}
              className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950 font-black text-xs shadow-md border-2 border-yellow-200 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="/money-vnd-sm.png"
                  alt="Tiền Việt Nam"
                  className="w-8 h-auto object-contain drop-shadow-sm"
                />
                <span>Nạp Tiền Vào Ví</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono font-black border border-amber-400/50">
                +20% Khuyến Mại
              </span>
            </button>

            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Home className="w-4 h-4 text-sky-500" />
              <span>Trang Chủ</span>
            </Link>
            <Link 
              href="/marketplace" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Cửa Hàng Asset</span>
            </Link>
            <Link 
              href="/marketplace?category=systems" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Hệ Thống (ACS)</span>
            </Link>
            <Link 
              href="/marketplace?category=maps-terrain" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Bản Đồ</span>
            </Link>
            <Link 
              href="/news" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Newspaper className="w-4 h-4 text-sky-500" />
              <span>Tin Tức & Cẩm Nang</span>
            </Link>
            <Link 
              href="/support" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-sky-500" />
              <span>Hướng Dẫn Cài Đặt</span>
            </Link>
            <Link 
              href="/support#uy-tin" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Uy Tín Của Shop</span>
            </Link>
          </div>
        )}
      </header>

      {/* Require Login Modal */}
      <RequireLoginModal
        isOpen={requireLoginOpen}
        onClose={() => setRequireLoginOpen(false)}
        title="Yêu Cầu Đăng Nhập Để Nạp Tiền"
        message="Để bảo vệ an toàn số dư ví của bạn và tự động cộng thêm +20% khuyến mãi, vui lòng đăng nhập trước khi thực hiện giao dịch nạp tiền."
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          fetchUser();
          window.dispatchEvent(new Event("refreshUser"));
        }}
      />
    </>
  );
}

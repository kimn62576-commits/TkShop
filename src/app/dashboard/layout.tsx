"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Boxes, LayoutDashboard, Library, Wallet, ShoppingBag, 
  Heart, Settings, Shield, LogOut, ChevronRight, Menu, X, Plus 
} from "lucide-react";
import { SessionUser } from "@/types";
import { formatVND } from "@/lib/utils";
import DepositModal from "@/components/wallet/DepositModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  useEffect(() => {
    fetchSession();
    const handleRefresh = () => fetchSession();
    window.addEventListener("refreshUser", handleRefresh);
    return () => window.removeEventListener("refreshUser", handleRefresh);
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B111E] flex items-center justify-center text-[#929BAA] text-xs font-mono">
        Đang tải bảng điều khiển tài khoản...
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/dashboard/library", label: "Kho Asset Của Tôi", icon: Library },
    { href: "/dashboard/wallet", label: "Ví Tiền & Nạp QR", icon: Wallet },
    { href: "/dashboard/orders", label: "Lịch Sử Đơn Hàng", icon: ShoppingBag },
    { href: "/dashboard/wishlist", label: "Sản Phẩm Yêu Thích", icon: Heart },
    { href: "/dashboard/settings", label: "Cài Đặt Tài Khoản", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B111E] text-[#F1F3F6] flex flex-col md:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-60 flex-col bg-[#0F172A] border-r border-[#263554] flex-shrink-0">
        
        {/* Brand */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-[#263554]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/tkshop-logo.png"
              alt="TKSHOP.VN"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[11px] tracking-wider uppercase text-[#F1F3F6]">
                TKSHOP.VN
              </span>
              <span className="text-[9px] font-mono text-[#38BDF8]">
                BÀN LÀM VIỆC CREATOR
              </span>
            </div>
          </Link>
        </div>

        {/* User Quick Info */}
        <div className="p-3.5 border-b border-[#263554]">
          <div className="flex items-center gap-2.5 p-2 rounded bg-[#162036] border border-[#263554]">
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-xs font-semibold text-[#38BDF8]">
              {user?.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F1F3F6] truncate">{user?.displayName}</p>
              <p className="text-[10px] text-[#626D7D] truncate font-mono">{user?.email}</p>
            </div>
          </div>

          {/* Wallet Balance Widget */}
          <div className="mt-2.5 p-2.5 rounded bg-[#0B111E] border border-[#263554] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#626D7D] font-mono block">SỐ DƯ VÍ</span>
              <strong className="text-xs text-[#F1F3F6] font-mono">{formatVND(user?.walletBalance || 0)}</strong>
            </div>
            <button
              onClick={() => setDepositModalOpen(true)}
              className="p-1 rounded bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] transition-colors cursor-pointer"
              title="Nạp tiền vào ví"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-2.5 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#162036] text-[#F1F3F6] border border-[#263554]"
                    : "text-[#929BAA] hover:bg-[#162036]/50 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#38BDF8]" : "text-[#626D7D]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <div className="pt-2.5 border-t border-[#263554] mt-2.5">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-[#38BDF8] hover:bg-[#162036] transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Trang Quản Trị Admin</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#263554] space-y-1 text-xs">
          <Link
            href="/marketplace"
            className="flex items-center justify-between px-2.5 py-1.5 text-[#929BAA] hover:text-[#F1F3F6] transition-colors"
          >
            <span>Quay lại Cửa Hàng</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden h-14 bg-[#0F172A] border-b border-[#263554] px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/tkshop-logo.png"
              alt="TKSHOP.VN"
              className="h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs tracking-wider uppercase text-[#F1F3F6]">
              TKSHOP.VN
            </span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded text-[#929BAA] hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#0F172A] border-b border-[#263554] p-4 space-y-2 text-xs">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className="block py-1.5 text-[#929BAA] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/marketplace"
              onClick={() => setMobileSidebarOpen(false)}
              className="block py-1.5 text-[#38BDF8]"
            >
              Về Cửa Hàng Asset
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-1.5 text-rose-400"
            >
              Đăng Xuất
            </button>
          </div>
        )}

        {/* Main Body Viewport */}
        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          fetchSession();
          setDepositModalOpen(false);
        }}
      />
    </div>
  );
}

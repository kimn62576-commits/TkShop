"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Shield, LayoutDashboard, Package, FolderTree, ShoppingBag, 
  Users, QrCode, Wallet, Tag, MessageSquare, History, 
  Settings, LogOut, ChevronRight, Menu, X, ArrowLeft, Boxes, CreditCard 
} from "lucide-react";
import { SessionUser } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.user || (data.user.role !== "ADMIN" && data.user.role !== "SUPER_ADMIN")) {
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
      <div className="min-h-screen bg-[#0B111E] flex items-center justify-center text-xs font-mono text-[#929BAA]">
        Đang xác thực quyền hạn quản trị...
      </div>
    );
  }

  const adminNav = [
    { href: "/admin", label: "Tổng Quan Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản Lý Sản Phẩm", icon: Package },
    { href: "/admin/categories", label: "Danh Mục Tài Nguyên", icon: FolderTree },
    { href: "/admin/orders", label: "Đơn Hàng & Hoàn Tiền", icon: ShoppingBag },
    { href: "/admin/users", label: "Người Dùng & Phân Quyền", icon: Users },
    { href: "/admin/cards", label: "Gạch Thẻ Cào Tự Động", icon: CreditCard },
    { href: "/admin/deposits", label: "Giao Dịch Nạp VietQR", icon: QrCode },
    { href: "/admin/wallet", label: "Điều Chỉnh Số Dư Ví", icon: Wallet },
    { href: "/admin/coupons", label: "Mã Giảm Giá", icon: Tag },
    { href: "/admin/tickets", label: "Hỗ Trợ Khách Hàng", icon: MessageSquare },
    { href: "/admin/logs", label: "Nhật Ký Hoạt Động (Logs)", icon: History },
    { href: "/admin/settings", label: "Cấu Hình Hệ Thống", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B111E] text-[#F1F3F6] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="hidden md:flex md:w-60 flex-col bg-[#0F172A] border-r border-[#263554] flex-shrink-0">
        
        {/* Brand */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-[#263554]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/tkshop-logo.png"
              alt="TKSHOP.VN"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-bold text-[11px] tracking-wider uppercase text-[#F1F3F6] block">
                TKSHOP.VN
              </span>
              <span className="text-[9px] text-[#38BDF8] font-mono block">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => {
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
        </nav>

        {/* Footer Link */}
        <div className="p-3 border-t border-[#263554] space-y-1 text-xs">
          <Link
            href="/marketplace"
            className="flex items-center justify-between px-2.5 py-1.5 text-[#929BAA] hover:text-[#F1F3F6] transition-colors"
          >
            <span>Về Cửa Hàng</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden h-14 bg-[#0F172A] border-b border-[#263554] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[#F1F3F6]">Bảng Quản Trị</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded text-[#929BAA] hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0F172A] border-b border-[#263554] p-4 space-y-1 text-xs">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-[#929BAA] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

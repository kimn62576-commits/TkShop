"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, Wallet, Library, ArrowUpRight, ArrowDownLeft, 
  Download, Plus, Clock, CheckCircle2, ChevronRight, Sparkles 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";
import DepositModal from "@/components/wallet/DepositModal";

export default function DashboardOverviewPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setUserData(data.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-[#929BAA] text-xs font-mono">Đang tải dữ liệu không gian cá nhân...</div>;
  }

  const wallet = userData?.wallet;
  const orders = userData?.orders || [];
  const transactions = wallet?.transactions || [];

  // Trích xuất các sản phẩm đã mua
  const purchasedProducts = orders.flatMap((o: any) =>
    o.items.map((i: any) => ({
      ...i.product,
      orderNumber: o.orderNumber,
      purchasedAt: o.createdAt,
    }))
  );

  return (
    <div className="space-y-8">
      
      {/* Banner Chào Mừng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#162036] border border-[#263554] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F1F3F6] tracking-tight">
            Không Gian Creator: {userData?.profile?.displayName || "Lập Trình Viên"}
          </h1>
          <p className="text-xs text-[#929BAA] mt-1">
            Quản lý quyền sở hữu asset Roblox Studio, giấy phép bản quyền và số dư ví VietQR.
          </p>
        </div>
        <button
          onClick={() => setDepositModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-95 border border-amber-300"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nạp Tiền Vào Ví (+20%)</span>
        </button>
      </div>

      {/* Lưới Thống Kê Chỉ Số Chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Số Dư Ví */}
        <div className="p-4 rounded-xl bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Số Dư Ví</span>
            <div className="w-7 h-7 rounded-lg bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-[#38BDF8]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#F1F3F6] font-mono">
            {formatVND(wallet?.balance || 0)}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono block">Khả dụng để mua ngay</span>
        </div>

        {/* Tổng Tiền Đã Mua */}
        <div className="p-4 rounded-xl bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Tổng Tiền Đã Mua</span>
            <div className="w-7 h-7 rounded-lg bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-[#929BAA]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#F1F3F6] font-mono">
            {formatVND(wallet?.totalSpent || 0)}
          </p>
          <span className="text-[11px] text-[#626D7D] font-mono block">Toàn bộ đơn hàng</span>
        </div>

        {/* Tổng Đơn Hàng */}
        <div className="p-4 rounded-xl bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Tổng Đơn Hàng</span>
            <div className="w-7 h-7 rounded-lg bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#F1F3F6]">
            {orders.length}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono block">100% Đã Giao Tự Động</span>
        </div>

        {/* Asset Sở Hữu */}
        <div className="p-4 rounded-xl bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Asset Đang Sở Hữu</span>
            <div className="w-7 h-7 rounded-lg bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-[#38BDF8]">
              <Library className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#F1F3F6]">
            {purchasedProducts.length}
          </p>
          <Link href="/dashboard/library" className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1 font-mono">
            <span>Vào Kho Asset</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* 2 Cột: Asset Vừa Mua & Biến Động Số Dư */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asset Vừa Mua */}
        <div className="p-5 rounded-2xl bg-[#162036] border border-[#263554] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#263554] pb-3">
            <h3 className="text-xs font-bold text-[#F1F3F6] uppercase tracking-wider">
              Asset Vừa Mua Gần Đây
            </h3>
            <Link href="/dashboard/library" className="text-xs font-mono text-[#38BDF8] hover:underline">
              Xem Tất Cả →
            </Link>
          </div>

          {purchasedProducts.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#929BAA] space-y-2">
              <p>Bạn chưa mua asset Roblox Studio nào.</p>
              <Link href="/marketplace" className="text-[#38BDF8] font-medium hover:underline inline-block">
                Khám Phá Cửa Hàng Ngay →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#263554]">
              {purchasedProducts.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100"}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#263554] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F1F3F6] truncate">{item.title}</p>
                      <p className="text-[10px] text-[#929BAA] font-mono">
                        {item.fileFormat} · {formatDate(item.purchasedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/download/${item.id}`}
                    className="p-1.5 rounded-lg bg-[#1E2B48] hover:bg-[#263554] text-[#38BDF8] transition-colors flex-shrink-0"
                    title="Tải File Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biến Động Số Dư Gần Đây */}
        <div className="p-5 rounded-2xl bg-[#162036] border border-[#263554] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#263554] pb-3">
            <h3 className="text-xs font-bold text-[#F1F3F6] uppercase tracking-wider">
              Biến Động Số Dư Gần Đây
            </h3>
            <Link href="/dashboard/wallet" className="text-xs font-mono text-[#38BDF8] hover:underline">
              Lịch Sử Ví →
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#929BAA]">
              Chưa có giao dịch nào được ghi nhận.
            </div>
          ) : (
            <div className="divide-y divide-[#263554]">
              {transactions.slice(0, 4).map((tx: any) => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      tx.type === "DEPOSIT" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {tx.type === "DEPOSIT" ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-[#F1F3F6] font-medium">
                        {tx.type === "DEPOSIT" ? "Nạp tiền vào ví" : tx.description || "Thanh toán asset"}
                      </p>
                      <p className="text-[10px] text-[#626D7D] font-mono">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-semibold ${tx.type === "DEPOSIT" ? "text-emerald-400" : "text-[#F1F3F6]"}`}>
                      {tx.type === "DEPOSIT" ? "+" : "-"}{formatVND(tx.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          fetchUserData();
          setDepositModalOpen(false);
        }}
      />
    </div>
  );
}

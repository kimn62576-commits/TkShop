"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  DollarSign, ShoppingBag, Users, Package, Clock, 
  ArrowUpRight, TrendingUp, ShieldAlert, CheckCircle2, QrCode 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-xs font-mono text-[#929BAA]">Đang tải số liệu hệ thống...</div>;
  }

  const stats = data?.stats || {};
  const bestSellers = data?.bestSellers || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      
      {/* Tiêu đề */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
          Tổng Quan Quản Trị Hệ Thống
        </h1>
        <p className="text-xs text-[#929BAA] mt-1">
          Theo dõi doanh thu thực tế, người dùng, giao dịch nạp VietQR và các sản phẩm bán chạy nhất.
        </p>
      </div>

      {/* Các Thẻ KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Tổng Doanh Thu */}
        <div className="p-4 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#929BAA] uppercase">Tổng Doanh Thu</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F1F3F6] font-mono">
            {formatVND(stats.totalRevenue || 0)}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono block">Thanh toán thực tế</span>
        </div>

        {/* Tổng Đơn Hàng */}
        <div className="p-4 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#929BAA] uppercase">Tổng Đơn Hàng</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-[#38BDF8]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F1F3F6] font-mono">
            {stats.totalOrders || 0}
          </p>
          <span className="text-[10px] text-[#626D7D] font-mono block">Đơn đã hoàn tất</span>
        </div>

        {/* Tổng Người Dùng */}
        <div className="p-4 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#929BAA] uppercase">Nhà Phát Triển</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-sky-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F1F3F6] font-mono">
            {stats.totalUsers || 0}
          </p>
          <span className="text-[10px] text-[#626D7D] font-mono block">Tài khoản đăng ký</span>
        </div>

        {/* Tổng Sản Phẩm */}
        <div className="p-4 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#929BAA] uppercase">Asset Đang Bán</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-purple-400">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F1F3F6] font-mono">
            {stats.totalProducts || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono block">Đã duyệt kiểm định</span>
        </div>

        {/* Tổng Tiền Nạp VietQR */}
        <div className="p-4 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#929BAA] uppercase">Tổng Nạp VietQR</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-amber-400">
              <QrCode className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F1F3F6] font-mono">
            {formatVND(stats.totalDeposits || 0)}
          </p>
          <span className="text-[10px] text-amber-400 font-mono block">Cộng ví tự động</span>
        </div>

      </div>

      {/* 2 Khối Chi Tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sản phẩm bán chạy */}
        <div className="p-5 rounded-lg bg-[#162036] border border-[#263554] space-y-4">
          <div className="flex items-center justify-between border-b border-[#263554] pb-3">
            <h3 className="text-xs font-semibold text-[#F1F3F6] uppercase tracking-wider">
              Tài Nguyên Bán Chạy Nhất
            </h3>
            <Link href="/admin/products" className="text-xs font-mono text-[#38BDF8] hover:underline">
              Quản lý sản phẩm →
            </Link>
          </div>

          <div className="divide-y divide-[#263554]">
            {bestSellers.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100"}
                    alt={item.title}
                    className="w-10 h-10 rounded object-cover border border-[#263554] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[#F1F3F6] truncate">{item.title}</p>
                    <p className="text-[10px] text-[#929BAA] font-mono">{item.category?.name} · {formatVND(item.price)}</p>
                  </div>
                </div>
                <div className="text-right font-mono flex-shrink-0">
                  <span className="font-semibold text-emerald-400">{item.salesCount} đã bán</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="p-5 rounded-lg bg-[#162036] border border-[#263554] space-y-4">
          <div className="flex items-center justify-between border-b border-[#263554] pb-3">
            <h3 className="text-xs font-semibold text-[#F1F3F6] uppercase tracking-wider">
              Đơn Hàng Hoàn Thành Gần Đây
            </h3>
            <Link href="/admin/orders" className="text-xs font-mono text-[#38BDF8] hover:underline">
              Xem tất cả đơn hàng →
            </Link>
          </div>

          <div className="divide-y divide-[#263554]">
            {recentOrders.map((o: any) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-[#F1F3F6] font-mono">{o.orderNumber}</p>
                  <p className="text-[10px] text-[#626D7D] font-mono">
                    {o.user?.email} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <p className="font-semibold text-[#F1F3F6]">{formatVND(o.totalAmount)}</p>
                  <span className="text-[10px] font-mono text-emerald-400">HOÀN TẤT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

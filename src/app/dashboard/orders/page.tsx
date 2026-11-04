"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Download, CheckCircle2, X } from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setOrders(data.user?.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tiêu đề */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
          Lịch Sử Đơn Hàng
        </h1>
        <p className="text-xs text-[#929BAA] mt-1">
          Xem danh sách đơn hàng đã thanh toán và hóa đơn điện tử cho từng asset.
        </p>
      </div>

      {/* Bảng Đơn Hàng */}
      <div className="bg-[#162036] border border-[#263554] rounded-lg p-5 sm:p-6">
        {loading ? (
          <div className="text-xs font-mono text-[#929BAA] py-6">Đang tải lịch sử đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#929BAA] space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-[#626D7D]" />
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link href="/marketplace" className="text-[#38BDF8] font-medium hover:underline block">
              Khám phá cửa hàng tài nguyên ngay →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B111E] text-[#929BAA] uppercase font-mono text-[11px] border-b border-[#263554]">
                <tr>
                  <th className="px-4 py-2.5">Mã đơn hàng</th>
                  <th className="px-4 py-2.5">Sản phẩm</th>
                  <th className="px-4 py-2.5">Ngày đặt</th>
                  <th className="px-4 py-2.5">Phương thức</th>
                  <th className="px-4 py-2.5">Tổng thanh toán</th>
                  <th className="px-4 py-2.5">Trạng thái</th>
                  <th className="px-4 py-2.5 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263554]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#1E2B48]/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-[#38BDF8] whitespace-nowrap">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-[#F1F3F6] max-w-xs truncate">
                      {o.items?.[0]?.product?.title || "Tài nguyên kỹ thuật số"}
                      {o.items?.length > 1 && ` (+${o.items.length - 1} khác)`}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#929BAA] whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[#929BAA] whitespace-nowrap">
                      {o.paymentMethod === "WALLET" ? "Ví điện tử" : "Miễn phí"}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-[#F1F3F6] whitespace-nowrap">
                      {formatVND(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        o.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {o.status === "COMPLETED" ? "Đã Giao File" : o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceipt(o)}
                        className="px-2.5 py-1 bg-[#0B111E] hover:bg-[#1E2B48] border border-[#263554] text-[#F1F3F6] rounded transition-colors text-xs font-medium"
                      >
                        Hóa đơn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Xem Hóa Đơn Chi Tiết */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#162036] border border-[#263554] rounded-lg p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-[#263554] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#F1F3F6]">
                  Hóa Đơn: {activeReceipt.orderNumber}
                </h3>
                <span className="text-[11px] text-[#626D7D] font-mono">
                  Ngày mua: {formatDate(activeReceipt.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-[#929BAA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="divide-y divide-[#263554]">
                {activeReceipt.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#F1F3F6]">{item.product?.title}</p>
                      <p className="text-[10px] text-[#626D7D] font-mono">Định dạng: {item.product?.fileFormat || ".rbxm"}</p>
                    </div>
                    <span className="font-mono text-[#F1F3F6]">{formatVND(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#263554] flex justify-between font-semibold text-xs text-[#F1F3F6]">
                <span>Tổng cộng:</span>
                <span className="font-mono text-[#38BDF8]">{formatVND(activeReceipt.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-1.5 bg-[#1E2B48] hover:bg-[#263554] text-xs font-semibold rounded text-[#F1F3F6] border border-[#263554]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

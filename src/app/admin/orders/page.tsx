"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Search, Undo2, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Refund modal
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?q=${encodeURIComponent(search)}&status=${statusFilter}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRefund = (order: any) => {
    setSelectedOrder(order);
    setRefundReason("");
    setRefundModalOpen(true);
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !refundReason.trim()) return;

    if (!confirm(`Xác nhận hoàn lại ${formatVND(selectedOrder.totalAmount)} vào ví của ${selectedOrder.user?.email}?`)) {
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Hoàn tiền thành công!");
      setRefundModalOpen(false);
      fetchOrders();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Đơn Hàng & Hoàn Tiền</h1>
          <p className="text-xs text-dark-muted mt-1">
            Tra cứu toàn bộ đơn hàng mua assets số hóa và thực hiện hoàn tiền theo quy trình kiểm soát.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-white"
          >
            <option value="ALL">Tất cả</option>
            <option value="COMPLETED">Đã thanh toán</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh sách đơn hàng...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Tổng thanh toán</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hoàn tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-light whitespace-nowrap">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-white block">{o.user?.profile?.displayName || "N/A"}</span>
                      <span className="text-[10px] text-dark-muted">{o.user?.email}</span>
                    </td>
                    <td className="px-4 py-3 text-white max-w-xs truncate">
                      {o.items?.[0]?.product?.title}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                      {formatVND(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {o.status === "COMPLETED" ? (
                        <button
                          onClick={() => handleOpenRefund(o)}
                          className="px-2.5 py-1 bg-dark-bg hover:bg-red-500/20 text-red-400 border border-dark-border rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ml-auto"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Hoàn tiền</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-dark-muted italic">Đã hoàn tiền</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {refundModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">Xác Nhận Hoàn Tiền Đơn Hàng</h3>
              <button onClick={() => setRefundModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border text-xs space-y-1.5">
              <div className="flex justify-between text-dark-muted">
                <span>Mã đơn:</span>
                <span className="font-mono text-brand-light font-bold">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between text-dark-muted">
                <span>Khách hàng:</span>
                <span className="text-white">{selectedOrder.user?.email}</span>
              </div>
              <div className="flex justify-between text-dark-muted">
                <span>Số tiền hoàn lại:</span>
                <span className="font-mono font-bold text-green-400">{formatVND(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-text mb-1">LÝ DO HOÀN TIỀN (BẮT BUỘC)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ lý do hoàn tiền để ghi vào nhật ký kiểm toán và thông báo tới khách hàng..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="px-4 py-2 bg-dark-bg hover:bg-dark-border text-white rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-glow"
                >
                  {processing ? "Đang xử lý..." : "Xác Nhận Hoàn Tiền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

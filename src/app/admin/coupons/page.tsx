"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, X, RefreshCw } from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(50000);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [expiresDays, setExpiresDays] = useState<number>(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSaving(true);

    try {
      const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          minOrderValue,
          maxUses,
          expiresAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setModalOpen(false);
      setCode("");
      fetchCoupons();
      alert("Tạo mã giảm giá thành công!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa mã giảm giá này?")) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Mã Giảm Giá (Coupons)</h1>
          <p className="text-xs text-dark-muted mt-1">
            Thiết lập các mã coupon khuyến mãi theo phần trăm hoặc số tiền cố định.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Coupon Mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh sách coupon...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Mã giảm giá</th>
                  <th className="px-4 py-3">Loại giảm</th>
                  <th className="px-4 py-3">Mức giảm</th>
                  <th className="px-4 py-3">Đơn tối thiểu</th>
                  <th className="px-4 py-3">Đã dùng / Giới hạn</th>
                  <th className="px-4 py-3">Ngày hết hạn</th>
                  <th className="px-4 py-3 text-right">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-light whitespace-nowrap">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 text-dark-muted whitespace-nowrap">
                      {c.discountType === "PERCENTAGE" ? "Phần trăm (%)" : "Số tiền cố định"}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-400 whitespace-nowrap font-mono">
                      {c.discountType === "PERCENTAGE" ? `-${c.discountValue}%` : `-${formatVND(c.discountValue)}`}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {formatVND(c.minOrderValue)}
                    </td>
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                      {c.usedCount} / {c.maxUses}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {formatDate(c.expiresAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg bg-dark-bg hover:bg-red-500/20 text-red-400 border border-dark-border transition-colors"
                        title="Xóa coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">Tạo Mã Giảm Giá Mới</h3>
              <button onClick={() => setModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-text mb-1">MÃ COUPON (VIẾT HOA)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SUMMER2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark-text mb-1">LOẠI GIẢM</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (VND)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-dark-text mb-1">GIÁ TRỊ GIẢM</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark-text mb-1">ĐƠN TỐI THIỂU (VND)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-dark-text mb-1">LƯỢT DÙNG TỐI ĐA</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">HẠN SỬ DỤNG (SỐ NGÀY TÍNH TỪ HÔM NAY)</label>
                <input
                  type="number"
                  value={expiresDays}
                  onChange={(e) => setExpiresDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-dark-bg hover:bg-dark-border text-white rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg shadow-glow"
                >
                  {saving ? "Đang tạo..." : "Tạo Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

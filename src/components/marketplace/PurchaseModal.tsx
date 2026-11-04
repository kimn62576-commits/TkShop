"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, ShieldCheck, ShieldAlert, Tag, CheckCircle2, AlertCircle, RefreshCw, Wallet, Download } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    fileFormat?: string;
    thumbnail?: string;
  };
  userBalance?: number;
  onOpenDeposit: () => void;
  onSuccess: () => void;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  product,
  userBalance = 0,
  onOpenDeposit,
  onSuccess,
}: PurchaseModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [agreedToAntiLeak, setAgreedToAntiLeak] = useState(false);

  if (!isOpen) return null;

  const finalPrice = Math.max(0, product.price - couponDiscount);
  const isBalanceEnough = userBalance >= finalPrice;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError(null);

    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      const discount = Math.round((product.price * 10) / 100);
      setCouponDiscount(discount);
      setCouponApplied(true);
    } else if (code === "ROBLOXDEV") {
      setCouponDiscount(Math.min(product.price, 50000));
      setCouponApplied(true);
    } else {
      setCouponError("Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng.");
    }
  };

  const handleConfirmPurchase = async () => {
    if (!agreedToAntiLeak) {
      setError("Vui lòng tích xác nhận cam kết Không Leak/Bán Lại tài nguyên trước khi thanh toán.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Lỗi xử lý đơn hàng");
      }

      setSuccessOrder(data.orderNumber);
      window.dispatchEvent(new Event("refreshUser"));
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Giao dịch không thành công.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-dropdown overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-50 border border-slate-200 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Xác Nhận Đơn Hàng</h3>
              <p className="text-[11px] text-slate-600">Cấp quyền kỹ thuật số tức thì & giao dịch bảo mật</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-5">
          {successOrder ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Thanh Toán Thành Công!</h4>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Mã đơn hàng: <strong className="text-blue-600">{successOrder}</strong>
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Giấy phép bản quyền đã được kích hoạt và lưu vào thư viện của bạn.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/dashboard/library"
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Đến Thư Viện Để Tải File Ngay</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-1.5 text-xs text-slate-600 hover:text-white"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Thông Tin Sản Phẩm */}
              <div className="flex items-center gap-3 p-3 rounded bg-slate-50 border border-slate-200">
                <img
                  src={product.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100"}
                  alt={product.title}
                  className="w-11 h-11 rounded object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-slate-900 truncate">{product.title}</h4>
                  <p className="text-[11px] text-slate-600 font-mono">Định dạng: {product.fileFormat || ".rbxm"}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-900 font-mono">{formatVND(product.price)}</span>
                </div>
              </div>

              {/* Ô Nhập Mã Giảm Giá */}
              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1.5 uppercase">
                  Mã Giảm Giá (Nếu Có)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ví dụ: WELCOME10 hoặc ROBLOXDEV"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-[#263554] text-slate-900 text-xs font-medium rounded border border-slate-200 transition-colors disabled:opacity-40"
                  >
                    {couponApplied ? "Đã Áp Dụng" : "Áp Dụng"}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-400 mt-1">✓ Đã giảm trừ: -{formatVND(couponDiscount)}</p>
                )}
              </div>

              {/* Tóm Tắt Chi Phí */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Giá gốc:</span>
                  <span className="font-mono">{formatVND(product.price)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Mã giảm giá:</span>
                    <span className="font-mono">-{formatVND(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Tổng thanh toán:</span>
                  <span className="font-mono text-blue-600">{formatVND(finalPrice)}</span>
                </div>
              </div>

              {/* Kiểm Tra Số Dư Ví */}
              <div className={`p-3 rounded border flex items-center justify-between text-xs ${
                isBalanceEnough
                  ? "bg-slate-50 border-slate-200 text-slate-600"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Số dư ví hiện tại: <strong className="text-slate-900 font-mono">{formatVND(userBalance)}</strong></span>
                </div>
                {!isBalanceEnough && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDeposit();
                    }}
                    className="px-2.5 py-1 bg-[#38BDF8] text-[#0B111E] text-xs font-semibold rounded hover:bg-[#0EA5E9]"
                  >
                    + Nạp Tiền
                  </button>
                )}
              </div>

                            {/* Điều Khoản Bảo Mật & Cam Kết Chống Leak Asset */}
              <div className="rounded-lg bg-slate-100 border border-amber-500/30 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Điều Khoản Bản Quyền & Cam Kết Chống Leak
                  </span>
                </div>
                
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Toàn bộ mã nguồn, Model và Framework tại <strong className="text-blue-600">TKSHOP.VN</strong> đều được mã hóa <strong className="text-[#F8FAFC]">Watermark số định danh</strong> theo User ID. Mọi hành vi <strong>leak, share file trái phép qua Discord/Telegram hoặc bán lại</strong> sẽ bị:
                </p>

                <ul className="text-[10px] text-[#94A3B8] space-y-1 list-disc list-inside font-mono">
                  <li>Khóa vĩnh viễn tài khoản & tước quyền tải toàn bộ thư viện asset.</li>
                  <li>Tịch thu toàn bộ số dư ví hiện có không hoàn lại.</li>
                  <li>Đưa Roblox User ID / Discord ID vào danh sách đen (Blacklist).</li>
                  <li>Xử lý theo quy định bảo vệ quyền tác giả & sở hữu trí tuệ.</li>
                </ul>

                {/* Checkbox Bắt Buộc */}
                <label className="flex items-start gap-2.5 pt-2 border-t border-slate-200 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToAntiLeak}
                    onChange={(e) => setAgreedToAntiLeak(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-200 bg-slate-50 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#F8FAFC] group-hover:text-blue-600 transition-colors font-medium">
                    Tôi cam kết KHÔNG LEAK, KHÔNG BÁN LẠI. Nếu vi phạm tôi đồng ý bị khóa vĩnh viễn tài khoản và chịu mọi hình thức xử lý.
                  </span>
                </label>
              </div>

              {/* Nút Xác Nhận Thanh Toán */}
              <button
                type="button"
                disabled={loading || !isBalanceEnough || !agreedToAntiLeak}
                onClick={handleConfirmPurchase}
                className="w-full py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Xác Nhận Mua Asset ({formatVND(finalPrice)})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

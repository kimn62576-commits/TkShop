"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, Zap, AlertTriangle, CheckCircle2, XCircle, 
  Clock, RefreshCw, Sparkles, ShieldAlert, ArrowRight, Check
} from "lucide-react";
import { formatVND } from "@/lib/utils";

interface TelcoItem {
  code: string;
  name: string;
  color: string;
  badge: string;
}

const TELCOS: TelcoItem[] = [
  { code: "VIETTEL", name: "Viettel", color: "from-red-600 to-rose-700", badge: "Viettel" },
  { code: "VINAPHONE", name: "VinaPhone", color: "from-blue-600 to-sky-600", badge: "Vina" },
  { code: "MOBIFONE", name: "MobiFone", color: "from-blue-700 to-indigo-700", badge: "Mobi" },
  { code: "VIETNAMOBILE", name: "Vietnamobile", color: "from-orange-500 to-amber-600", badge: "VNM" },
  { code: "ZING", name: "Thẻ Zing", color: "from-emerald-600 to-teal-700", badge: "Zing" },
  { code: "GATE", name: "Thẻ Gate", color: "from-amber-600 to-yellow-600", badge: "Gate" },
  { code: "GARENA", name: "Thẻ Garena", color: "from-red-700 to-rose-900", badge: "Garena" },
];

const AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

interface CardDepositTabProps {
  onSuccess?: () => void;
  onStartProcessing?: (amount: number, bonus: number, message?: string) => void;
  onFinishSuccess?: (amount: number, bonus: number, message?: string) => void;
  onFinishError?: (errorMsg: string) => void;
}

export default function CardDepositTab({ 
  onSuccess,
  onStartProcessing,
  onFinishSuccess,
  onFinishError,
}: CardDepositTabProps) {
  const [selectedTelco, setSelectedTelco] = useState<string>("VIETTEL");
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [pin, setPin] = useState<string>("");
  const [serial, setSerial] = useState<string>("");
  const [discountRates, setDiscountRates] = useState<Record<string, number>>({});
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lịch sử thẻ
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
    fetchHistory();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/cards/rates");
      const data = await res.json();
      if (data.success && data.discounts) {
        const rateMap: Record<string, number> = {};
        data.discounts.forEach((d: any) => {
          rateMap[`${d.telco}_${d.amount}`] = d.discount;
        });
        setDiscountRates(rateMap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/cards/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.cards || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Tính chiết khấu & thực nhận
  const currentKey = `${selectedTelco}_${selectedAmount}`;
  const currentDiscount = discountRates[currentKey] !== undefined ? discountRates[currentKey] : 12;
  const receivedAmount = Math.round(selectedAmount - (selectedAmount * currentDiscount) / 100);
  const bonusAmount = Math.round(selectedAmount * 0.2); // Khuyến mãi nạp 20%

  // Điền mã thẻ mẫu test
  const handleFillSample = () => {
    const randomPin = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const randomSerial = "1000" + Math.floor(10000000 + Math.random() * 90000000).toString();
    setPin(randomPin);
    setSerial(randomSerial);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !serial.trim()) {
      setError("Vui lòng nhập đầy đủ Mã thẻ (PIN) và Số Seri");
      return;
    }
    if (pin.trim().length < 5 || serial.trim().length < 5) {
      setError("Mã thẻ hoặc số Seri không đúng định dạng!");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    // Kích hoạt animation đang xử lý trên giao diện
    if (onStartProcessing) {
      onStartProcessing(
        selectedAmount,
        bonusAmount,
        `Đang chuyển mã thẻ ${selectedTelco} mệnh giá ${formatVND(selectedAmount)} lên cổng gạch tự động...`
      );
    }

    const startTime = Date.now();

    try {
      const res = await fetch("/api/cards/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telco: selectedTelco,
          declaredAmount: selectedAmount,
          pin: pin.trim(),
          serial: serial.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gửi thẻ cào thất bại");
      }

      setPin("");
      setSerial("");
      fetchHistory();
      window.dispatchEvent(new Event("refreshUser"));

      // Nếu đang trong chế độ Sandbox (mặc định test), tự động phê duyệt ngay sau 1.4s để kích hoạt animation chúc mừng
      if (data.deposit && (data.deposit.gateway === "SANDBOX" || !process.env.CARD_PARTNER_ID)) {
        setTimeout(async () => {
          try {
            await fetch("/api/cards/simulate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requestId: data.deposit.requestId, outcome: "SUCCESS" }),
            });
            fetchHistory();
            window.dispatchEvent(new Event("refreshUser"));
            if (onSuccess) onSuccess();

            if (onFinishSuccess) {
              onFinishSuccess(
                selectedAmount,
                bonusAmount,
                `Thẻ ${selectedTelco} mệnh giá ${formatVND(selectedAmount)} đã được nạp thành công! Tiền & +20% khuyến mãi đã vào ví.`
              );
            }
          } catch {
            if (onFinishSuccess) {
              onFinishSuccess(
                selectedAmount,
                bonusAmount,
                "Thẻ cào đã được gửi lên hệ thống và đang trong hàng đợi xử lý tức thì."
              );
            }
          }
        }, 1400);
      } else {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 1400 - elapsed);
        setTimeout(() => {
          if (onFinishSuccess) {
            onFinishSuccess(
              selectedAmount,
              bonusAmount,
              "Thẻ cào đã được gửi thành công lên cổng gạch thẻ 24/7!"
            );
          }
        }, remainingDelay);
      }

    } catch (err: any) {
      if (onFinishError) {
        onFinishError(err.message || "Gửi thẻ thất bại");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Giả lập duyệt thẻ nhanh trong chế độ Sandbox
  const handleSimulate = async (item: any, outcome: "SUCCESS" | "WRONG_AMOUNT" | "FAILED") => {
    setSimulatingId(item.requestId);
    const itemAmount = item.declaredAmount || selectedAmount;
    const itemBonus = Math.round(itemAmount * 0.2);

    if (outcome === "SUCCESS" && onStartProcessing) {
      onStartProcessing(
        itemAmount,
        itemBonus,
        `Đang duyệt và đối soát thẻ ${item.telco} ${formatVND(itemAmount)}...`
      );
    }

    const startTime = Date.now();

    try {
      const res = await fetch("/api/cards/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: item.requestId, outcome }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchHistory();
      window.dispatchEvent(new Event("refreshUser"));
      if (onSuccess) onSuccess();

      if (outcome === "SUCCESS" && onFinishSuccess) {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 1400 - elapsed);
        setTimeout(() => {
          onFinishSuccess(
            itemAmount,
            itemBonus,
            `Thẻ ${item.telco} ${formatVND(itemAmount)} đã được phê duyệt thành công! Số dư ví đã được cộng tức thì.`
          );
        }, remainingDelay);
      }
    } catch (err: any) {
      if (outcome === "SUCCESS" && onFinishError) {
        onFinishError(err.message || "Lỗi duyệt thẻ Sandbox");
      } else {
        alert("Lỗi: " + err.message);
      }
    } finally {
      setSimulatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 01. BẢNG CHỌN NHÀ MẠNG */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          1. Chọn nhà mạng / Loại thẻ
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TELCOS.map((telco) => (
            <button
              key={telco.code}
              type="button"
              onClick={() => setSelectedTelco(telco.code)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedTelco === telco.code
                  ? "border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-slate-800">{telco.badge}</span>
                {selectedTelco === telco.code && (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 truncate">{telco.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 02. BẢNG CHỌN MỆNH GIÁ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Chọn mệnh giá thẻ
          </label>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Chiết khấu: -{currentDiscount}% · Thực nhận: {formatVND(receivedAmount)}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {AMOUNTS.map((amt) => {
            const isSelected = selectedAmount === amt;
            const itemKey = `${selectedTelco}_${amt}`;
            const itemDiscount = discountRates[itemKey] !== undefined ? discountRates[itemKey] : 12;
            const itemReceived = Math.round(amt - (amt * itemDiscount) / 100);

            return (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`text-xs font-black ${isSelected ? "text-amber-800" : "text-slate-800"}`}>
                  {formatVND(amt)}
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  Nhận {formatVND(itemReceived)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 03. FORM NHẬP MÃ THẺ & SỐ SERI */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số Seri Thẻ:
            </label>
            <input
              type="text"
              placeholder="Nhập số seri trên thẻ cào"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mã Thẻ (Mã PIN):
            </label>
            <input
              type="text"
              placeholder="Nhập mã thẻ cào dưới lớp tráng bạc"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 uppercase"
            />
          </div>
        </div>

        {/* Nút Điền Thẻ Mẫu Cho Sandbox Test */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-[11px] text-slate-500">
            Hệ thống gạch thẻ tự động xử lý <strong>từ 5 - 30 giây</strong>.
          </span>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Điền mã thẻ mẫu (Sandbox Test)</span>
          </button>
        </div>

        {/* Cảnh Báo Quy Định Chống Sai Mệnh Giá */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>QUY ĐỊNH GẠCH THẺ CHỐNG NUỐT THẺ:</span>
          </div>
          <p className="leading-relaxed pl-5 text-amber-700">
            Quý khách vui lòng chọn <strong>đúng mệnh giá thẻ</strong>. Trường hợp khai sai mệnh giá, nhà mạng sẽ áp dụng <strong>phạt 50% thực nhận</strong> hoặc hủy thẻ theo quy định của cổng gạch thẻ!
          </p>
        </div>

        {/* Thông Báo Lỗi / Thành Công */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Nút Bấm Nạp Thẻ Gaming Vàng Cam Nổi Bật (Có Tia Sáng & Animation) */}
        <button
          type="submit"
          disabled={submitting}
          className="relative overflow-hidden group w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 active:scale-[0.98] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] border border-amber-300/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {/* Shimmer Light Beam */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Đang gửi thẻ lên hệ thống bot...</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>Nạp Thẻ Ngay · Thực Nhận {formatVND(receivedAmount)}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px] font-mono font-black border border-amber-400/50">
                +20% Ví
              </span>
            </>
          )}
        </button>

      </form>

      {/* 04. LỊCH SỬ THẺ CÀO GẦN ĐÂY */}
      <div className="pt-2 border-t border-slate-200/90">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lịch sử gửi thẻ gần đây</span>
          </span>
          <button
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loadingHistory ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400">
            Bạn chưa gửi thẻ cào nào
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col gap-1.5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-black text-[10px]">
                      {item.telco}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatVND(item.declaredAmount)}
                    </span>
                  </div>

                  {/* Badge Trạng Thái */}
                  <div>
                    {item.status === "SUCCESS" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>+{formatVND(item.receivedAmount)}</span>
                      </span>
                    )}
                    {item.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Đang xử lý</span>
                      </span>
                    )}
                    {item.status === "FAILED" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        <span>Thất bại</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Seri: {item.serial}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {item.note && (
                  <div className="text-[10px] text-slate-600 italic bg-white/80 p-1.5 rounded border border-slate-100">
                    {item.note}
                  </div>
                )}

                {/* Nếu thẻ đang PENDING trong Sandbox: cho phép test duyệt tức thì kèm Animation */}
                {item.status === "PENDING" && (
                  <div className="pt-1 flex items-center gap-1.5 border-t border-dashed border-slate-200">
                    <span className="text-[10px] text-slate-500 font-sans">Sandbox Test:</span>
                    <button
                      type="button"
                      disabled={simulatingId === item.requestId}
                      onClick={() => handleSimulate(item, "SUCCESS")}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Duyệt thành công (Xem Animation)
                    </button>
                    <button
                      type="button"
                      disabled={simulatingId === item.requestId}
                      onClick={() => handleSimulate(item, "WRONG_AMOUNT")}
                      className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Sai mệnh giá (-50%)
                    </button>
                    <button
                      type="button"
                      disabled={simulatingId === item.requestId}
                      onClick={() => handleSimulate(item, "FAILED")}
                      className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Báo sai thẻ
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

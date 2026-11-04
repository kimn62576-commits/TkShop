"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  X, QrCode, Copy, Check, AlertCircle, RefreshCw, 
  Zap, CreditCard, Sparkles, CheckCircle2 
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import CardDepositTab from "./CardDepositTab";
import DepositAnimationOverlay from "./DepositAnimationOverlay";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"VIETQR" | "CARD">("CARD");
  const [step, setStep] = useState<"INPUT" | "QR">("INPUT");
  const [amount, setAmount] = useState<number>(100000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depositData, setDepositData] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [confirmingSandbox, setConfirmingSandbox] = useState(false);

  // Trạng thái Animation Đang Xử Lý & Chúc Mừng Thành Công
  const [animStatus, setAnimStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [animAmount, setAnimAmount] = useState<number>(100000);
  const [animBonus, setAnimBonus] = useState<number>(20000);
  const [animMsg, setAnimMsg] = useState<string>("Giao dịch nạp tiền đã hoàn tất thành công!");
  const [animError, setAnimError] = useState<string>("");

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleCreateDeposit = async () => {
    if (amount < 20000) {
      setError("Số tiền nạp tối thiểu là 20.000đ");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Tạo yêu cầu nạp tiền thất bại");
      }

      setDepositData(data.deposit);
      setStep("QR");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi trong quá trình tạo mã");
    } finally {
      setLoading(false);
    }
  };

  // Tự động kiểm tra trạng thái thanh toán real-time theo chu kỳ 2.5 giây khi đang hiển thị mã QR
  useEffect(() => {
    if (!isOpen || step !== "QR" || !depositData?.transactionCode || animStatus !== "idle") return;

    let isCancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/wallet/deposit?code=${encodeURIComponent(depositData.transactionCode)}`);
        const data = await res.json();
        if (data.isCompleted && !isCancelled) {
          clearInterval(interval);
          const targetAmount = depositData.amount || amount;
          const bonus = Math.round(targetAmount * 0.2);
          setAnimAmount(targetAmount);
          setAnimBonus(bonus);
          setAnimMsg(`Hệ thống TKSHOP đã ghi nhận giao dịch chuyển khoản ${formatVND(targetAmount)}. Số dư ví và +20% khuyến mãi đã được nạp tự động!`);
          setAnimStatus("success");
          window.dispatchEvent(new Event("refreshUser"));
          if (onSuccess) onSuccess();
        }
      } catch (e) {
        // Tự động tiếp tục kiểm tra
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [step, depositData, animStatus]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Xác nhận nạp VietQR Sandbox với Animation Đang Xử Lý & Chúc Mừng
  const handleSandboxSimulate = async () => {
    if (!depositData) return;
    setConfirmingSandbox(true);
    const targetAmount = depositData.amount || amount;
    const bonus = Math.round(targetAmount * 0.2); // +20% khuyến mại

    setAnimAmount(targetAmount);
    setAnimBonus(bonus);
    setAnimMsg(`Hệ thống TKSHOP đã ghi nhận giao dịch VietQR ${formatVND(targetAmount)}. Số dư ví và +20% khuyến mãi đã được nạp tự động!`);
    setAnimStatus("processing");

    const startTime = Date.now();

    try {
      const res = await fetch("/api/payments/sandbox-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionCode: depositData.transactionCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xác nhận nạp thất bại");

      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 1600 - elapsed);

      setTimeout(() => {
        setAnimStatus("success");
        window.dispatchEvent(new Event("refreshUser"));
        if (onSuccess) onSuccess();
      }, remainingDelay);
    } catch (err: any) {
      setAnimError(err.message || "Lỗi xác nhận nạp tiền");
      setAnimStatus("error");
    } finally {
      setConfirmingSandbox(false);
    }
  };

  // Nút Test Nhanh Animation 1-Click (Dành cho kiểm tra trực tiếp)
  const handleDemoAnimation = () => {
    const demoAmt = 100000;
    const demoBonus = 20000;
    setAnimAmount(demoAmt);
    setAnimBonus(demoBonus);
    setAnimMsg("Giao dịch thử nghiệm thành công! Hệ thống cộng thưởng +20% vào ví TKSHOP.");
    setAnimStatus("processing");

    setTimeout(() => {
      setAnimStatus("success");
      window.dispatchEvent(new Event("refreshUser"));
      if (onSuccess) onSuccess();
    }, 1500);
  };

  const handleClose = () => {
    setStep("INPUT");
    setError(null);
    setDepositData(null);
    setAnimStatus("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
          
          {/* Header with Title & Close */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-sm p-1 flex-shrink-0">
                <img src="/money-vnd-sm.png" alt="Tiền Việt Nam" className="w-8 h-auto object-contain drop-shadow" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Nạp Tiền Vào Ví TKSHOP</h3>
                <p className="text-[11px] text-slate-500">Hệ thống gạch thẻ & VietQR tự động 24/7 tức thì</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Nút Demo Test Animation Nhanh */}
              <button
                type="button"
                onClick={handleDemoAnimation}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-[11px] font-bold border border-amber-400/40 transition-colors cursor-pointer"
                title="Bấm để xem animation đang xử lý và chúc mừng thành công"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Test Animation</span>
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2 Tabs Chuyển Phương Thức Nạp */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("CARD")}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "CARD"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Nạp Thẻ Cào Tự Động</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 text-[10px] font-mono">
                +20%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("VIETQR")}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "VIETQR"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>VietQR / MoMo (+20%)</span>
            </button>
          </div>

          {/* Nội dung Tab */}
          <div className="p-5 max-h-[80vh] overflow-y-auto">
            
            {/* TAB 1: GẠCH THẺ CÀO */}
            {activeTab === "CARD" && (
              <CardDepositTab 
                onSuccess={onSuccess}
                onStartProcessing={(amt, bns, msg) => {
                  setAnimAmount(amt);
                  setAnimBonus(bns);
                  if (msg) setAnimMsg(msg);
                  setAnimStatus("processing");
                }}
                onFinishSuccess={(amt, bns, msg) => {
                  setAnimAmount(amt);
                  setAnimBonus(bns);
                  if (msg) setAnimMsg(msg);
                  setAnimStatus("success");
                  window.dispatchEvent(new Event("refreshUser"));
                  if (onSuccess) onSuccess();
                }}
                onFinishError={(errMsg) => {
                  setAnimError(errMsg);
                  setAnimStatus("error");
                }}
              />
            )}

            {/* TAB 2: VIETQR / MOMO */}
            {activeTab === "VIETQR" && (
              <div>
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {step === "INPUT" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Chọn nhanh số tiền nạp
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((qAmount) => (
                          <button
                            key={qAmount}
                            type="button"
                            onClick={() => setAmount(qAmount)}
                            className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              amount === qAmount
                                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-500/20"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {formatVND(qAmount)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Hoặc nhập số tiền tùy ý (VNĐ)
                      </label>
                      <input
                        type="number"
                        step={10000}
                        min={20000}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tối thiểu: 20.000đ · Nạp qua VietQR/MoMo nhận thêm <strong>+20% khuyến mại</strong> vào tài khoản.
                      </p>
                    </div>

                    {/* Nút Tạo Mã QR Thanh Toán Lấp Lánh */}
                    <button
                      onClick={handleCreateDeposit}
                      disabled={loading}
                      className="relative overflow-hidden group w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 fill-current text-amber-300" />
                      )}
                      <span>Tạo Mã QR Thanh Toán ({formatVND(amount)})</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {depositData?.qrUrl && (
                      <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <img
                          src={depositData.qrUrl}
                          alt="VietQR"
                          className="w-56 h-auto rounded"
                        />
                        <span className="text-[11px] text-slate-500 mt-2 font-medium">
                          Quét mã bằng app ngân hàng hoặc MoMo
                        </span>
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Ngân hàng:</span>
                        <span className="font-bold text-slate-800">{depositData?.bankName}</span>
                      </div>
                      {depositData?.bankAccountName && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Chủ tài khoản:</span>
                          <span className="font-bold text-slate-800 uppercase">{depositData?.bankAccountName}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-600">{depositData?.bankAccountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(depositData?.bankAccountNumber, "acc")}
                            className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                          >
                            {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Số tiền:</span>
                        <span className="font-bold text-slate-900">{formatVND(depositData?.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Nội dung chuyển khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {depositData?.transferContent}
                          </span>
                          <button
                            onClick={() => copyToClipboard(depositData?.transferContent, "content")}
                            className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                          >
                            {copiedField === "content" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Huy hiệu chờ thanh toán live */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 text-[11px] font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span>Hệ thống đang tự động lắng nghe giao dịch chuyển khoản...</span>
                    </div>

                    {/* Trạng thái lắng nghe giao dịch tự động */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => setStep("INPUT")}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        ← Đổi số tiền khác
                      </button>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Tự động cộng tiền khi nhận</span>
                      </div>
                    </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* OVERLAY ANIMATION ĐANG XỬ LÝ & CHÚC MỪNG THÀNH CÔNG */}
      <DepositAnimationOverlay
        status={animStatus}
        amount={animAmount}
        bonusAmount={animBonus}
        message={animMsg}
        errorMessage={animError}
        onClose={() => {
          setAnimStatus("idle");
          handleClose();
        }}
        onGoToMarketplace={() => {
          setAnimStatus("idle");
          handleClose();
          router.push("/marketplace");
        }}
      />
    </>
  );
}

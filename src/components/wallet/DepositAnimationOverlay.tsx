"use client";

import React, { useEffect, useState } from "react";
import { 
  PartyPopper, Trophy, Sparkles, CheckCircle2, 
  Zap, ArrowRight, ShieldCheck, Wallet, ShoppingBag, 
  AlertTriangle, RefreshCw, X
} from "lucide-react";
import { formatVND } from "@/lib/utils";

export interface DepositAnimationProps {
  status: "idle" | "processing" | "success" | "error";
  amount?: number;
  bonusAmount?: number;
  message?: string;
  errorMessage?: string;
  onClose: () => void;
  onGoToMarketplace?: () => void;
}

// Hàm phát âm thanh chúc mừng nhẹ nhàng bằng Web Audio API
const playCelebrationSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [
      { freq: 523.25, time: 0, dur: 0.35, type: "sine" as OscillatorType },    // C5
      { freq: 659.25, time: 0.12, dur: 0.45, type: "sine" as OscillatorType }, // E5
      { freq: 783.99, time: 0.25, dur: 0.7, type: "triangle" as OscillatorType }, // G5
      { freq: 1046.50, time: 0.38, dur: 0.85, type: "sine" as OscillatorType }, // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur);
    });
  } catch {
    // Không làm gián đoạn UI nếu trình duyệt chặn audio
  }
};

export default function DepositAnimationOverlay({
  status,
  amount = 100000,
  bonusAmount = 20000,
  message = "Giao dịch nạp tiền đã hoàn tất thành công!",
  errorMessage = "Giao dịch không thành công. Vui lòng kiểm tra lại thông tin!",
  onClose,
  onGoToMarketplace,
}: DepositAnimationProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(25);

  // Hiệu ứng các bước khi đang xử lý
  useEffect(() => {
    if (status === "processing") {
      setStepIndex(0);
      setProgress(25);

      const t1 = setTimeout(() => {
        setStepIndex(1);
        setProgress(65);
      }, 700);

      const t2 = setTimeout(() => {
        setStepIndex(2);
        setProgress(95);
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (status === "success") {
      playCelebrationSound();
    }
  }, [status]);

  if (status === "idle") return null;

  const totalReceived = amount + bonusAmount;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden">
      
      {/* 01. HIỆU ỨNG PHÁO HOA GIẤY (CONFETTI BURST) KHI THÀNH CÔNG */}
      {status === "success" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(40)].map((_, i) => {
            const colors = [
              "bg-amber-400", "bg-rose-500", "bg-sky-400", 
              "bg-emerald-400", "bg-purple-500", "bg-yellow-300",
              "bg-pink-400", "bg-indigo-400"
            ];
            const color = colors[i % colors.length];
            const left = `${(i * 2.5) % 100}%`;
            const duration = `${1.8 + (i % 6) * 0.35}s`;
            const delay = `${(i % 12) * 0.1}s`;
            const size = i % 3 === 0 ? "w-3 h-4 rounded-xs" : i % 3 === 1 ? "w-2 h-2 rounded-full" : "w-1.5 h-3.5";

            return (
              <div
                key={i}
                className={`absolute top-0 ${color} ${size} opacity-90 animate-fall`}
                style={{
                  left,
                  animationDuration: duration,
                  animationDelay: delay,
                  transform: `rotate(${i * 28}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 02. HỘP THOẠI TRUNG TÂM */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#121D38] via-[#0E162A] to-[#070B14] border border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_70px_rgba(14,165,233,0.35)] text-center space-y-6 text-slate-100 animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Viền sáng trên cùng */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${
          status === "processing" 
            ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 animate-pulse" 
            : status === "error"
            ? "bg-gradient-to-r from-rose-500 via-red-600 to-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.8)]"
            : "bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
        }`} />

        {/* Nút đóng nhanh góc trên */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ===================== TRẠNG THÁI: ĐANG XỬ LÝ (PROCESSING) ===================== */}
        {status === "processing" && (
          <div className="space-y-6 py-4">
            {/* Holographic Radar / Cyber Spinner */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/40 animate-[spin_6s_linear_infinite]" />
              {/* Middle glowing ring */}
              <div className="absolute inset-2 rounded-full border-2 border-t-sky-400 border-r-transparent border-b-blue-600 border-l-transparent animate-[spin_1.5s_linear_infinite]" />
              {/* Inner fast ring */}
              <div className="absolute inset-5 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-transparent border-l-amber-400 animate-[spin_1s_linear_infinite_reverse]" />
              {/* Center icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/50 animate-pulse">
                <Zap className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                HỆ THỐNG XỬ LÝ TỰ ĐỘNG
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase pt-1">
                Đang Xử Lý Giao Dịch...
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Vui lòng không đóng trình duyệt. Hệ thống bot đang tiến hành kiểm tra và cộng tiền tức thì.
              </p>
            </div>

            {/* Thanh tiến trình Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Các bước xử lý động */}
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>
                  {stepIndex === 0 && "1/3: Kết nối cổng thanh toán an toàn..."}
                  {stepIndex === 1 && "2/3: Xác thực biên lai / mã thẻ qua hệ thống..."}
                  {stepIndex === 2 && "3/3: Đối soát số dư & chuẩn bị cộng tiền..."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TRẠNG THÁI: THÀNH CÔNG (SUCCESS CELEBRATION) ===================== */}
        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in-90 duration-300">
            
            {/* Huy hiệu Cúp Vàng Chúc Mừng Lớn */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              {/* Sóng chấn động lan tỏa (Shockwave ring) */}
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-pulse" />
              
              {/* Huy hiệu trung tâm */}
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-bounce">
                <PartyPopper className="w-10 h-10 fill-slate-950" />
              </div>

              {/* Ngôi sao lấp lánh xung quanh */}
              <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>

            {/* Tiêu đề chúc mừng */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>NẠP TIỀN THÀNH CÔNG</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase tracking-tight">
                CHÚC MỪNG BẠN!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {message}
              </p>
            </div>

            {/* Hộp Thống Kê Số Tiền Nhận & Khuyến Mãi */}
            <div className="p-4 rounded-2xl bg-[#080D1A]/95 border border-[#1E2D4A] shadow-inner space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Mệnh giá nạp:</span>
                <span className="font-bold text-slate-200 text-sm">{formatVND(amount)}</span>
              </div>

              {bonusAmount > 0 && (
                <div className="flex items-center justify-between text-amber-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Khuyến mãi nạp (+20%):</span>
                  </span>
                  <span className="font-bold text-amber-300 text-sm">+{formatVND(bonusAmount)}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-sans font-bold text-slate-300">
                  <img src="/money-vnd-sm.png" alt="VNĐ" className="w-7 h-auto object-contain drop-shadow" />
                  <span>Tổng cộng vào ví:</span>
                </div>
                <span className="text-lg sm:text-xl font-black text-emerald-400">
                  +{formatVND(totalReceived)}
                </span>
              </div>
            </div>

            {/* Cặp Nút Hành Động */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4 fill-slate-950" />
                <span>XEM VÍ CỦA TÔI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onGoToMarketplace) onGoToMarketplace();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>MUA ASSET NGAY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* ===================== TRẠNG THÁI: LỖI (ERROR) ===================== */}
        {status === "error" && (
          <div className="space-y-6 animate-in zoom-in-90 duration-300 py-2">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">
                Giao Dịch Thất Bại
              </h3>
              <p className="text-xs text-rose-300 max-w-sm mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              Đóng và kiểm tra lại
            </button>
          </div>
        )}

      </div>

      {/* Animation rơi pháo hoa giấy CSS */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards infinite;
        }
      `}</style>
    </div>
  );
}

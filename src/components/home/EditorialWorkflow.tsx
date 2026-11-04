"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, QrCode, Download, ShieldCheck, Terminal, 
  CheckCircle2, ArrowRight, Sparkles, Layers, Cpu 
} from "lucide-react";
import ScrollReveal from "../motion/ScrollReveal";
import TextReveal from "../motion/TextReveal";

export default function EditorialWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: "01",
      badge: "KIỂM TRA CHẤT LƯỢNG",
      title: "Tuyển Chọn & Soi Mã Nguồn Luau",
      desc: "Mọi sản phẩm từ súng ACS đến DataStore đều được kiểm định bằng Luau strict typechecking, không chứa backdoor ẩn, tối ưu số lượng Part và draw calls để đảm bảo 60 FPS mượt mà.",
      icon: Code2,
      accentColor: "sky",
      preview: {
        title: "ACS_Framework_v2.5.luau",
        codeSnippet: `--!strict
local ACS_Engine = {}
ACS_Engine.__index = ACS_Engine

function ACS_Engine.Init(player: Player, config: WeaponConfig)
    assert(player and player.Character, "Invalid Player Instance")
    local GunModel = config.Model:Clone()
    GunModel.Parent = player.Character
    return setmetatable({ Owner = player, FPS = 60 }, ACS_Engine)
end`,
      },
    },
    {
      stepNumber: "02",
      badge: "THANH TOÁN TỰ ĐỘNG",
      title: "Quét VietQR Hoặc Thẻ Cào 1:1 (+20%)",
      desc: "Nạp tiền tự động 24/7 tức thì sau 3 giây qua mã Napas 247 VietQR hoặc nạp thẻ cào Viettel/Vina/Mobi tỷ lệ 1:1 không mất phí chiết khấu. Luôn tặng kèm +20% khuyến mãi vĩnh viễn.",
      icon: QrCode,
      accentColor: "amber",
      preview: {
        title: "VietQR_AutoSettle_Transaction",
        codeSnippet: `>> Giao dịch: RBXDEP829104
>> Ngân hàng: MBBank (Napas 247)
>> Số tiền nạp: 200.000 VNĐ
>> Khuyến mãi cộng thêm: +40.000 VNĐ (+20%)
>> Tổng số dư ví nhận được: 240.000 VNĐ
>> Trạng thái máy chủ: ĐÃ DUYỆT TỨC THÌ (3.2s)`,
      },
    },
    {
      stepNumber: "03",
      badge: "PHÂN PHỐI FILE GỐC",
      title: "Tải File .RBXM & Nhập Vào Roblox Studio",
      desc: "Nhận file cài đặt nguyên bản không mã hóa kèm giấy phép bản quyền vĩnh viễn. Hỗ trợ kỹ thuật trực tiếp qua Zalo & Ultraview nếu bạn cần trợ giúp cài đặt vào game.",
      icon: Download,
      accentColor: "emerald",
      preview: {
        title: "Roblox_Studio_Integration.txt",
        codeSnippet: `1. Kéo thả file .rbxm vào Explorer của Studio.
2. ServerScriptService <- Chứa logic server chống hack.
3. ReplicatedStorage <- Chứa Assets & RemoteEvents.
4. StarterPlayerScripts <- Chứa UI & Client Cam.
>> Nhấn F5 để trải nghiệm ngay lập tức!`,
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <section className="py-12 select-none">
      
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-10">
        <ScrollReveal>
          <span className="px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            QUY TRÌNH CHUẨN HOÁ STUDIO
          </span>
        </ScrollReveal>

        <TextReveal
          as="h2"
          text="TRẢI NGHIỆM MUA & SỬ DỤNG MINH BẠCH"
          className="justify-center text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
        />

        <ScrollReveal delay={0.15}>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Quy trình khép kín tối ưu cho lập trình viên từ lúc xem trước mã nguồn đến khi cài đặt thành công vào dự án Roblox.
          </p>
        </ScrollReveal>
      </div>

      {/* Interactive Workflow Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Interactive Pipeline (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            const Icon = st.icon;

            return (
              <ScrollReveal key={st.stepNumber} delay={idx * 0.1}>
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? "bg-white dark:bg-[#111A2E] border-sky-400/80 dark:border-sky-400 shadow-xl shadow-sky-500/10 scale-[1.01]"
                      : "bg-slate-50/70 dark:bg-[#0B111E]/80 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                  data-cursor="pointer"
                >
                  {/* Subtle active left indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkflowBar"
                      className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-blue-600"
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all font-mono font-black text-xs ${
                        isActive
                          ? "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {st.stepNumber}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                          {st.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Right Active Terminal / Code Inspector Preview (lg:col-span-7) */}
        <ScrollReveal delay={0.2} className="lg:col-span-7">
          <div className="h-full rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-slate-100 font-mono">
            
            {/* Top Terminal Chrome */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  terminal://tkshop/{current.preview.title}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-sky-400 font-bold uppercase">
                Step {current.stepNumber}/03
              </span>
            </div>

            {/* Code / Transaction Output */}
            <div className="py-6 flex-1 text-xs sm:text-[13px] leading-relaxed text-sky-200/90 overflow-x-auto whitespace-pre font-mono">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  {current.preview.codeSnippet}
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* Bottom Verification Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã kiểm định hoạt động thực tế trên Roblox Studio mới nhất</span>
              </div>
              <Link
                href="/marketplace"
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 group"
              >
                <span>Xem kho asset</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </ScrollReveal>

      </div>

    </section>
  );
}

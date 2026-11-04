"use client";

import React from "react";
import { ShieldCheck, Cpu, Zap, QrCode, Terminal, Layers } from "lucide-react";

export default function TelemetryBar() {
  return (
    <div className="w-full border-y border-[#1E2536] bg-[#0A0D15]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">100% FE VERIFIED</span>
              <span className="text-[#8E98A8] text-[10px]">FilteringEnabled Chuẩn</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-light">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">PURE LUAU TYPING</span>
              <span className="text-[#8E98A8] text-[10px]">Type Safety Không Lag</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">VIETQR AUTO-SETTLE</span>
              <span className="text-[#8E98A8] text-[10px]">Cộng Ví Trong 30 Giây</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">DIRECT .RBXM INGEST</span>
              <span className="text-[#8E98A8] text-[10px]">Insert From File 1-Click</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

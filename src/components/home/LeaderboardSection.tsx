"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Crown, Flame, CheckCircle2, ShieldCheck, Wallet, ShoppingBag } from "lucide-react";
import { formatVND } from "@/lib/utils";

interface TopUser {
  rank: number;
  maskedName: string;
  totalAmount: number;
  prize: string;
  badge: string;
}

interface ActivityItem {
  type: "ORDER" | "DEPOSIT";
  maskedUser: string;
  title: string;
  amount: number;
  timeAgo: string;
}

export default function LeaderboardSection() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [cycleTitle, setCycleTitle] = useState("ĐUA TOP NẠP T11");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/public/activities");
        const data = await res.json();
        if (data.success) {
          setTopUsers(data.topDepositors || []);
          setActivities(data.recentActivities || []);
          if (data.cycleTitle) setCycleTitle(data.cycleTitle);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, []);

  const top1 = topUsers[0] || { rank: 1, maskedName: "trung****025", totalAmount: 3850000, prize: "Cúp Vàng + 350k", badge: "TOP 1" };
  const top2 = topUsers[1] || { rank: 2, maskedName: "roblox****888", totalAmount: 2400000, prize: "Cúp Bạc + 200k", badge: "TOP 2" };
  const top3 = topUsers[2] || { rank: 3, maskedName: "dev_acs****99", totalAmount: 1750000, prize: "Cúp Đồng + 150k", badge: "TOP 3" };
  const rest = topUsers.slice(3, 7);

  return (
    <section className="bg-white/95 dark:bg-[#0D1528]/95 rounded-2xl border border-slate-200/80 dark:border-sky-500/20 shadow-sm dark:shadow-xl backdrop-blur-md text-slate-900 dark:text-white overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 flex-shrink-0 animate-bounce">
            <Trophy className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-[9px] font-mono font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Flame className="w-2.5 h-2.5 fill-current animate-pulse" />
                Sự Kiện
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Live 24/7
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-amber-300 tracking-tight leading-tight mt-0.5 uppercase">
              {cycleTitle}
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[9px] font-mono text-slate-400">Kỳ tháng 11</p>
          <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 font-mono">Còn 29 ngày</p>
        </div>
      </div>

      {/* ── PODIUM TOP 3 ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2 items-end">

          {/* TOP 2 */}
          <div className="rounded-xl bg-slate-100 dark:bg-[#131F38] border border-slate-300/60 dark:border-slate-600/30 p-2.5 text-center flex flex-col items-center gap-0.5 shadow-sm">
            <span className="text-lg leading-none">🥈</span>
            <span className="text-[9px] font-black font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">TOP 2</span>
            <span className="text-[10px] font-black text-slate-800 dark:text-white font-mono truncate max-w-full">{top2.maskedName}</span>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 font-mono">{formatVND(top2.totalAmount)}</span>
            <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded-full mt-0.5">+200k</span>
          </div>

          {/* TOP 1 — cao hơn */}
          <div className="relative rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/80 dark:from-[#1E1608] dark:to-[#110F05] border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] p-3 text-center flex flex-col items-center gap-0.5 -translate-y-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center shadow animate-bounce">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xl leading-none mt-1">🥇</span>
            <span className="text-[9px] font-black font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest">TOP 1</span>
            <span className="text-[11px] font-black text-slate-900 dark:text-amber-200 font-mono truncate max-w-full">{top1.maskedName}</span>
            <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 font-mono">{formatVND(top1.totalAmount)}</span>
            <span className="text-[8px] font-black text-amber-950 bg-amber-300 dark:bg-amber-400 px-2 py-0.5 rounded-full mt-0.5">🏆 +350k</span>
          </div>

          {/* TOP 3 */}
          <div className="rounded-xl bg-orange-50 dark:bg-[#1A1410] border border-orange-300/60 dark:border-orange-600/25 p-2.5 text-center flex flex-col items-center gap-0.5 shadow-sm">
            <span className="text-lg leading-none">🥉</span>
            <span className="text-[9px] font-black font-mono text-orange-600 dark:text-orange-400 uppercase tracking-wider mt-0.5">TOP 3</span>
            <span className="text-[10px] font-black text-slate-800 dark:text-white font-mono truncate max-w-full">{top3.maskedName}</span>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 font-mono">{formatVND(top3.totalAmount)}</span>
            <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded-full mt-0.5">+150k</span>
          </div>

        </div>
      </div>

      {/* ── TOP 4-7 LIST ── */}
      {rest.length > 0 && (
        <div className="px-4 pb-3">
          <div className="rounded-xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/70 dark:border-slate-800 divide-y divide-slate-200/60 dark:divide-slate-800 overflow-hidden">
            {rest.map((u) => (
              <div key={u.rank} className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#101828] transition-colors text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[9px] flex items-center justify-center font-mono flex-shrink-0">
                    {u.rank}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">{u.maskedName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">{formatVND(u.totalAmount)}</span>
                  <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">+50k</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIVE FEED (compact) ── */}
      <div className="border-t border-slate-200 dark:border-slate-800/80">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Giao dịch vừa xảy ra</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Live</span>
        </div>

        <div className="px-4 pb-3 space-y-1.5 max-h-[160px] overflow-y-auto">
          {activities.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#090E1A] border border-slate-200/60 dark:border-slate-800 hover:border-sky-500/30 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.type === "DEPOSIT"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-sky-500/15 text-sky-500"
                }`}>
                  {item.type === "DEPOSIT" ? <Wallet className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200 font-mono truncate block">{item.maskedUser}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate block">{item.title}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono">+{formatVND(item.amount)}</div>
                <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-[#060A12]/50">
        <span className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          Bảo mật ID & Watermark chống leak
        </span>
        <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400">100% Tự động</span>
      </div>

    </section>
  );
}

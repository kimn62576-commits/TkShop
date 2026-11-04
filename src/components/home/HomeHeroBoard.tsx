"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, Clock, Trophy, Flame, Zap, ShieldCheck, 
  ArrowRight, PhoneCall, Gift, CheckCircle2, Crown, Medal, Wallet, ShoppingBag 
} from "lucide-react";
import { formatVND } from "@/lib/utils";

interface ActivityItem {
  type: "ORDER" | "DEPOSIT";
  maskedUser: string;
  title: string;
  amount: number;
  timeAgo: string;
}

interface TopUser {
  rank: number;
  maskedName: string;
  totalAmount: number;
  prize: string;
  badge: string;
}

export default function HomeHeroBoard() {
  const [activeTab, setActiveTab] = useState<"news" | "recent" | "leaderboard">("news");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    fetch("/api/public/activities")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.recentActivities) setActivities(data.recentActivities);
          if (data.topDepositors) setTopUsers(data.topDepositors);
        }
      })
      .catch((e) => console.error("Lỗi tải activities:", e));
  }, []);

  const defaultActivities: ActivityItem[] = [
    { type: "ORDER", maskedUser: "dev_roblox****", title: "ACS Combat v2.5", amount: 120000, timeAgo: "1 phút trước" },
    { type: "DEPOSIT", maskedUser: "trung****025", title: "Nạp VietQR +20%", amount: 200000, timeAgo: "3 phút trước" },
    { type: "ORDER", maskedUser: "user_098****321", title: "OmniSave DataStore", amount: 80000, timeAgo: "5 phút trước" },
    { type: "DEPOSIT", maskedUser: "phuong****2k", title: "Nạp thẻ Viettel", amount: 100000, timeAgo: "9 phút trước" },
    { type: "ORDER", maskedUser: "gamer_viet****", title: "Valhalla RPG Inventory", amount: 290000, timeAgo: "14 phút trước" },
  ];

  const displayActivities = activities.length > 0 ? activities.slice(0, 5) : defaultActivities;

  return (
    <div className="space-y-6">
      
      {/* 01. BANNER CHÍNH KHỔ RỘNG ĐẦU TRANG */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 group bg-slate-950">
        <Link href="/marketplace" className="block relative w-full overflow-hidden">
          <img
            src="/tkshop-hero-banner.png"
            alt="TKSHOP.VN - Model Roblox Chất Lượng Cao"
            className="w-full h-auto object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
          {/* Subtle glossy border */}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </Link>
      </div>

      {/* 02. HÀNG THÔNG TIN HERO: BẢNG TIN TỨC & 3 THẺ TÍNH NĂNG NHANH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Cột Trái (lg:col-span-7): 3 Thẻ Tính Năng Nhanh */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
          
          {/* Thẻ 1: Hotline Hỗ Trợ (Xanh Lá) */}
          <div className="bg-white/95 dark:bg-[#0E172A]/90 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HOTLINE HỖ TRỢ KỸ THUẬT</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">0394.063.917</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Nguyễn Trọng Khang — Hỗ trợ cài đặt Studio qua Ultraview</span>
                </div>
              </div>
            </div>
            <a 
              href="https://zalo.me/0394063917" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform p-2"
            >
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Thẻ 2: Thời Gian Làm Việc (Xanh Tím) */}
          <div className="bg-white/95 dark:bg-[#0E172A]/90 rounded-2xl p-4 sm:p-5 border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">THỜI GIAN LÀM VIỆC</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">Tự động 24/24</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Tất cả các ngày trong tuần, mua xong nhận file tải ngay lập tức</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Thẻ 3: Ưu Đãi Nạp Tiền (Màu Cam) */}
          <div className="bg-white/95 dark:bg-[#0E172A]/90 rounded-2xl p-4 sm:p-5 border border-amber-200/80 dark:border-amber-500/30 shadow-xs hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ƯU ĐÃI NẠP TIỀN</div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">VietQR / MoMo +10% Đến +20%</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Nạp 100.000đ nhận thêm số dư — Tỷ lệ thẻ cào 1:1 không chiết khấu</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>

        </div>

        {/* Cột Phải (lg:col-span-5): Bảng Thông Báo / BXH Đua Top / Vừa Mua & Nạp */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-[#0E172A]/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            {/* Tabs Navigation: 3 Mục Tinh Gọn */}
            <div className="grid grid-cols-3 gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("news")}
                className={`py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeTab === "news"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Bell className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Thông Báo</span>
              </button>

              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Trophy className="w-3 h-3 flex-shrink-0 text-amber-400 fill-current" />
                <span className="truncate">Đua Top Nạp</span>
              </button>

              <button
                onClick={() => setActiveTab("recent")}
                className={`py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeTab === "recent"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Vừa Mua & Nạp</span>
              </button>
            </div>

            {/* Tab 1: Tin Tức */}
            {activeTab === "news" && (
              <div className="py-3 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🔥</span>
                  <p className="leading-snug">
                    <strong className="text-slate-900 dark:text-white font-bold">Nạp tiền & Tải asset tự động 24/7</strong>: Hệ thống xử lý tự động hoàn toàn không cần chờ đợi.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">🍀</span>
                  <p className="leading-snug">
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Nạp VietQR / MoMo</strong>: Tặng thêm <strong>10% - 20% khuyến mại</strong> vào tài khoản ví.
                  </p>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-2" />

                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">☎️</span>
                  <p className="leading-snug">
                    Zalo hỗ trợ kỹ thuật: <strong className="text-blue-600 dark:text-sky-400 font-mono font-bold">0394.063.917</strong> (Hỗ trợ 24/7).
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">🛡️</span>
                  <p className="leading-snug">
                    <strong className="text-rose-600 dark:text-rose-400 font-bold">Cam kết không leak file</strong>: File tải về có mã hóa ID người mua. Nghiêm cấm chia sẻ ngoài shop.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">📦</span>
                  <p className="leading-snug">
                    Cần tìm model theo yêu cầu? Nhắn tin Zalo để được hỗ trợ trích xuất nhanh nhất!
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Bảng Xếp Hạng Đua Top Nạp (Top 1, 2, 3) */}
            {activeTab === "leaderboard" && (
              <div className="py-3 space-y-2 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-500 dark:text-amber-400 font-bold px-1">
                  <span>🏆 KỲ ĐUA THÁNG 11</span>
                  <span>TỔNG THƯỞNG 600K</span>
                </div>

                <div className="space-y-1.5 font-mono">
                  {/* Top 1 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">1</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {topUsers[0]?.maskedName || "trung****025"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-amber-600 dark:text-amber-400">
                        {formatVND(topUsers[0]?.totalAmount || 3850000)}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">
                        {topUsers[0]?.prize || "Cúp Vàng + 350k"}
                      </div>
                    </div>
                  </div>

                  {/* Top 2 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white font-black text-[10px] flex items-center justify-center">2</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                        {topUsers[1]?.maskedName || "roblox****888"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 dark:text-sky-400">
                        {formatVND(topUsers[1]?.totalAmount || 2400000)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                        {topUsers[1]?.prize || "Cúp Bạc + 200k"}
                      </div>
                    </div>
                  </div>

                  {/* Top 3 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-700/60 text-amber-200 font-black text-[10px] flex items-center justify-center">3</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                        {topUsers[2]?.maskedName || "dev_acs****99"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 dark:text-sky-400">
                        {formatVND(topUsers[2]?.totalAmount || 1750000)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                        {topUsers[2]?.prize || "Cúp Đồng + 150k"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <a 
                    href="#bxh-nap" 
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xem Bảng Vinh Danh Chi Tiết</span>
                    <span>↓</span>
                  </a>
                </div>
              </div>
            )}

            {/* Tab 3: Lịch Sử Vừa Mua & Nạp (Được Che Tên User Bảo Mật) */}
            {activeTab === "recent" && (
              <div className="py-2.5 space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono animate-in fade-in duration-150">
                {displayActivities.map((act, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 truncate pr-2">
                      {act.type === "DEPOSIT" ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/30 flex-shrink-0">
                          NẠP
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex-shrink-0">
                          MUA
                        </span>
                      )}
                      <span className="truncate max-w-[130px] text-slate-900 dark:text-white font-bold">
                        {act.maskedUser}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`font-bold text-[11px] truncate max-w-[140px] ${act.type === "DEPOSIT" ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"}`}>
                        {act.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {act.timeAgo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nút Liên Hệ Nhanh Ở Đáy Card */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Hỗ trợ kỹ thuật qua Zalo:</span>
            <a
              href="https://zalo.me/0394063917"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-sky-400 font-bold hover:underline"
            >
              Chat Zalo Ngay →
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

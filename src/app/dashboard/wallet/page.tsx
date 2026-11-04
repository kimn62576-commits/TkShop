"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, 
  Clock, ShieldCheck, QrCode, FileText, Sparkles 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";
import DepositModal from "@/components/wallet/DepositModal";

export default function WalletPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setUserData(data.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const wallet = userData?.wallet;
  const transactions = wallet?.transactions || [];

  const filteredTransactions = transactions.filter((tx: any) => {
    if (filterType === "ALL") return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-8">
      
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
            Ví Tiền & Lịch Sử Giao Dịch
          </h1>
          <p className="text-xs text-[#929BAA] mt-1">
            Quản lý số dư, nạp tiền tự động qua VietQR và theo dõi biến động số dư tức thì.
          </p>
        </div>
        <button
          onClick={() => setDepositModalOpen(true)}
          className="relative overflow-hidden group px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center gap-2 self-start sm:self-auto cursor-pointer active:scale-95 border border-amber-300"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>Nạp Tiền Vào Ví (+20%)</span>
        </button>
      </div>

      {/* Thẻ Chỉ Số Tài Chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Số Dư Khả Dụng</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-[#38BDF8]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#F1F3F6] font-mono">
            {formatVND(wallet?.balance || 0)}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono block">Sử dụng mua ngay không giới hạn</span>
        </div>

        <div className="p-5 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Tổng Tiền Đã Nạp</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#F1F3F6] font-mono">
            {formatVND(wallet?.totalDeposited || 0)}
          </p>
          <span className="text-[11px] text-[#626D7D] font-mono block">Qua cổng chuyển khoản VietQR tự động</span>
        </div>

        <div className="p-5 rounded-lg bg-[#162036] border border-[#263554] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929BAA] uppercase">Tổng Tiền Đã Chi</span>
            <div className="w-7 h-7 rounded bg-[#1E2B48] border border-[#263554] flex items-center justify-center text-amber-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#F1F3F6] font-mono">
            {formatVND(wallet?.totalSpent || 0)}
          </p>
          <span className="text-[11px] text-[#626D7D] font-mono block">Thanh toán các bản quyền tài nguyên</span>
        </div>

      </div>

      {/* Bảng Lịch Sử Biến Động Số Dư */}
      <div className="bg-[#162036] border border-[#263554] rounded-lg p-5 sm:p-6 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263554] pb-4">
          <div>
            <h3 className="font-semibold text-xs text-[#F1F3F6] uppercase tracking-wider">
              Biến Động Số Dư & Giao Dịch
            </h3>
            <p className="text-xs text-[#929BAA] mt-0.5">
              Toàn bộ lịch sử nạp tiền, chi tiêu và hoàn tiền tài khoản
            </p>
          </div>

          {/* Bộ Lọc Theo Loại Giao Dịch */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              { val: "ALL", label: "Tất cả" },
              { val: "DEPOSIT", label: "Nạp tiền" },
              { val: "PURCHASE", label: "Mua hàng" },
              { val: "REFUND", label: "Hoàn tiền" },
              { val: "ADMIN_ADJUSTMENT", label: "Điều chỉnh" },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilterType(f.val)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  filterType === f.val
                    ? "bg-[#1E2B48] text-[#F1F3F6] font-medium border border-[#263554]"
                    : "bg-[#0B111E] text-[#929BAA] hover:text-white border border-[#263554]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bảng Dữ Liệu */}
        {loading ? (
          <div className="text-xs font-mono text-[#929BAA] py-6">Đang tải lịch sử giao dịch...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#929BAA]">
            Không có giao dịch nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B111E] text-[#929BAA] uppercase font-mono text-[11px] border-b border-[#263554]">
                <tr>
                  <th className="px-4 py-2.5">Thời gian</th>
                  <th className="px-4 py-2.5">Loại</th>
                  <th className="px-4 py-2.5">Mô tả</th>
                  <th className="px-4 py-2.5">Số tiền</th>
                  <th className="px-4 py-2.5">Số dư sau</th>
                  <th className="px-4 py-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263554]">
                {filteredTransactions.map((tx: any) => {
                  const isCredit = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-[#1E2B48]/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-[#929BAA] whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          tx.type === "DEPOSIT"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : tx.type === "PURCHASE"
                            ? "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"
                            : tx.type === "REFUND"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {tx.type === "DEPOSIT" ? "NẠP TIỀN" : tx.type === "PURCHASE" ? "MUA HÀNG" : tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#F1F3F6] max-w-xs truncate">
                        {tx.description}
                        {tx.referenceId && (
                          <span className="block text-[10px] text-[#626D7D] font-mono mt-0.5">
                            Mã: {tx.referenceId}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold">
                        <span className={isCredit ? "text-emerald-400" : "text-[#F1F3F6]"}>
                          {isCredit ? `+${formatVND(tx.amount)}` : formatVND(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[#929BAA]">
                        {formatVND(tx.balanceAfter)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Thành công
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal Nạp Tiền VietQR */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={() => {
          fetchUserData();
          setDepositModalOpen(false);
        }}
      />

    </div>
  );
}

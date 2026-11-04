"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Plus, Minus, Search, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";
import { formatVND } from "@/lib/utils";

export default function AdminWalletPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [type, setType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [amount, setAmount] = useState<number>(50000);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      if (data.users?.length > 0 && !selectedUserId) {
        setSelectedUserId(data.users[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount || !reason.trim()) return;

    if (!confirm(`Xác nhận ${type === "CREDIT" ? "CỘNG" : "TRỪ"} ${formatVND(amount)} cho tài khoản ${selectedUser?.email}?`)) {
      return;
    }

    setProcessing(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          type,
          amount,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(`Thành công! Số dư mới: ${formatVND(data.newBalance)}`);
      setReason("");
      fetchUsers();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Điều Chỉnh Số Dư Ví Thủ Công</h1>
        <p className="text-xs text-dark-muted mt-1">
          Cộng tiền khuyến mãi hoặc khấu trừ số dư của người dùng. Mọi thao tác được lưu vết trong Nhật ký kiểm toán.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleAdjust} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5 text-xs">
        
        <div>
          <label className="block font-semibold text-dark-text mb-1.5">CHỌN TÀI KHOẢN NGƯỜI DÙNG</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName} ({u.email}) — Số dư: {formatVND(u.walletBalance)}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex justify-between items-center">
            <span className="text-dark-muted">Số dư hiện tại của tài khoản:</span>
            <strong className="text-white font-mono text-sm">{formatVND(selectedUser.walletBalance)}</strong>
          </div>
        )}

        <div>
          <label className="block font-semibold text-dark-text mb-1.5">LOẠI ĐIỀU CHỈNH</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("CREDIT")}
              className={`py-2 px-3 rounded-xl font-bold text-center border transition-all flex items-center justify-center gap-2 ${
                type === "CREDIT"
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-dark-bg text-dark-muted border-dark-border"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Cộng Tiền (Credit)</span>
            </button>
            <button
              type="button"
              onClick={() => setType("DEBIT")}
              className={`py-2 px-3 rounded-xl font-bold text-center border transition-all flex items-center justify-center gap-2 ${
                type === "DEBIT"
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-dark-bg text-dark-muted border-dark-border"
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Khấu Trừ (Debit)</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-dark-text mb-1.5">SỐ TIỀN ĐIỀU CHỈNH (VND)</label>
          <input
            type="number"
            step="10000"
            min="1000"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-dark-text mb-1.5">LÝ DO ĐIỀU CHỈNH (BẮT BUỘC)</label>
          <textarea
            rows={3}
            required
            placeholder="Ví dụ: Tặng quà tri ân sự kiện Developer 2026, bù trừ giao dịch lỗi ngân hàng..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Xác Nhận Điều Chỉnh Ví</span>}
        </button>

      </form>

    </div>
  );
}

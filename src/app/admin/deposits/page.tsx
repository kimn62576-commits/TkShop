"use client";

import React, { useState, useEffect } from "react";
import { 
  QrCode, Check, X, RefreshCw, AlertCircle, 
  Search, CheckCircle2, ShieldCheck 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/deposits?status=${statusFilter}`);
      const data = await res.json();
      setDeposits(data.deposits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (depositId: string, action: "APPROVE" | "REJECT") => {
    const promptMsg = action === "APPROVE"
      ? "Bạn có chắc chắn muốn duyệt và cộng tiền vào ví cho giao dịch này?"
      : "Bạn có chắc chắn muốn từ chối yêu cầu nạp tiền này?";
    if (!confirm(promptMsg)) return;

    setProcessingId(depositId);
    try {
      const res = await fetch("/api/admin/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositId,
          action,
          notes: action === "APPROVE" ? "Xác nhận duyệt thủ công bởi Admin" : "Từ chối thủ công",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(data.message || "Thao tác thành công!");
      fetchDeposits();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Giao Dịch Nạp Tiền VietQR</h1>
          <p className="text-xs text-dark-muted mt-1">
            Theo dõi danh sách nạp tiền tự động qua webhook hoặc phê duyệt thủ công cho khách hàng.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { val: "ALL", label: "Tất cả" },
            { val: "PENDING", label: "Chờ duyệt" },
            { val: "COMPLETED", label: "Đã nạp" },
            { val: "FAILED", label: "Thất bại" },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setStatusFilter(f.val)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === f.val
                  ? "bg-brand-primary text-white"
                  : "bg-dark-card text-dark-muted hover:text-white border border-dark-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh sách nạp tiền...</div>
        ) : deposits.length === 0 ? (
          <div className="p-12 text-center text-xs text-dark-muted">
            Không có giao dịch nạp tiền nào trong bộ lọc này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Mã giao dịch</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Nội dung CK</th>
                  <th className="px-4 py-3">Thời gian tạo</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {deposits.map((d) => (
                  <tr key={d.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-light whitespace-nowrap">
                      {d.transactionCode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-white block">{d.user?.profile?.displayName || "N/A"}</span>
                      <span className="text-[10px] text-dark-muted">{d.user?.email}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-green-400 whitespace-nowrap">
                      +{formatVND(d.amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-yellow-400 whitespace-nowrap">
                      {d.transferContent}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : d.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {d.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={processingId === d.id}
                            onClick={() => handleAction(d.id, "APPROVE")}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Duyệt</span>
                          </button>
                          <button
                            disabled={processingId === d.id}
                            onClick={() => handleAction(d.id, "REJECT")}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            <span>Từ chối</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-dark-muted">{d.adminNotes || "Tự động"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Search, Shield, Ban, CheckCircle, 
  Wallet, ShoppingBag, X, RefreshCw 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Edit role / ban modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("USER");
  const [targetBanned, setTargetBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (u: any) => {
    setSelectedUser(u);
    setTargetRole(u.role);
    setTargetBanned(u.isBanned);
    setBanReason(u.banReason || "");
    setEditModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: targetRole,
          isBanned: targetBanned,
          banReason: targetBanned ? banReason : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditModalOpen(false);
      fetchUsers();
      alert("Cập nhật quyền và trạng thái thành công!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Người Dùng & Phân Quyền (RBAC)</h1>
          <p className="text-xs text-dark-muted mt-1">
            Xem danh sách lập trình viên, số dư ví, đơn hàng và quản lý khóa/mở khóa tài khoản.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Tìm theo email, tên, roblox..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh sách người dùng...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Roblox Username</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Số dư ví</th>
                  <th className="px-4 py-3">Đơn hàng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/20 text-brand-light flex items-center justify-center font-bold text-xs">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.displayName}</p>
                          <span className="text-[10px] text-dark-muted">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {u.robloxUsername || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : u.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-brand-primary/10 text-brand-light border border-brand-primary/20"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                      {formatVND(u.walletBalance)}
                    </td>
                    <td className="px-4 py-3 text-dark-muted whitespace-nowrap">
                      {u.totalOrders} đơn
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.isBanned ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="px-2.5 py-1 bg-dark-bg hover:bg-dark-border text-dark-text border border-dark-border rounded-lg text-xs font-semibold transition-colors"
                      >
                        Quản lý
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role / Ban Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">Quản Lý Quyền & Trạng Thái</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-white font-bold">{selectedUser.displayName}</p>
              <p className="text-dark-muted">{selectedUser.email}</p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-text mb-1">VAI TRÒ (ROLE)</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                >
                  <option value="USER">USER (Khách hàng / Developer)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên sản phẩm & đơn hàng)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Toàn quyền)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-dark-border space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                  <input
                    type="checkbox"
                    checked={targetBanned}
                    onChange={(e) => setTargetBanned(e.target.checked)}
                    className="rounded bg-dark-bg border-dark-border"
                  />
                  <span>Khóa tài khoản này (Ban User)</span>
                </label>

                {targetBanned && (
                  <div>
                    <label className="block font-semibold text-dark-text mb-1">LÝ DO KHÓA TÀI KHOẢN</label>
                    <input
                      type="text"
                      placeholder="Lý do vi phạm điều khoản..."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-dark-bg hover:bg-dark-border text-white rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg shadow-glow"
                >
                  {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

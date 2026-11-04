"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [targetStatus, setTargetStatus] = useState("IN_PROGRESS");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.tickets?.length > 0 && !activeTicket) {
        setActiveTicket(data.tickets[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    setSending(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          message: replyMessage.trim() || undefined,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveTicket(data.ticket);
      setReplyMessage("");
      fetchTickets();
      alert("Đã cập nhật phản hồi ticket!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Yêu Cầu Hỗ Trợ (Tickets)</h1>
        <p className="text-xs text-dark-muted mt-1">
          Hỗ trợ khách hàng về kỹ thuật cài đặt Roblox Studio, mã nguồn Luau và đơn hàng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tickets List */}
        <div className="lg:col-span-5 bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-dark-border pb-3">
            Tất Cả Yêu Cầu ({tickets.length})
          </h3>

          {loading ? (
            <div className="text-xs text-dark-muted py-6">Đang tải tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-xs text-dark-muted py-10 text-center">Chưa có ticket nào.</div>
          ) : (
            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTicket(t);
                    setTargetStatus(t.status);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    activeTicket?.id === t.id
                      ? "bg-dark-bg border-brand-primary shadow-glow"
                      : "bg-dark-bg/60 border-dark-border hover:border-dark-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-brand-light font-bold">{t.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === "OPEN"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : t.status === "RESOLVED"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-dark-muted mt-2">
                    <span>{t.user?.email}</span>
                    <span>{formatDate(t.updatedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thread View & Reply */}
        <div className="lg:col-span-7 bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between min-h-[550px]">
          {activeTicket ? (
            <div className="flex flex-col h-full space-y-4">
              
              {/* Header */}
              <div className="border-b border-dark-border pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-light">{activeTicket.ticketNumber}</span>
                    <span className="text-xs text-dark-muted">Khách hàng: {activeTicket.user?.email}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{activeTicket.subject}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-dark-muted">Trạng thái:</span>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="px-2.5 py-1 bg-dark-bg border border-dark-border rounded-lg text-xs font-bold text-white"
                  >
                    <option value="OPEN">OPEN (Đang mở)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Đang xử lý)</option>
                    <option value="RESOLVED">RESOLVED (Đã giải quyết)</option>
                    <option value="CLOSED">CLOSED (Đóng ticket)</option>
                  </select>
                </div>
              </div>

              {/* Thread */}
              <div className="flex-1 space-y-4 overflow-y-auto p-2">
                {activeTicket.messages?.map((m: any) => {
                  const isAdmin = m.senderRole === "ADMIN" || m.senderRole === "SUPER_ADMIN";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-dark-muted mb-1">
                        <span className="font-bold text-white">{m.senderName}</span>
                        {isAdmin && <span className="text-brand-primary font-bold">(Admin)</span>}
                        <span>{formatDate(m.createdAt)}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                        isAdmin
                          ? "bg-brand-primary/20 border border-brand-primary/30 text-white rounded-tr-none"
                          : "bg-dark-bg border border-dark-border text-dark-text rounded-tl-none"
                      }`}>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-dark-border space-y-3">
                <textarea
                  rows={3}
                  placeholder="Nhập nội dung phản hồi chính thức cho khách hàng..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-glow disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? "Đang gửi..." : "Gửi Phản Hồi & Cập Nhật"}</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="text-center py-24 text-xs text-dark-muted">
              Chọn một yêu cầu hỗ trợ bên trái để xem cuộc trò chuyện.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

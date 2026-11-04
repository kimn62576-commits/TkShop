"use client";

import React, { useState, useEffect } from "react";
import { 
  HelpCircle, MessageSquare, Send, Plus, Clock, 
  CheckCircle2, AlertCircle, RefreshCw, X 
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // New ticket modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("TECHNICAL");
  const [newPriority, setNewPriority] = useState("NORMAL");
  const [newMessage, setNewMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory,
          priority: newPriority,
          message: newMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreateModalOpen(false);
      setNewSubject("");
      setNewMessage("");
      fetchTickets();
    } catch (err: any) {
      setError(err.message || "Lỗi tạo ticket");
    } finally {
      setCreating(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;
    setSendingReply(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          message: replyMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveTicket(data.ticket);
      setReplyMessage("");
      fetchTickets();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trung Tâm Hỗ Trợ Kỹ Thuật</h1>
          <p className="text-xs text-dark-muted mt-1">
            Gặp sự cố khi cài đặt asset, lỗi script hoặc vấn đề thanh toán? Hãy tạo ticket để được hỗ trợ trực tiếp.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Yêu Cầu Hỗ Trợ Mới</span>
        </button>
      </div>

      {/* Main Grid: Tickets list + Thread view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tickets List (5 cols) */}
        <div className="lg:col-span-5 bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-dark-border pb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span>Danh Sách Yêu Cầu Của Bạn ({tickets.length})</span>
          </h3>

          {loading ? (
            <div className="text-xs text-dark-muted py-6">Đang tải danh sách ticket...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-xs text-dark-muted space-y-2">
              <p>Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-brand-primary font-bold hover:underline"
              >
                + Bấm vào đây để tạo ticket đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
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
                    <span>{t.category}</span>
                    <span>{formatDate(t.updatedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Conversation View (7 cols) */}
        <div className="lg:col-span-7 bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between min-h-[500px]">
          {activeTicket ? (
            <div className="flex flex-col h-full space-y-4">
              
              {/* Header */}
              <div className="border-b border-dark-border pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-light">{activeTicket.ticketNumber}</span>
                    <span className="text-xs text-dark-muted">| {activeTicket.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{activeTicket.subject}</h3>
                </div>
                <span className="text-xs text-dark-muted font-mono">{formatDate(activeTicket.createdAt)}</span>
              </div>

              {/* Message Thread */}
              <div className="flex-1 space-y-4 overflow-y-auto p-2">
                {activeTicket.messages?.map((m: any) => {
                  const isAdmin = m.senderRole === "ADMIN" || m.senderRole === "SUPER_ADMIN";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-dark-muted mb-1">
                        <span className="font-bold text-white">{m.senderName}</span>
                        {isAdmin && <span className="text-brand-primary font-bold">(Support Admin)</span>}
                        <span>{formatDate(m.createdAt)}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                        isAdmin
                          ? "bg-brand-primary/10 border border-brand-primary/20 text-white rounded-tl-none"
                          : "bg-dark-bg border border-dark-border text-dark-text rounded-tr-none"
                      }`}>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-dark-border flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời phản hồi..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyMessage.trim()}
                  className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? "Đang gửi..." : "Gửi"}</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-dark-muted space-y-2">
              <MessageSquare className="w-12 h-12 text-dark-border" />
              <p className="text-xs">Chọn một ticket bên trái để xem cuộc hội thoại hoặc tạo ticket mới.</p>
            </div>
          )}
        </div>

      </div>

      {/* Create Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">Gửi Yêu Cầu Hỗ Trợ Kỹ Thuật</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">CHỦ ĐỀ HỖ TRỢ</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-xs text-white"
                >
                  <option value="TECHNICAL">Lỗi Kỹ Thuật / Scripting Luau</option>
                  <option value="ASSET_ISSUE">Lỗi File Asset (.rbxm / .rbxl)</option>
                  <option value="BILLING">Vấn Đề Nạp Tiền & Hóa Đơn</option>
                  <option value="GENERAL">Câu Hỏi Chung</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">MỨC ĐỘ ƯU TIÊN</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-xs text-white"
                >
                  <option value="LOW">Thấp (Tư vấn)</option>
                  <option value="NORMAL">Bình thường</option>
                  <option value="HIGH">Cao (Lỗi game nghiêm trọng)</option>
                  <option value="URGENT">Khẩn cấp (Lỗi thanh toán)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">TIÊU ĐỀ YÊU CẦU</label>
                <input
                  type="text"
                  required
                  placeholder="Mô tả tóm tắt sự cố..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">CHI TIẾT VẤN ĐỀ</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ghi rõ chi tiết lỗi, version Roblox Studio và các bước tái hiện sự cố..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Gửi Yêu Cầu Hỗ Trợ</span>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

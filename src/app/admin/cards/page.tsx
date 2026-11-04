"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, Search, Filter, CheckCircle2, XCircle, Clock, 
  RefreshCw, Settings, ShieldCheck, Zap, AlertTriangle, ArrowUpRight, Copy, Check
} from "lucide-react";
import { formatVND } from "@/lib/utils";

export default function AdminCardsPage() {
  const [activeTab, setActiveTab] = useState<"CARDS" | "GATEWAY" | "DISCOUNTS">("CARDS");
  const [cards, setCards] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterTelco, setFilterTelco] = useState("ALL");
  const [search, setSearch] = useState("");

  // Gateway state
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [filterStatus, filterTelco]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cards?status=${filterStatus}&telco=${filterTelco}`);
      const data = await res.json();
      if (data.success) {
        setCards(data.cards || []);
        setDiscounts(data.discounts || []);
        setStats(data.stats || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (cardId: string, action: "APPROVE" | "REJECT" | "WRONG_AMOUNT") => {
    setProcessingId(cardId);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchCards();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateDiscount = async (discountId: string, discount: number, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountId, discount, isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      fetchCards();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const filteredCards = cards.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.requestId.toLowerCase().includes(q) ||
      c.serial.toLowerCase().includes(q) ||
      c.pin.toLowerCase().includes(q) ||
      c.user?.profile?.displayName?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q)
    );
  });

  const totalSuccess = stats.find((s) => s.status === "SUCCESS")?._sum?.receivedAmount || 0;
  const countPending = stats.find((s) => s.status === "PENDING")?._count?._all || 0;
  const countSuccess = stats.find((s) => s.status === "SUCCESS")?._count?._all || 0;
  const countFailed = stats.find((s) => s.status === "FAILED")?._count?._all || 0;

  const webhookUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/cards/callback` 
    : "http://localhost:3000/api/cards/callback";

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#263554] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#F1F3F6] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#38BDF8]" />
            <span>Hệ Thống Gạch Thẻ Cào Tự Động</span>
          </h1>
          <p className="text-xs text-[#929BAA] mt-1">
            Gạch thẻ tự động 24/7 theo chuẩn TheSieuRe / TrumThe / Doithecao v2 & CardVIP
          </p>
        </div>

        <button
          onClick={fetchCards}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#162036] hover:bg-[#1E2B48] border border-[#263554] text-xs font-mono text-[#F1F3F6] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-[#0F172A] border border-[#263554] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#929BAA]">Doanh Thu Thẻ Cào</span>
          <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
            {formatVND(totalSuccess)}
          </div>
          <span className="text-[10px] text-[#626D7D] mt-1 block">Đã cộng vào ví user</span>
        </div>

        <div className="p-4 bg-[#0F172A] border border-[#263554] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#929BAA]">Thẻ Chờ Duyệt</span>
          <div className="text-lg font-bold text-amber-400 mt-1 font-mono">
            {countPending}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Cần kiểm tra nhà mạng</span>
        </div>

        <div className="p-4 bg-[#0F172A] border border-[#263554] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#929BAA]">Thẻ Thành Công</span>
          <div className="text-lg font-bold text-[#38BDF8] mt-1 font-mono">
            {countSuccess}
          </div>
          <span className="text-[10px] text-[#626D7D] mt-1 block">Giao dịch hợp lệ</span>
        </div>

        <div className="p-4 bg-[#0F172A] border border-[#263554] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#929BAA]">Thẻ Thất Bại / Lỗi</span>
          <div className="text-lg font-bold text-rose-400 mt-1 font-mono">
            {countFailed}
          </div>
          <span className="text-[10px] text-[#626D7D] mt-1 block">Sai mã hoặc đã dùng</span>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#263554] gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("CARDS")}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === "CARDS"
              ? "border-[#38BDF8] text-[#38BDF8]"
              : "border-transparent text-[#929BAA] hover:text-white"
          }`}
        >
          Danh Sách Giao Dịch Thẻ
        </button>

        <button
          onClick={() => setActiveTab("GATEWAY")}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === "GATEWAY"
              ? "border-[#38BDF8] text-[#38BDF8]"
              : "border-transparent text-[#929BAA] hover:text-white"
          }`}
        >
          Cấu Hình Đối Tác API & Webhook
        </button>

        <button
          onClick={() => setActiveTab("DISCOUNTS")}
          className={`py-2 px-4 border-b-2 transition-colors ${
            activeTab === "DISCOUNTS"
              ? "border-[#38BDF8] text-[#38BDF8]"
              : "border-transparent text-[#929BAA] hover:text-white"
          }`}
        >
          Bảng Chiết Khấu Nhà Mạng
        </button>
      </div>

      {/* TAB 1: DANH SÁCH THẺ */}
      {activeTab === "CARDS" && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#626D7D]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã giao dịch, pin, seri..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#162036] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-[#162036] border border-[#263554] rounded text-xs text-[#F1F3F6] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Đang chờ xử lý</option>
                <option value="SUCCESS">Thành công</option>
                <option value="FAILED">Thất bại</option>
              </select>

              <select
                value={filterTelco}
                onChange={(e) => setFilterTelco(e.target.value)}
                className="px-3 py-1.5 bg-[#162036] border border-[#263554] rounded text-xs text-[#F1F3F6] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">Tất cả nhà mạng</option>
                <option value="VIETTEL">Viettel</option>
                <option value="VINAPHONE">VinaPhone</option>
                <option value="MOBIFONE">MobiFone</option>
                <option value="VIETNAMOBILE">Vietnamobile</option>
                <option value="ZING">Zing</option>
                <option value="GATE">Gate</option>
                <option value="GARENA">Garena</option>
              </select>
            </div>
          </div>

          {/* Cards Table */}
          <div className="border border-[#263554] rounded-lg overflow-x-auto bg-[#0F172A]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#162036] text-[#929BAA] font-mono uppercase text-[10px] border-b border-[#263554]">
                <tr>
                  <th className="p-3">Mã GD / Thời Gian</th>
                  <th className="p-3">Khách Hàng</th>
                  <th className="p-3">Nhà Mạng</th>
                  <th className="p-3">Mã Thẻ (PIN)</th>
                  <th className="p-3">Số Seri</th>
                  <th className="p-3">Khai Báo</th>
                  <th className="p-3">Thực Nhận</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263554] font-mono">
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#626D7D] font-sans">
                      Không có giao dịch thẻ cào nào
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((item) => (
                    <tr key={item.id} className="hover:bg-[#162036]/40 transition-colors">
                      <td className="p-3 font-sans">
                        <div className="font-bold text-[#F1F3F6] font-mono text-[11px]">{item.requestId}</div>
                        <div className="text-[10px] text-[#626D7D]">
                          {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </td>

                      <td className="p-3 font-sans">
                        <div className="font-bold text-[#F1F3F6]">{item.user?.profile?.displayName || "Khách hàng"}</div>
                        <div className="text-[10px] text-[#626D7D] truncate max-w-[120px]">{item.user?.email}</div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] font-bold text-[10px]">
                          {item.telco}
                        </span>
                      </td>

                      <td className="p-3 text-rose-400 font-bold">{item.pin}</td>
                      <td className="p-3 text-[#F1F3F6]">{item.serial}</td>

                      <td className="p-3 text-[#F1F3F6] font-bold">
                        {formatVND(item.declaredAmount)}
                      </td>

                      <td className="p-3 text-emerald-400 font-bold">
                        {formatVND(item.receivedAmount)}
                      </td>

                      <td className="p-3 font-sans">
                        {item.status === "SUCCESS" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Thành công
                          </span>
                        )}
                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <Clock className="w-3 h-3 animate-spin" /> Đang xử lý
                          </span>
                        )}
                        {item.status === "FAILED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <XCircle className="w-3 h-3" /> Thất bại
                          </span>
                        )}
                        {item.note && (
                          <div className="text-[10px] text-[#929BAA] italic mt-0.5 max-w-[150px] truncate" title={item.note}>
                            {item.note}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-right font-sans">
                        {item.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleAction(item.id, "APPROVE")}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                            >
                              Duyệt
                            </button>
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleAction(item.id, "WRONG_AMOUNT")}
                              className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition-colors"
                            >
                              Sai MG
                            </button>
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleAction(item.id, "REJECT")}
                              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-colors"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#626D7D]">Đã duyệt</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: CẤU HÌNH CỔNG ĐỐI TÁC GẠCH THẺ */}
      {activeTab === "GATEWAY" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          
          <div className="p-5 bg-[#0F172A] border border-[#263554] rounded-lg space-y-4">
            <h3 className="font-bold text-sm text-[#F1F3F6] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#38BDF8]" />
              <span>Cấu Hình Đối Tác (TheSieuRe / TrumThe / Doithecao v2)</span>
            </h3>

            <p className="text-xs text-[#929BAA]">
              Tích hợp hệ thống gạch thẻ tự động giống mã nguồn bạn tải về. Cấu hình PARTNER_ID và PARTNER_KEY tại file <code className="text-[#38BDF8]">.env</code>:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#162036] rounded border border-[#263554] text-[#F1F3F6]">
                <div className="text-[#626D7D]"># Cấu hình gạch thẻ cào tự động (.env)</div>
                <div className="text-emerald-400">CARD_PARTNER_ID="your_partner_id"</div>
                <div className="text-emerald-400">CARD_PARTNER_KEY="your_partner_key"</div>
                <div className="text-amber-400">CARD_GATEWAY_URL="https://thesieure.com/chargingws/v2"</div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-[#38BDF8] font-sans text-xs">
                💡 <strong>Ghi chú:</strong> Nếu chưa điền thông tin đối tác, hệ thống sẽ hoạt động ở <strong>Chế Độ Sandbox Mô Phỏng</strong> để bạn và khách hàng có thể thử nghiệm nạp thẻ cào ngay lập tức mà không bị lỗi kết nối!
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#0F172A] border border-[#263554] rounded-lg space-y-4">
            <h3 className="font-bold text-sm text-[#F1F3F6] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>URL Webhook Nhận Callback Kết Quả</span>
            </h3>

            <p className="text-xs text-[#929BAA]">
              Dán URL này vào mục <strong>UrlCallback</strong> trên website đối tác (TheSieuRe, TrumThe, CardVIP, Doithecao...) để nhận kết quả duyệt thẻ tự động:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full px-3 py-2 bg-[#162036] border border-[#263554] rounded text-xs text-[#38BDF8] font-mono focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  setCopiedWebhook(true);
                  setTimeout(() => setCopiedWebhook(false), 2000);
                }}
                className="px-3 py-2 bg-[#1E2B48] hover:bg-[#263554] border border-[#263554] rounded text-xs font-bold text-[#F1F3F6] flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? "Đã copy" : "Sao chép"}</span>
              </button>
            </div>

            <div className="text-xs text-[#929BAA] space-y-1">
              <p>✔ Hỗ trợ cả 2 chuẩn giao thức:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#626D7D]">
                <li>Chuẩn 1: Giao thức TheSieuRe / TrumThe v2 (status: 1, 2, 3, 99)</li>
                <li>Chuẩn 2: Giao thức REST JSON CardVIP (status: 200, 201, 100)</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: BẢNG CHIẾT KHẤU NHÀ MẠNG */}
      {activeTab === "DISCOUNTS" && (
        <div className="border border-[#263554] rounded-lg overflow-x-auto bg-[#0F172A]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162036] text-[#929BAA] font-mono uppercase text-[10px] border-b border-[#263554]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Loại Thẻ</th>
                <th className="p-3">Mệnh Giá</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3">Chiết Khấu (%)</th>
                <th className="p-3 text-right">Lưu Thay Đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263554] font-mono">
              {discounts.map((item, index) => {
                return (
                  <tr key={item.id} className="hover:bg-[#162036]/40 transition-colors">
                    <td className="p-3 text-[#626D7D]">{index + 1}</td>
                    <td className="p-3 font-bold text-[#38BDF8]">{item.telco}</td>
                    <td className="p-3 text-[#F1F3F6] font-bold">{formatVND(item.amount)}</td>
                    <td className="p-3 font-sans">
                      <button
                        onClick={() => handleUpdateDiscount(item.id, item.discount, !item.isActive)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          item.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {item.isActive ? "Hoạt Động" : "Bảo Trì"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 max-w-[120px]">
                        <input
                          type="number"
                          defaultValue={item.discount}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val !== item.discount) {
                              handleUpdateDiscount(item.id, val, item.isActive);
                            }
                          }}
                          className="w-16 px-2 py-1 bg-[#162036] border border-[#263554] rounded text-xs text-center text-amber-400 font-bold focus:outline-none focus:border-[#38BDF8]"
                        />
                        <span className="text-[#929BAA]">%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-[10px] text-[#626D7D] font-sans">
                      Tự động lưu khi sửa
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

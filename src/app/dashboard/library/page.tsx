"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Download, BookOpen, Layers, Clock, Search, 
  ExternalLink, FileCode, CheckCircle2, X 
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function MyLibraryPage() {
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGuideProduct, setActiveGuideProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.user?.orders) {
        const items = data.user.orders.flatMap((o: any) =>
          o.items.map((i: any) => ({
            ...i.product,
            orderNumber: o.orderNumber,
            purchasedAt: o.createdAt,
          }))
        );
        // Lọc trùng theo productId
        const unique = Array.from(new Map(items.map((item: any) => [item.id, item])).values());
        setPurchasedProducts(unique);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = purchasedProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
            Thư Viện Của Tôi
          </h1>
          <p className="text-xs text-[#929BAA] mt-1">
            Toàn bộ các scripts, models và hệ thống Roblox Studio bạn đã sở hữu bản quyền.
          </p>
        </div>

        {/* Thanh tìm kiếm trong thư viện */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#626D7D]" />
          <input
            type="text"
            placeholder="Tìm kiếm trong thư viện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#162036] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      {/* Lưới các tài nguyên đã sở hữu */}
      {loading ? (
        <div className="text-xs font-mono text-[#929BAA]">Đang tải danh sách thư viện...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#162036] border border-[#263554] rounded-lg p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0B111E] border border-[#263554] flex items-center justify-center text-[#929BAA]">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#F1F3F6]">Chưa có sản phẩm nào trong thư viện</h3>
          <p className="text-xs text-[#929BAA] max-w-sm mx-auto">
            Khám phá các framework ACS, bản đồ Cyberpunk và bộ giao diện UI trong cửa hàng để bắt đầu dự án game của bạn!
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors"
          >
            Đến Cửa Hàng Tài Nguyên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const latestFile = item.files?.[0];
            return (
              <div
                key={item.id}
                className="bg-[#162036] border border-[#263554] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#34466D] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100"}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover border border-[#263554] flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-[#38BDF8] block">
                        {item.category?.name || "Tài Nguyên Studio"}
                      </span>
                      <h3 className="text-xs font-semibold text-[#F1F3F6] truncate" title={item.title}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-[#626D7D] font-mono block mt-0.5">
                        Ngày mua: {formatDate(item.purchasedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#929BAA]">
                    <span className="px-1.5 py-0.5 rounded bg-[#0B111E] border border-[#263554]">
                      {item.fileFormat || ".rbxm"}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0B111E] border border-[#263554]">
                      Bản: {latestFile?.version || "1.0.0"}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0B111E] border border-[#263554]">
                      {latestFile?.fileSize || "10 MB"}
                    </span>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="pt-3 border-t border-[#263554] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveGuideProduct(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B111E] hover:bg-[#1E2B48] text-[#F1F3F6] text-xs font-medium rounded transition-colors border border-[#263554]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Hướng Dẫn</span>
                  </button>

                  <a
                    href={`/api/download/${item.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Hướng Dẫn Cài Đặt */}
      {activeGuideProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#162036] border border-[#263554] rounded-lg p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-[#263554] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-semibold text-[#F1F3F6] truncate max-w-xs">
                  Hướng Dẫn: {activeGuideProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGuideProduct(null)}
                className="text-[#929BAA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded bg-[#0B111E] border border-[#263554] text-xs leading-relaxed text-[#929BAA] max-h-96 overflow-y-auto space-y-2">
              {activeGuideProduct.installationGuide ? (
                <div dangerouslySetInnerHTML={{ __html: activeGuideProduct.installationGuide.replace(/\n/g, "<br/>") }} />
              ) : (
                <>
                  <p>1. Tải file asset (.rbxm hoặc .lua) từ thư viện về máy tính của bạn.</p>
                  <p>2. Mở dự án trong Roblox Studio, nhấp chuột phải vào Explorer chọn <strong>Insert from File</strong>.</p>
                  <p>3. Kéo module vào đúng vị trí Explorer tương ứng (ServerScriptService cho logic server, StarterPlayerScripts cho client, ReplicatedStorage cho chia sẻ chung).</p>
                  <p>4. Khởi chạy bằng lệnh <code>require(...)</code> theo đúng tài liệu mô-đun.</p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveGuideProduct(null)}
                className="px-4 py-1.5 bg-[#1E2B48] hover:bg-[#263554] text-xs font-semibold rounded text-[#F1F3F6] border border-[#263554]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

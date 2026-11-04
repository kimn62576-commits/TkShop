"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, Plus, Search, Edit2, Trash2, CheckCircle, 
  XCircle, Eye, RefreshCw, X, Tag, FileUp 
} from "lucide-react";
import { formatVND, formatDate } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [fileFormat, setFileFormat] = useState(".rbxm");
  const [robloxVersion, setRobloxVersion] = useState("Studio v0.640+");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
      if (data.categories?.length > 0 && !categoryId) {
        setCategoryId(data.categories[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?q=${encodeURIComponent(search)}&page=${page}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle("");
    setSubtitle("");
    setPrice(100000);
    setOriginalPrice(150000);
    setIsFree(false);
    setIsFeatured(false);
    setIsTrending(false);
    setIsBestSeller(false);
    setFileFormat(".rbxm");
    setRobloxVersion("Studio v0.640+");
    setThumbnailUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800");
    setDescription("Mô tả chi tiết và tính năng sản phẩm Roblox Studio...");
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSubtitle(p.subtitle || "");
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setIsFree(p.isFree);
    setIsFeatured(p.isFeatured);
    setIsTrending(p.isTrending);
    setIsBestSeller(p.isBestSeller);
    setFileFormat(p.fileFormat);
    setRobloxVersion(p.robloxVersion || "Studio v0.640+");
    setThumbnailUrl(p.images?.[0]?.imageUrl || "");
    setDescription(p.description);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProduct) {
        // Edit existing product
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            title,
            subtitle,
            categoryId,
            price,
            originalPrice,
            isFree,
            isFeatured,
            isTrending,
            isBestSeller,
            description,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      } else {
        // Create product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subtitle,
            categoryId,
            price,
            originalPrice,
            isFree,
            isFeatured,
            isTrending,
            isBestSeller,
            fileFormat,
            robloxVersion,
            thumbnailUrl,
            description,
            fileName: `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}${fileFormat}`,
            fileSize: "12.5 MB",
            initialVersion: "1.0.0",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }

      setModalOpen(false);
      fetchProducts();
      alert("Lưu sản phẩm thành công!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn lưu trữ (Archive) sản phẩm này không?")) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Sản Phẩm (Products)</h1>
          <p className="text-xs text-dark-muted mt-1">
            Tạo mới, chỉnh sửa giá, cập nhật file và trạng thái hiển thị của toàn bộ Roblox Assets.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm, slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh sách sản phẩm...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Giá bán</th>
                  <th className="px-4 py-3">Định dạng</th>
                  <th className="px-4 py-3">Đã bán</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100"}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover border border-dark-border flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{p.title}</p>
                          <span className="text-[10px] text-dark-muted font-mono">{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                      {p.category?.name}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold whitespace-nowrap">
                      {p.isFree ? (
                        <span className="text-green-400">Miễn phí</span>
                      ) : (
                        <span className="text-white">{formatVND(p.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {p.fileFormat}
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-light whitespace-nowrap">
                      {p.salesCount} lượt
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-dark-bg hover:bg-dark-border text-dark-text border border-dark-border transition-colors"
                        title="Sửa sản phẩm"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg bg-dark-bg hover:bg-red-500/20 text-red-400 border border-dark-border transition-colors"
                        title="Lưu trữ (Archive)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới Vào Marketplace"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-text mb-1">TIÊU ĐỀ SẢN PHẨM</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">PHỤ ĐỀ / TÓM TẮT</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-dark-text mb-1">DANH MỤC</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-dark-text mb-1">ĐỊNH DẠNG FILE</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                  >
                    <option value=".rbxm">.rbxm (Roblox Model)</option>
                    <option value=".rbxl">.rbxl (Roblox Place)</option>
                    <option value=".luau">.luau (Luau Module)</option>
                    <option value=".zip">.zip (Full Source Pack)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-dark-text mb-1">GIÁ BÁN (VND)</label>
                  <input
                    type="number"
                    disabled={isFree}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-dark-text mb-1">GIÁ GỐC (ĐỂ TÍNH % GIẢM)</label>
                  <input
                    type="number"
                    disabled={isFree}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded bg-dark-bg border-dark-border"
                  />
                  <span>Miễn phí (Free Download)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-dark-bg border-dark-border"
                  />
                  <span>Sản phẩm tiêu biểu (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded bg-dark-bg border-dark-border"
                  />
                  <span>Thịnh hành (Trending)</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">URL ẢNH THUMBNAIL</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">MÔ TẢ CHI TIẾT (MARKDOWN)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-dark-bg hover:bg-dark-border text-white rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg shadow-glow"
                >
                  {saving ? "Đang lưu..." : "Lưu Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

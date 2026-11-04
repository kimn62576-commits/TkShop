"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Edit2, X, RefreshCw, Box } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Box");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setIcon("Box");
    setDescription("");
    setSortOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setName(c.name);
    setIcon(c.icon || "Box");
    setDescription(c.description || "");
    setSortOrder(c.sortOrder);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      const method = editingCategory ? "PUT" : "POST";
      const payload = editingCategory
        ? { id: editingCategory.id, name, icon, description, sortOrder }
        : { name, icon, description, sortOrder };

      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setModalOpen(false);
      fetchCategories();
      alert("Lưu danh mục thành công!");
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
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản Lý Danh Mục (Categories)</h1>
          <p className="text-xs text-dark-muted mt-1">
            Phân loại cấu trúc sản phẩm và thứ tự hiển thị ngoài trang chủ.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-dark-muted">Đang tải danh mục...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-bg text-dark-muted uppercase font-semibold border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Thứ tự</th>
                  <th className="px-4 py-3">Tên danh mục</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Icon Lucide</th>
                  <th className="px-4 py-3">Số lượng assets</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-light whitespace-nowrap">
                      #{c.sortOrder}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold text-white">{c.name}</span>
                      {c.description && (
                        <p className="text-[10px] text-dark-muted truncate max-w-xs">{c.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-dark-muted whitespace-nowrap">
                      {c.slug}
                    </td>
                    <td className="px-4 py-3 font-mono text-brand-light whitespace-nowrap">
                      {c.icon || "Box"}
                    </td>
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                      {c._count?.products || 0} sản phẩm
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="px-2.5 py-1 bg-dark-bg hover:bg-dark-border border border-dark-border rounded-lg text-dark-text transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-text mb-1">TÊN DANH MỤC</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">ICON LUCIDE</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
                >
                  <option value="Box">Box (Roblox Models)</option>
                  <option value="Code">Code (Scripts)</option>
                  <option value="Layers">Layers (Systems)</option>
                  <option value="Map">Map (Maps & Terrain)</option>
                  <option value="Layout">Layout (UI Kits)</option>
                  <option value="Car">Car (Vehicles)</option>
                  <option value="Building2">Building2 (Buildings)</option>
                  <option value="Wrench">Wrench (Tools)</option>
                  <option value="Cpu">Cpu (Plugins)</option>
                  <option value="Sparkles">Sparkles (Other)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">THỨ TỰ HIỂN THỊ (SẮP XẾP)</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-text mb-1">MÔ TẢ NGẮN</label>
                <textarea
                  rows={2}
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
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg shadow-glow"
                >
                  {saving ? "Đang lưu..." : "Lưu Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

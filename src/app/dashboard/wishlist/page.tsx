"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { formatVND } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";

export default function UserWishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setItems(items.filter((i) => i.product.id !== productId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tiêu đề */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
          Danh Sách Yêu Thích
        </h1>
        <p className="text-xs text-[#929BAA] mt-1">
          Lưu lại các sản phẩm và hệ thống bạn quan tâm để mua sau.
        </p>
      </div>

      {loading ? (
        <div className="text-xs font-mono text-[#929BAA] py-6">Đang tải danh sách yêu thích...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#162036] border border-[#263554] rounded-lg p-12 text-center space-y-3">
          <Heart className="w-10 h-10 mx-auto text-[#626D7D]" />
          <h3 className="text-sm font-semibold text-[#F1F3F6]">Danh sách yêu thích trống</h3>
          <p className="text-xs text-[#929BAA] max-w-sm mx-auto">
            Bấm vào biểu tượng trái tim trên các thẻ sản phẩm trong cửa hàng để lưu vào đây!
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors"
          >
            Khám Phá Cửa Hàng
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.id} className="relative group">
              <ProductCard
                product={{
                  ...it.product,
                  thumbnail: it.product.images?.[0]?.imageUrl,
                }}
              />
              <button
                onClick={() => handleRemove(it.product.id)}
                className="absolute top-2.5 right-11 p-1.5 rounded bg-[#0B111E]/80 hover:bg-rose-500/20 text-[#929BAA] hover:text-rose-400 border border-[#263554] transition-colors"
                title="Xóa khỏi yêu thích"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

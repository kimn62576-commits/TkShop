"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, ArrowRight, Layers, Cpu, Box, Sparkles } from "lucide-react";
import { formatVND } from "@/lib/utils";

const SHOWCASE_ITEMS = [
  {
    id: "acs-combat",
    title: "Apex Combat System (ACS) v2.5 Bản Studio",
    category: "Hệ Thống Chiến Đấu",
    format: ".rbxm",
    price: 450000,
    rating: 4.9,
    reviews: 148,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
    specs: "Dự đoán Client · Không Backdoor · Chuẩn Luau Types",
    slug: "apex-combat-system-enterprise",
  },
  {
    id: "cyberpunk-env",
    title: "Đô Thị Cyberpunk Neo-Tokyo & Cao Tốc",
    category: "Bản Đồ Môi Trường",
    format: ".rbxl",
    price: 750000,
    rating: 5.0,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200",
    specs: "StreamingEnabled Sẵn Sàng · Vật Liệu PBR · 60 FPS",
    slug: "neo-tokyo-cyberpunk-megacity",
  },
  {
    id: "hypercar-chassis",
    title: "Gói Siêu Xe Tinh Chỉnh A-Chassis 6.8",
    category: "Xe Cộ & Chassis",
    format: ".rbxm",
    price: 320000,
    rating: 4.8,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    specs: "Hệ Thống Treo Tùy Chỉnh · Âm Thanh Chân Thực · Tối Ưu Mobile",
    slug: "hyperdrive-pro-tuned-supercars",
  },
  {
    id: "rpg-inventory",
    title: "Hệ Thống Kho Đồ RPG & ProfileStore Chống Dupe",
    category: "Hệ Thống Game",
    format: ".rbxm",
    price: 390000,
    rating: 4.9,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    specs: "Khóa Phiên SessionLocking · Chống Dupe 100% · Kéo Thả UI",
    slug: "valhalla-rpg-inventory-crafting-system",
  },
];

export default function HeroShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeItem = SHOWCASE_ITEMS[selectedIndex];

  return (
    <div className="w-full flex flex-col bg-[#162036] border border-[#263554] rounded-lg overflow-hidden">
      
      {/* Top Header Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-[#263554] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs font-mono text-[#929BAA]">
            TÀI NGUYÊN KIỂM ĐỊNH CHO ROBLOX STUDIO
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#626D7D]">
          <span>ĐỊNH DẠNG: <span className="text-[#F1F3F6]">{activeItem.format}</span></span>
        </div>
      </div>

      {/* Main Large Showcase Image Viewport */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0B111E] group">
        <img
          src={activeItem.image}
          alt={activeItem.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Brand Verified Crest in Top-Right Corner Với Logo Animated */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0B111E]/85 border border-[#263554] backdrop-blur-md shadow-lg">
          <img
            src="/tkshop-logo-animated-sm.webp"
            alt="TKSHOP.VN Verified"
            className="h-5 sm:h-6 w-auto object-contain drop-shadow-[0_2px_10px_rgba(139,158,255,0.4)]"
          />
          <span className="text-[10px] font-mono font-medium text-[#38BDF8] tracking-wider uppercase">
            CHỨNG NHẬN TKSHOP.VN
          </span>
        </div>

        {/* Overlay Asset Details */}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0B111E] via-[#0B111E]/70 to-transparent flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#162036]/90 text-[#F1F3F6] border border-[#263554]">
              {activeItem.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-medium text-[#F1F3F6]">{activeItem.rating}</span>
              <span className="text-[#929BAA]">({activeItem.reviews} đánh giá)</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#F1F3F6]">
            {activeItem.title}
          </h3>

          <p className="text-xs text-[#929BAA] mt-0.5 font-mono">
            {activeItem.specs}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#263554]/80">
            <span className="text-sm font-semibold text-[#F1F3F6]">
              {formatVND(activeItem.price)}
            </span>
            <Link
              href={`/product/${activeItem.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#38BDF8] hover:text-white transition-colors"
            >
              <span>Xem Chi Tiết Tài Nguyên</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Clickable Thumbnails Row */}
      <div className="grid grid-cols-4 gap-2 p-2.5 bg-[#0F172A] border-t border-[#263554]">
        {SHOWCASE_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(idx)}
            className={`relative aspect-[16/10] rounded overflow-hidden border transition-all ${
              selectedIndex === idx
                ? "border-[#38BDF8] ring-1 ring-[#38BDF8]/40 opacity-100"
                : "border-[#263554] opacity-60 hover:opacity-90"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

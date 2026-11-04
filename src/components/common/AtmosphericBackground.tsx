"use client";

import React, { useEffect, useState } from "react";

export default function AtmosphericBackground() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setTheme(e.detail);
      } else {
        const dark = document.documentElement.classList.contains("dark");
        setTheme(dark ? "dark" : "light");
      }
    };

    window.addEventListener("tkshop_theme_change", handleThemeChange);

    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setTheme(dark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("tkshop_theme_change", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ position: "fixed", inset: 0, zIndex: -10, backgroundColor: "#060A14", pointerEvents: "none" }} 
      />
    );
  }

  return (
    <div 
      style={{ position: "fixed", inset: 0, zIndex: -10, overflow: "hidden", pointerEvents: "none", userSelect: "none" }}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-all duration-700"
    >
      {theme === "dark" ? (
        <>
          {/* 01. Lớp Nền Đen Sâu Gaming Cyberpunk */}
          <div className="absolute inset-0 bg-[#060A14] transition-colors duration-700" />

          {/* 02. Ảnh Nền với ánh sáng mờ huyền ảo */}
          <div className="absolute inset-0 z-0">
            <img
              src="/tkshop-bg-anime.jpg"
              alt="TKSHOP.VN Background Dark"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              className="w-full h-full object-cover object-top opacity-20 filter blur-[1px] saturate-150 brightness-75 transition-opacity duration-700"
            />
          </div>

          {/* 03. Lớp phủ Gradient Tối Huyền Bí & Ánh Sáng Tỏa Cực Đẹp */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090F1E]/90 via-[#060A14]/85 to-[#03060C]/95" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          {/* 01. Lớp Nền Màu Sáng Dịu Tự Nhiên Giúp Tôn Chữ */}
          <div className="absolute inset-0 bg-[#F4F7FB] transition-colors duration-700" />

          {/* 02. Ảnh Nền Anime Fantasy Thủy Vân Đảo */}
          <div className="absolute inset-0 z-0">
            <img
              src="/tkshop-bg-anime.jpg"
              alt="TKSHOP.VN Background Light"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              className="w-full h-full object-cover object-top opacity-35 filter blur-[0.6px] saturate-90 transition-opacity duration-700"
            />
          </div>

          {/* 03. Lớp Kính Mờ & Gradient Trắng/Xanh Nhẹ Tỏa Khắp Màn Hình */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-slate-50/45 to-[#F1F5F9]/85 backdrop-blur-[1px]" />
        </>
      )}
    </div>
  );
}

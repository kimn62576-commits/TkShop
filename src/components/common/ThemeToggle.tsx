"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tkshop_theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("tkshop_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      window.dispatchEvent(new CustomEvent("tkshop_theme_change", { detail: next }));
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/40 border border-slate-700/50 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-90 border shadow-sm ${
        theme === "dark"
          ? "bg-[#162036] hover:bg-[#1E2B48] text-amber-400 hover:text-amber-300 border-[#263554] hover:border-amber-400/50 shadow-amber-500/10"
          : "bg-slate-100 hover:bg-slate-200 text-sky-600 hover:text-blue-700 border-slate-300 hover:border-sky-400 shadow-sky-500/10"
      }`}
      title={
        theme === "dark"
          ? "Đang ở chế độ Tối (Gaming Dark). Bấm để chuyển sang chế độ Sáng (Light Mode)"
          : "Đang ở chế độ Sáng (Light Mode). Bấm để chuyển sang chế độ Tối (Gaming Dark)"
      }
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 fill-amber-400/20 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 fill-sky-600/20 text-sky-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

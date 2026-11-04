"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<"default" | "pointer" | "card" | "magnetic">("default");
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics cho vòng tròn trailing mượt mà không có độ trễ giật
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 350, mass: 0.12 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 350, mass: 0.12 });

  useEffect(() => {
    // Chỉ kích hoạt trên thiết bị có chuột (không hiển thị trên điện thoại / tablet cảm ứng)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Bắt sự kiện hover trên các phần tử tương tác
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [data-cursor]");
      const card = target.closest("[data-cursor='card']");

      if (card) {
        setCursorState("card");
        setCursorText(card.getAttribute("data-cursor-text") || "XEM");
      } else if (interactive) {
        setCursorState("pointer");
        setCursorText("");
      } else {
        setCursorState("default");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Điểm chấm tâm chính xác tại con trỏ */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-sky-400 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: cursorState === "card" ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* 2. Vòng tròn lướt mượt mà hiệu ứng Difference / Elastic Snap */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-sky-400/80 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center font-mono font-bold uppercase backdrop-blur-[1px]"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: cursorState === "card" ? 64 : cursorState === "pointer" ? 44 : 26,
          height: cursorState === "card" ? 64 : cursorState === "pointer" ? 44 : 26,
          backgroundColor:
            cursorState === "card"
              ? "rgba(14, 165, 233, 0.9)"
              : cursorState === "pointer"
              ? "rgba(56, 189, 248, 0.18)"
              : "rgba(56, 189, 248, 0.04)",
          borderColor:
            cursorState === "card"
              ? "rgba(255, 255, 255, 0.9)"
              : cursorState === "pointer"
              ? "rgba(56, 189, 248, 0.9)"
              : "rgba(56, 189, 248, 0.4)",
          scale: cursorState === "pointer" ? 1.15 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
        }}
      >
        {cursorState === "card" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[10px] text-slate-950 font-black tracking-widest"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}

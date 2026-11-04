"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  magneticStrength?: number; // 0.1 to 0.4
  as?: "button" | "a";
  href?: string;
  [key: string]: any;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  magneticStrength = 0.28,
  as = "button",
  href,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 18, stiffness: 220, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (clientX - centerX) * magneticStrength;
    const distanceY = (clientY - centerY) * magneticStrength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (as === "a" && href) {
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y }}
        className="inline-block"
      >
        <Link
          href={href}
          className={className}
          onClick={onClick}
          {...props}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      <motion.button
        type="button"
        onClick={onClick}
        className={className}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    </motion.div>
  );
}

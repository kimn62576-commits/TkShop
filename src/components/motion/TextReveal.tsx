"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export default function TextReveal({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.045,
  as: Tag = "h1",
}: TextRevealProps) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotateZ: 2.5,
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <Tag className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-1 ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
      >
        {words.map((word, idx) => (
          <span key={idx} className="inline-block overflow-hidden py-0.5 whitespace-nowrap">
            <motion.span
              variants={wordVariants}
              className={`inline-block will-change-transform whitespace-nowrap ${wordClassName}`}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

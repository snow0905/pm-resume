"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  strong = false,
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] } } : undefined}
      className={`${strong ? "glass-card-strong" : "glass-card"} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

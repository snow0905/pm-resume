"use client";

import { motion } from "framer-motion";
import type { CapabilityItem } from "@/types";
import GlassCard from "@/components/common/GlassCard";

interface CapabilityCardProps {
  item: CapabilityItem;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
}

/**
 * CapabilityCard — 单张能力卡片
 * 标题 + 英文短语 + 描述，
 * hover 时上浮 + 边框亮起
 */
export default function CapabilityCard({
  item,
  index: _index,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: CapabilityCardProps) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative"
    >
      <GlassCard
        strong={isActive}
        className={`p-5 md:p-6 h-full transition-shadow duration-300
          ${isActive
            ? "shadow-[0_0_28px_rgba(167,193,168,0.25)] border-[var(--green-soft)]"
            : ""
          }`}
      >
        {/* 英文短语 */}
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] block mb-1.5">
          {item.subtitle}
        </span>

        {/* 标题 */}
        <h4 className="text-lg font-bold text-[var(--green-deep)] mb-2">
          {item.title}
        </h4>

        {/* 描述 */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {item.description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

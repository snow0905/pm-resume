"use client";

import { motion } from "framer-motion";
import ShinyTitle from "@/components/common/ShinyTitle";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-6 h-px bg-[var(--green-soft)]" />
        <span className="text-xs font-medium tracking-[0.25em] text-[var(--text-muted)] uppercase">
          {label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-soft)]" />
      </div>
      <ShinyTitle as="h2" className="text-3xl md:text-4xl font-bold mb-3">
        {title}
      </ShinyTitle>
      {subtitle && (
        <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

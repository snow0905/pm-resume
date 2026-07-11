"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

interface JdMatcherCardProps {
  onStartMatch: (jd: string) => void;
}

export default function JdMatcherCard({ onStartMatch }: JdMatcherCardProps) {
  const [jd, setJd] = useState("");

  const handleSubmit = () => {
    const value = jd.trim();
    if (!value) return;
    onStartMatch(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <GlassCard className="p-6 flex flex-col gap-5 max-w-[560px]">
        {/* 标题 */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--orange-soft)" }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--orange)" }} />
          </div>
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: "var(--green-deep)" }}>
            岗位匹配器
          </h3>
        </div>

        {/* 输入区 */}
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="粘贴岗位 JD，查看我与该岗位的匹配度"
          rows={2}
          className="w-full resize-none rounded-2xl px-4 py-3.5 text-sm outline-none transition-all duration-300"
          style={{
            height: 72,
            background: "var(--bg-soft)",
            border: "1px solid var(--line-soft)",
            color: "var(--text-main)",
            boxShadow: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--green-main)";
            e.target.style.boxShadow = "0 0 0 3px rgba(167, 193, 168, 0.22)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--line-soft)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* 按钮 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1, boxShadow: "0 6px 20px rgba(31, 59, 52, 0.12)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!jd.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl w-full h-14 text-sm font-semibold transition-colors duration-300 disabled:opacity-35 disabled:cursor-not-allowed"
          style={{
            background: "var(--green-soft)",
            color: "var(--green-deep)",
            boxShadow: "0 2px 8px rgba(31, 59, 52, 0.06)",
          }}
        >
          开始匹配
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </GlassCard>
    </motion.div>
  );
}

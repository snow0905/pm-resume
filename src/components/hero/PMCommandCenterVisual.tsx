"use client";

import { motion, type Variants } from "framer-motion";
import {
  FileText,
  GitBranch,
  BarChart3,
  Map,
  Rocket,
  Wand2,
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

interface SatelliteCard {
  id: string;
  label: string;
  Icon: typeof FileText;
  // 位置百分比: [left, top]
  position: [string, string];
}

const satelliteCards: SatelliteCard[] = [
  {
    id: "prd",
    label: "PRD / 需求拆解",
    Icon: FileText,
    position: ["8%", "6%"],
  },
  {
    id: "process",
    label: "流程重构",
    Icon: GitBranch,
    position: ["74%", "4%"],
  },
  {
    id: "data",
    label: "数据分析",
    Icon: BarChart3,
    position: ["3%", "38%"],
  },
  {
    id: "roadmap",
    label: "产品路径图",
    Icon: Map,
    position: ["78%", "36%"],
  },
  {
    id: "delivery",
    label: "项目推进",
    Icon: Rocket,
    position: ["12%", "72%"],
  },
  {
    id: "ai",
    label: "Prompt → Demo",
    Icon: Wand2,
    position: ["70%", "70%"],
  },
];

// 从卡片中心到面板中心的 SVG 连线坐标 (百分比)
// 面板中心: (50%, 50%)
function getConnectionLines(): { x1: string; y1: string; x2: string; y2: string }[] {
  return satelliteCards.map((card) => {
    // 卡片中心粗略估计: position + 卡片宽度/高度偏移
    // 卡片大约 22% 宽, 18% 高 (相对于容器)
    const cx = `${parseFloat(card.position[0]) + 11}%`;
    const cy = `${parseFloat(card.position[1]) + 10}%`;
    return { x1: cx, y1: cy, x2: "50%", y2: "50%" };
  });
}

// 中心面板内的抽象 UI 块
function AbstractUIBlocks() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full max-w-[220px] max-h-[160px] flex flex-col gap-3 p-4">
        {/* 顶部进度条 */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1/3 rounded-full bg-[rgba(167,193,168,0.3)]" />
          <div className="h-1.5 w-1/4 rounded-full bg-[rgba(167,193,168,0.15)]" />
          <div className="h-1.5 w-1/6 rounded-full bg-[rgba(167,193,168,0.1)]" />
        </div>
        {/* 抽象卡片行 */}
        <div className="flex gap-2 flex-1">
          <div className="w-1/2 rounded-xl bg-[rgba(167,193,168,0.12)] border border-[rgba(167,193,168,0.15)]" />
          <div className="w-1/2 rounded-xl bg-[rgba(167,193,168,0.08)] border border-[rgba(167,193,168,0.1)]" />
        </div>
        {/* 底部小方块行 */}
        <div className="flex gap-2">
          <div className="h-1.5 w-1/3 rounded-full bg-[rgba(242,155,88,0.18)]" />
          <div className="h-1.5 w-1/6 rounded-full bg-[rgba(167,193,168,0.12)]" />
          <div className="h-1.5 w-1/5 rounded-full bg-[rgba(167,193,168,0.08)]" />
        </div>
      </div>
    </div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

export default function PMCommandCenterVisual() {
  const lines = getConnectionLines();

  return (
    <motion.div
      className="relative w-full h-[520px] lg:h-[560px] select-none"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ===== SVG 连接线 ===== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(167,193,168,0.3)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.6 + i * 0.1,
              ease: [0.22, 0.61, 0.36, 1] as const,
            }}
          />
        ))}
      </svg>

      {/* ===== 中央 PM Command Center 面板 ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[46%] max-w-[260px]">
        <motion.div
          className="relative"
          style={{
            borderRadius: "32px",
            background:
              "linear-gradient(135deg, rgba(255,255,250,0.94) 0%, rgba(251,251,244,0.82) 50%, rgba(238,241,227,0.7) 100%)",
            border: "1px solid rgba(167,193,168,0.35)",
            boxShadow:
              "0 24px 70px rgba(31,59,52,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation:
              "float 5s ease-in-out infinite, breathe-glow 4s ease-in-out infinite",
          }}
        >
          {/* 点阵背景 */}
          <div
            className="absolute inset-4 rounded-[24px] opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(129,154,145,0.18) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* 抽象 UI 块 */}
          <AbstractUIBlocks />

          {/* 内容 */}
          <div className="relative z-10 flex flex-col items-center justify-center py-10 px-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--text-muted)] mb-2">
              PM COMMAND CENTER
            </p>
            <p className="text-xs text-center text-[var(--text-secondary)] leading-relaxed">
              需求拆解 · 流程重构 · 数据分析
              <br />
              路径规划 · 跨团队推进 · AI 落地
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===== 6 张卫星功能卡片 ===== */}
      {satelliteCards.map((card) => {
        const { Icon } = card;
        return (
          <motion.div
            key={card.id}
            variants={cardVariants}
            className="absolute z-10"
            style={{ left: card.position[0], top: card.position[1], width: "22%", maxWidth: "150px" }}
          >
            <GlassCard className="p-3 lg:p-4 flex flex-col items-center gap-2 text-center" hover>
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--green-main)] flex-shrink-0" />
              <span className="text-[10px] lg:text-xs font-medium text-[var(--green-deep)] leading-tight">
                {card.label}
              </span>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

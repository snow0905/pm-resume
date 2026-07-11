"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Info,
  Building2,
  Layers,
  Rocket,
  TrendingUp,
  Star,
  CheckCircle2,
  Target,
  HelpCircle,
  Send,
  FileText,
} from "lucide-react";
import type { MatchResult, MatchDimension } from "@/types";

// ================================================================
// 常量
// ================================================================
const JD_MAX_LENGTH = 8000;

const EXAMPLE_JD = `【AI 产品经理】
岗位职责：
1. 负责 AI 方向产品规划与设计，探索 AI 在业务场景中的落地应用
2. 深入理解用户需求，将 AI 能力转化为可交付的产品方案
3. 协同算法、工程、设计团队推进产品迭代，对产品体验和业务指标负责
4. 基于数据分析和用户反馈，持续优化产品策略
5. 关注行业 AI 产品趋势，输出竞品分析与产品洞察

任职要求：
1. 本科及以上学历，3 年以上产品经理经验
2. 有 AI 产品或策略产品经验者优先
3. 具备良好的数据分析能力，能通过数据驱动产品决策
4. 优秀的跨团队沟通协作能力和项目推进能力
5. 对新技术保持好奇心，能快速理解 AI 技术边界和产品化路径`;

// ================================================================
// 设计 Token — 继承主站浅色高级科技风
// ================================================================
const T = {
  modalBg:
    "linear-gradient(135deg, rgba(250,252,246,0.96), rgba(238,247,238,0.92))",
  cardBg: "rgba(255,255,252,0.72)",
  cardBgHover: "rgba(255,255,252,0.90)",
  cardBgActive: "rgba(255,255,254,0.94)",
  cardBorder: "rgba(120,160,130,0.16)",
  cardBorderHover: "rgba(120,160,130,0.30)",
  cardBorderActive: "rgba(73,138,95,0.38)",
  cardRadius: "20px",
  cardShadow:
    "0 1px 3px rgba(20,45,35,0.03), 0 8px 28px rgba(20,45,35,0.06)",
  cardShadowHover:
    "0 18px 40px rgba(32,84,60,0.12), 0 0 0 1px rgba(120,160,130,0.18)",
  cardShadowActive:
    "0 18px 40px rgba(32,84,60,0.14), 0 0 0 1px rgba(73,138,95,0.32), 0 0 28px rgba(129,154,145,0.10)",
  greenDeep: "#174A38",
  greenMain: "#2F7D55",
  greenSoft: "#6FBF8A",
  greenPale: "#A7C1A8",
  orange: "#F28C38",
  orangeSoft: "#F4A261",
  bgCream: "#F8FAF4",
  bgGreen: "#EEF6EE",
  textMain: "#163B2D",
  textSecondary: "#4E6258",
  textMuted: "#8A9A91",
  dividerColor: "rgba(120,160,130,0.14)",
} as const;

// ---- 维度图标映射 ----
const dimIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  businessScenario: Building2,
  productCapability: Layers,
  projectExperience: Rocket,
  bonusPotential: TrendingUp,
};

// ================================================================
// 背景氛围
// ================================================================
function BackgroundAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,191,138,0.08) 0%, rgba(167,193,168,0.03) 35%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167,193,168,0.10) 0%, rgba(238,247,238,0.05) 30%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}

// ================================================================
// 星级评分
// ================================================================
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.8 + i * 0.08,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <Star className="w-2.5 h-2.5" fill="#F28C38" stroke="none" />
        </motion.div>
      ))}
    </div>
  );
}

// ================================================================
// Info Tooltip
// ================================================================
function InfoTooltip() {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info
        className="w-3 h-3 cursor-help transition-colors"
        style={{ color: T.textMuted }}
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3.5 py-3 rounded-xl shadow-lg z-20 border"
            style={{
              background: "rgba(255,255,254,0.97)",
              backdropFilter: "blur(20px)",
              borderColor: T.cardBorder,
            }}
          >
            <p
              className="text-xs font-semibold mb-1.5"
              style={{ color: T.greenDeep }}
            >
              综合匹配分 =
            </p>
            <div
              className="flex flex-col gap-0.5 text-[11px] leading-relaxed"
              style={{ color: T.textSecondary }}
            >
              <span>业务场景匹配度 × 25%</span>
              <span className="font-medium" style={{ color: T.orange }}>
                + 产品能力匹配度 × 30%
              </span>
              <span className="font-medium" style={{ color: T.orange }}>
                + 项目经验匹配度 × 30%
              </span>
              <span>+ 岗位加分匹配度 × 15%</span>
            </div>
            <div
              className="mt-2 pt-2 border-t text-[10px] leading-relaxed"
              style={{ borderColor: T.dividerColor, color: T.textMuted }}
            >
              评分基于 JD 要求与简历证据综合生成，不是简单关键词匹配。
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ================================================================
// 环形得分仪表盘
// ================================================================
function ScoreRing({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const svgSize = 140;
  const svgCenter = svgSize / 2;
  const ringRadius = 50;

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setDisplayScore(Math.round(eased * score));
      if (raw < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const circumference = 2 * Math.PI * ringRadius;
  const fillLength = (displayScore / 100) * circumference;
  const emptyLength = circumference - fillLength;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center"
        style={{ width: svgSize, height: svgSize }}
      >
        <div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(111,191,138,0.16) 0%, rgba(111,191,138,0.05) 38%, transparent 66%)",
            filter: "blur(24px)",
          }}
        />
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="transform -rotate-90 relative z-10"
        >
          <defs>
            <linearGradient
              id="scoreRingGradDemo"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6FBF8A" />
              <stop offset="40%" stopColor="#2F7D55" />
              <stop offset="100%" stopColor="#174A38" />
            </linearGradient>
            <filter
              id="ringGlowDemo"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius + 8}
            fill="none"
            stroke="rgba(167,193,168,0.14)"
            strokeWidth="0.8"
            strokeDasharray="3 8"
          />
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius}
            fill="none"
            stroke="rgba(167,193,168,0.15)"
            strokeWidth="7"
          />
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius}
            fill="none"
            stroke="url(#scoreRingGradDemo)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${fillLength} ${emptyLength}`}
            filter="url(#ringGlowDemo)"
          />
          {displayScore > 0 && (
            <circle
              cx={
                svgCenter +
                ringRadius *
                  Math.cos((displayScore / 100) * 2 * Math.PI)
              }
              cy={
                svgCenter +
                ringRadius *
                  Math.sin((displayScore / 100) * 2 * Math.PI)
              }
              r={2.5}
              fill="#6FBF8A"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="flex items-baseline gap-0.5">
            <motion.span
              key={displayScore}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-[34px] font-extrabold tracking-tighter leading-none"
              style={{
                color: T.greenDeep,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {displayScore}
            </motion.span>
            <span
              className="text-[12px] font-medium"
              style={{ color: T.textMuted }}
            >
              /100
            </span>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-0"
          animate={{
            boxShadow: [
              "0 0 20px rgba(111,191,138,0.12)",
              "0 0 36px rgba(111,191,138,0.28)",
              "0 0 20px rgba(111,191,138,0.12)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="flex items-center gap-1">
        <span
          className="text-[11px] font-semibold"
          style={{ color: T.greenDeep }}
        >
          综合匹配分
        </span>
        <InfoTooltip />
      </div>
      <StarRating count={5} />
    </div>
  );
}

// ================================================================
// 维度导航项
// ================================================================
function DimensionNavItem({
  dimension,
  isActive,
  onClick,
  index,
}: {
  dimension: MatchDimension;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = dimIcons[dimension.id] || Layers;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.42 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.015,
        y: -2,
        background: isActive
          ? "linear-gradient(135deg, rgba(111,191,138,0.14) 0%, rgba(167,193,168,0.07) 60%, rgba(255,255,252,0.32) 100%)"
          : "linear-gradient(135deg, rgba(167,193,168,0.04) 0%, rgba(255,255,252,0.40) 100%)",
        borderColor: isActive
          ? "rgba(47,125,85,0.45)"
          : "rgba(120,160,130,0.22)",
        boxShadow: isActive
          ? `0 4px 24px ${T.greenSoft}28, 0 0 0 1px rgba(111,191,138,0.12), 0 0 32px rgba(111,191,138,0.08)`
          : `0 2px 16px rgba(31,59,52,0.04), 0 0 0 1px rgba(120,160,130,0.08)`,
      }}
      whileTap={{ scale: 0.99 }}
      className="relative flex items-stretch gap-3 w-full text-left cursor-pointer rounded-xl px-3 py-2.5 group flex-1 transition-colors duration-200"
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(111,191,138,0.10) 0%, rgba(167,193,168,0.04) 60%, rgba(255,255,252,0.28) 100%)"
          : "transparent",
        border: isActive
          ? "2px solid rgba(47,125,85,0.35)"
          : "2px solid transparent",
        boxShadow: isActive
          ? `0 2px 18px ${T.greenSoft}1a, 0 0 0 1px rgba(111,191,138,0.08), 0 0 28px rgba(111,191,138,0.06)`
          : "none",
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
          style={{
            background: `linear-gradient(180deg, ${T.greenSoft} 0%, ${T.greenMain} 45%, ${T.greenDeep} 100%)`,
            boxShadow: `0 0 12px ${T.greenSoft}99, 0 0 20px ${T.greenSoft}40`,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <div
        className="flex items-center gap-2.5 flex-shrink-0 self-center"
        style={{ width: 130 }}
      >
        <motion.div
          animate={isActive ? { scale: 1.08 } : { scale: 1 }}
          className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
          style={{
            background: isActive
              ? "linear-gradient(135deg, rgba(111,191,138,0.22), rgba(167,193,168,0.10))"
              : "rgba(167,193,168,0.06)",
            boxShadow: isActive
              ? `0 0 14px ${T.greenSoft}38, inset 0 1px 0 rgba(255,255,255,0.65)`
              : "inset 0 1px 0 rgba(255,255,255,0.45)",
            color: isActive ? T.greenDeep : T.greenMain,
            border: `1px solid ${
              isActive ? "rgba(111,191,138,0.22)" : "rgba(167,193,168,0.10)"
            }`,
          }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        <span
          className="text-[12px] font-bold leading-tight truncate"
          style={{ color: isActive ? T.greenDeep : T.textMain }}
        >
          {dimension.title}
        </span>
      </div>

      {/* 进度条 */}
      <div className="flex-1 flex items-center min-w-0 self-center">
        <div
          className="flex-1 h-[10px] rounded-full relative overflow-hidden"
          style={{
            background: "rgba(167,193,168,0.07)",
            boxShadow:
              "inset 0 2px 5px rgba(0,0,0,0.07), inset 0 1px 1px rgba(0,0,0,0.03), 0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #174A38 0%, #2F7D55 28%, #6FBF8A 62%, #A7E0B8 100%)",
              boxShadow: isActive
                ? `0 0 14px ${T.greenSoft}80, 0 0 22px ${T.greenSoft}30, inset 0 1px 0 rgba(255,255,255,0.32)`
                : `0 0 5px ${T.greenSoft}26, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${dimension.scorePercent}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute top-px left-2 right-4 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* 分数 */}
      <div
        className="flex flex-col items-end justify-center gap-0.5 flex-shrink-0"
        style={{ width: 66 }}
      >
        <motion.span
          className="text-[18px] font-extrabold tracking-tight leading-none tabular-nums"
          style={{ color: T.orange }}
          animate={isActive ? { scale: 1.08 } : { scale: 1 }}
        >
          {dimension.scorePercent}
        </motion.span>
        <span
          className="inline-flex items-center text-[10px] font-medium rounded-2xl px-2.5 py-1 mt-0.5 select-none"
          style={{
            color: isActive ? T.greenDeep : T.greenMain,
            background: isActive
              ? "linear-gradient(135deg, rgba(111,191,138,0.65), rgba(47,125,85,0.45))"
              : "rgba(167,193,168,0.12)",
            border: isActive
              ? "1px solid rgba(111,191,138,0.45)"
              : "1px solid rgba(120,160,130,0.16)",
          }}
        >
          查看证据
        </span>
      </div>
    </motion.button>
  );
}

// ================================================================
// 证据详情面板
// ================================================================
function EvidenceDetailPanel({ dimension }: { dimension: MatchDimension }) {
  return (
    <motion.div
      key={dimension.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 rounded-[24px] border p-4 h-full"
      style={{
        background: "rgba(255,255,252,0.68)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: T.cardBorderActive,
        boxShadow: T.cardShadowActive,
      }}
    >
      <div className="flex items-center justify-between flex-shrink-0">
        <h3
          className="text-[14px] font-extrabold tracking-tight"
          style={{ color: T.greenDeep }}
        >
          证据详情
        </h3>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium"
          style={{
            background: "rgba(111,191,138,0.12)",
            color: T.greenMain,
            border: `1px solid ${T.cardBorder}`,
          }}
        >
          当前查看：{dimension.title}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* JD 要求摘录 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold"
              style={{ color: T.textSecondary }}
            >
              JD 要求摘录
            </span>
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(167,193,168,0.12)",
                color: T.textMuted,
              }}
            >
              来源：JD
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {dimension.jdEvidence.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.03 }}
                className="flex items-start gap-2 text-[11px] leading-relaxed"
                style={{ color: T.textMuted }}
              >
                <span
                  className="mt-1.5 block w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: T.greenPale }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 简历证据摘录 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold"
              style={{ color: T.textSecondary }}
            >
              简历证据摘录
            </span>
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(242,140,56,0.08)",
                color: T.orange,
              }}
            >
              来源：简历
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {dimension.resumeEvidence.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.03 }}
                className="flex items-start gap-2 text-[11px] leading-relaxed"
                style={{ color: T.greenDeep }}
              >
                <span
                  className="mt-1.5 block w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: T.orange }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 评分说明 */}
        <div
          className="flex flex-col gap-2 pt-2 border-t"
          style={{ borderColor: T.dividerColor }}
        >
          <span
            className="text-[11px] font-bold"
            style={{ color: T.textSecondary }}
          >
            评分说明
          </span>

          <div
            className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{
              background: "rgba(242,140,56,0.04)",
              border: "1px solid rgba(242,140,56,0.10)",
            }}
          >
            <CheckCircle2
              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              style={{ color: T.orange }}
            />
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[10px] font-semibold"
                style={{ color: T.orange }}
              >
                匹配原因
              </span>
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: T.textSecondary }}
              >
                {dimension.matchReason}
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{
              background: "rgba(111,191,138,0.06)",
              border: "1px solid rgba(111,191,138,0.12)",
            }}
          >
            <AlertCircle
              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              style={{ color: T.greenMain }}
            />
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[10px] font-semibold"
                style={{ color: T.greenMain }}
              >
                扣分原因
              </span>
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: T.textSecondary }}
              >
                {dimension.deductionReason}
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-end gap-2 pt-2 border-t"
            style={{ borderColor: T.dividerColor }}
          >
            <span className="text-[10px]" style={{ color: T.textMuted }}>
              该维度得分
            </span>
            <span
              className="text-[20px] font-extrabold tracking-tight"
              style={{ color: T.orange }}
            >
              {dimension.finalScore}
            </span>
            <span className="text-[11px]" style={{ color: T.textMuted }}>
              / 100
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ================================================================
// 加载阶段文案
// ================================================================
const LOADING_STEPS = [
  { key: "parse", label: "解析 JD 语义" },
  { key: "match", label: "匹配产品能力标签" },
  { key: "evidence", label: "检索项目经历证据" },
  { key: "generate", label: "生成岗位匹配结论" },
] as const;

function getStepStatus(
  elapsed: number,
  index: number,
): "done" | "active" | "waiting" {
  const baseDelay = 0.25;
  const stepDuration = 1.1;
  const stepStart = baseDelay + index * stepDuration;
  if (elapsed >= stepStart + stepDuration * 0.65) return "done";
  if (elapsed >= stepStart) return "active";
  return "waiting";
}

// ================================================================
// 动画变体
// ================================================================
const staggerItem = (delay: number) => ({
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
});

// ================================================================
// 主页面组件
// ================================================================
export default function AiJobMatcherPage() {
  const router = useRouter();
  const [jd, setJd] = useState("");
  const [matchState, setMatchState] = useState<
    "idle" | "loading" | "result" | "error"
  >("idle");
  const [matchResult, setMatchResult] = useState<MatchResult | undefined>();
  const [activeDimensionId, setActiveDimensionId] =
    useState("businessScenario");
  const [elapsed, setElapsed] = useState(0);
  const loadingStartRef = useRef<number>(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Loading 计时
  useEffect(() => {
    if (matchState === "loading") {
      loadingStartRef.current = Date.now();
      setElapsed(0);
      const timer = setInterval(() => {
        setElapsed((Date.now() - loadingStartRef.current) / 1000);
      }, 200);
      return () => clearInterval(timer);
    }
  }, [matchState]);

  // 结果更新时重置选中的维度
  useEffect(() => {
    if (matchState === "result" && matchResult) {
      setActiveDimensionId(matchResult.dimensions[0]?.id || "businessScenario");
      // 等待 AnimatePresence 切换完成，滚动到报告标题
      setTimeout(() => {
        reportRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    }
  }, [matchState, matchResult]);

  const handleBackToHome = useCallback(() => {
    // 暂时禁用平滑滚动，直接跳转到第四屏
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    router.push("/#vibe");
    // 恢复平滑滚动的时机：页面完成渲染后
    setTimeout(() => {
      html.style.scrollBehavior = prev;
    }, 100);
  }, [router]);

  const handleFillExample = useCallback(() => {
    setJd(EXAMPLE_JD);
  }, []);

  const handleStartMatch = useCallback(async () => {
    const trimmed = jd.trim();
    if (!trimmed) return;

    if (trimmed.length > JD_MAX_LENGTH) {
      alert(
        `JD 内容过长（当前 ${trimmed.length} 字），请精简至 ${JD_MAX_LENGTH} 字以内再试`,
      );
      return;
    }

    setMatchState("loading");
    setMatchResult(undefined);

    // 立即滚动到结果区，让用户看到 loading 分析卡片
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: trimmed }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          alert(err.error || "请求参数有误");
          setMatchState("idle");
          return;
        }
        throw new Error();
      }

      const data: MatchResult = await res.json();
      setMatchState("result");
      setMatchResult(data);
    } catch {
      setMatchState("error");
    }
  }, [jd]);

  const handleRetry = useCallback(async () => {
    setMatchState("loading");
    setMatchResult(undefined);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jd.trim() }),
      });
      if (!res.ok) throw new Error();
      const data: MatchResult = await res.json();
      setMatchState("result");
      setMatchResult(data);
    } catch {
      setMatchState("error");
    }
  }, [jd]);

  const activeDimension = matchResult?.dimensions.find(
    (d) => d.id === activeDimensionId,
  );

  const canSubmit = jd.trim().length > 0 && matchState !== "loading";

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--bg-cream, #FBFBF4)" }}
    >
      {/* ======== 响应式样式 ======== */}
      <style>{`
        .demo-result-top-row {
          display: grid;
          grid-template-columns: 210px 1fr 1fr;
          gap: 12px;
        }
        .demo-result-main-row {
          display: grid;
          grid-template-columns: 56% 44%;
          gap: 12px;
          min-height: 420px;
        }
        @media (max-width: 900px) {
          .demo-result-top-row {
            grid-template-columns: 1fr;
          }
          .demo-result-main-row {
            grid-template-columns: 1fr;
            min-height: auto;
          }
        }
      `}</style>

      {/* ======== 顶部导航 ======== */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(255,255,248,0.78)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "var(--line-soft, rgba(129,154,145,0.22))",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 h-14">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(111,191,138,0.22), rgba(47,125,85,0.10))",
                boxShadow: "0 0 16px rgba(111,191,138,0.15)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: T.greenDeep }} />
            </div>
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: T.greenDeep }}
            >
              AI Job Matcher
            </span>
          </div>

          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer"
            style={{ color: T.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
            返回个人主页
          </button>
        </div>
      </nav>

      {/* ======== 主内容区 ======== */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <BackgroundAtmosphere />

        {/* ======== Hero ======== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 relative z-10"
        >
          <h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: T.greenDeep }}
          >
            AI 岗位匹配器
          </h1>
          <p
            className="text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: T.textSecondary }}
          >
            输入 JD，快速查看我与该岗位的匹配情况
          </p>
        </motion.div>

        {/* ======== 输入区 ======== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-12"
        >
          <div
            className="rounded-[28px] border p-6 md:p-8"
            style={{
              background: "rgba(255,255,252,0.82)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderColor: "rgba(120,160,130,0.20)",
              boxShadow:
                "0 24px 70px rgba(31,59,52,0.06), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="在此粘贴岗位 JD（职位描述）..."
              rows={8}
              className="w-full resize-y rounded-2xl border px-5 py-4 text-sm leading-relaxed transition-all duration-300 focus:outline-none"
              style={{
                background: "rgba(248,250,244,0.65)",
                borderColor: "rgba(120,160,130,0.18)",
                color: T.textMain,
                minHeight: 160,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(111,191,138,0.40)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(111,191,138,0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(120,160,130,0.18)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
              <button
                onClick={handleFillExample}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(167,193,168,0.10)",
                  border: "1px solid rgba(167,193,168,0.22)",
                  color: T.greenMain,
                }}
              >
                <FileText className="w-4 h-4" />
                示例 JD
              </button>

              <button
                onClick={handleStartMatch}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: matchState === "loading"
                    ? `linear-gradient(135deg, ${T.greenMain}, ${T.greenSoft})`
                    : canSubmit
                      ? `linear-gradient(135deg, ${T.greenDeep}, ${T.greenMain})`
                      : "rgba(167,193,168,0.20)",
                  color: matchState === "loading" || canSubmit ? "#fff" : T.textMuted,
                  boxShadow: matchState === "loading" || canSubmit
                    ? "0 4px 20px rgba(23,74,56,0.25)"
                    : "none",
                  opacity: matchState === "loading" ? 0.85 : undefined,
                }}
              >
                {matchState === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    匹配中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    开始匹配
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ======== 分隔线：输入 → 结果 ======== */}
        {matchState !== "idle" && (
          <div className="relative z-10 flex items-center gap-4 my-16">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--green-soft, #A7C1A8) 30%, var(--green-soft, #A7C1A8) 70%, transparent)" }} />
            <span className="text-xs font-semibold tracking-[0.15em] flex-shrink-0" style={{ color: T.textMuted }}>
              匹配结果
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--green-soft, #A7C1A8) 30%, var(--green-soft, #A7C1A8) 70%, transparent)" }} />
          </div>
        )}

        {/* ======== 匹配中 / 结果区 ======== */}
        <div ref={resultRef} style={{ scrollMarginTop: 80 }}>
          <AnimatePresence mode="wait">
            {/* ---- Loading ---- */}
          {matchState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 rounded-[28px] border p-6 md:p-8"
              style={{
                background: "rgba(255,255,252,0.82)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderColor: "rgba(120,160,130,0.20)",
                boxShadow:
                  "0 24px 70px rgba(31,59,52,0.06), inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
            >
              {/* 头部 */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(111,191,138,0.18), rgba(47,125,85,0.08))",
                    boxShadow: "0 0 24px rgba(111,191,138,0.18)",
                  }}
                >
                  <Loader2
                    className="w-5 h-5"
                    style={{ color: T.greenMain }}
                  />
                </motion.div>
                <h3
                  className="text-lg md:text-xl font-bold"
                  style={{ color: T.greenDeep }}
                >
                  AI 正在分析岗位匹配度
                </h3>
              </div>

              {/* 步骤列表 */}
              <div className="space-y-3">
                {LOADING_STEPS.map((step, i) => {
                  const status = getStepStatus(elapsed, i);
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500"
                      style={{
                        background:
                          status === "active"
                            ? "rgba(111,191,138,0.08)"
                            : status === "done"
                              ? "rgba(111,191,138,0.03)"
                              : "transparent",
                        border:
                          status === "active"
                            ? "1px solid rgba(111,191,138,0.20)"
                            : "1px solid transparent",
                      }}
                    >
                      {/* 状态指示器 */}
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7">
                        {status === "done" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                          >
                            <CheckCircle2
                              className="w-5 h-5"
                              style={{ color: T.greenMain }}
                            />
                          </motion.div>
                        )}
                        {status === "active" && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader2
                              className="w-5 h-5"
                              style={{ color: T.greenMain }}
                            />
                          </motion.div>
                        )}
                        {status === "waiting" && (
                          <div
                            className="w-[10px] h-[10px] rounded-full"
                            style={{
                              border: "2px solid rgba(167,193,168,0.35)",
                              background: "transparent",
                            }}
                          />
                        )}
                      </div>

                      {/* 步骤文字 */}
                      <span
                        className="text-sm font-medium transition-colors duration-500"
                        style={{
                          color:
                            status === "done"
                              ? T.greenMain
                              : status === "active"
                                ? T.textMain
                                : T.textMuted,
                        }}
                      >
                        {step.label}
                      </span>

                      {/* 状态标签 */}
                      <span className="ml-auto text-[11px] font-medium flex-shrink-0">
                        {status === "done" && (
                          <span style={{ color: T.greenMain }}>已完成</span>
                        )}
                        {status === "active" && (
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                            }}
                            style={{ color: T.greenMain }}
                          >
                            进行中
                          </motion.span>
                        )}
                        {status === "waiting" && (
                          <span style={{ color: T.textMuted }}>等待中</span>
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* 底部脉冲进度条 */}
              <div className="mt-6">
                <div
                  className="h-[6px] rounded-full overflow-hidden"
                  style={{ background: "rgba(167,193,168,0.10)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #6FBF8A 0%, #2F7D55 100%)",
                    }}
                    animate={{
                      width: [
                        "0%",
                        `${Math.min(
                          100,
                          (elapsed / (LOADING_STEPS.length * 1.1 + 0.25 + 0.7)) * 100,
                        )}%`,
                      ],
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- Error ---- */}
          {matchState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-20 gap-5 relative z-10"
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{ background: "rgba(242,140,56,0.12)" }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: T.orange }} />
              </div>
              <p
                className="text-[17px] font-semibold"
                style={{ color: T.greenDeep }}
              >
                分析失败
              </p>
              <p className="text-[13px]" style={{ color: T.textSecondary }}>
                请检查网络连接后重试
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${T.greenDeep}, ${T.greenMain})`,
                }}
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
            </motion.div>
          )}

          {/* ---- Result ---- */}
          {matchState === "result" && matchResult && (
            <motion.div
              key="result"
              ref={reportRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
              style={{ scrollMarginTop: 80 }}
            >
              {/* ====== 报告标题（独立于卡片外） ====== */}
              <div className="flex items-center gap-4 mb-8 pt-2">
                <motion.div
                  className="flex items-center justify-center rounded-2xl flex-shrink-0"
                  style={{
                    width: 48,
                    height: 52,
                    background:
                      "linear-gradient(135deg, rgba(111,191,138,0.22), rgba(47,125,85,0.10))",
                    boxShadow:
                      "0 0 24px rgba(111,191,138,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
                    border: "1px solid rgba(120,160,130,0.18)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 24px rgba(111,191,138,0.18)",
                      "0 0 36px rgba(111,191,138,0.32)",
                      "0 0 24px rgba(111,191,138,0.18)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles
                    className="w-6 h-6"
                    style={{ color: T.greenDeep }}
                  />
                </motion.div>
                <div>
                  <h2
                    className="text-[26px] md:text-[36px] font-extrabold tracking-tight leading-none"
                    style={{ color: T.greenDeep }}
                  >
                    AI 岗位匹配报告
                  </h2>
                  <p
                    className="mt-1.5 text-sm font-medium"
                    style={{ color: T.greenMain }}
                  >
                    基于 JD 与候选人简历的 AI 多维度匹配分析
                  </p>
                </div>
              </div>

              {/* ====== 报告内容卡片 ====== */}
              <div
                className="rounded-[28px] border p-6 md:p-8 space-y-6"
                style={{
                  background: "rgba(255,255,252,0.82)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  borderColor: "rgba(120,160,130,0.20)",
                  boxShadow:
                    "0 24px 70px rgba(31,59,52,0.06), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
              {/* 第一行：综合分 | 匹配结论 | 匹配亮点 */}
              <motion.div
                variants={staggerItem(0.12)}
                initial="hidden"
                animate="visible"
                className="demo-result-top-row"
              >
                {/* 综合分 */}
                <div className="relative flex items-center justify-center py-2 px-2">
                  <ScoreRing score={matchResult.overallScore} />
                </div>

                {/* 匹配结论 */}
                <motion.div
                  className="relative flex flex-col gap-1 rounded-[18px] border p-2.5 group"
                  style={{
                    background: T.cardBg,
                    borderColor: T.cardBorder,
                    boxShadow: T.cardShadow,
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: T.cardShadowHover,
                    borderColor: T.cardBorderHover,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{
                        background: "rgba(242,140,56,0.12)",
                        color: T.orange,
                      }}
                    >
                      <Target className="w-4 h-4" />
                    </div>
                    <h3
                      className="text-[14px] font-bold"
                      style={{ color: T.orange }}
                    >
                      匹配结论
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {matchResult.conclusion
                      .split(/[。；]/)
                      .filter(Boolean)
                      .map((sentence, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.08 }}
                          className="flex items-start gap-2 text-[12px] leading-[1.6]"
                          style={{ color: T.textSecondary }}
                        >
                          <span
                            className="mt-1.5 block w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: T.orange }}
                          />
                          {sentence}
                        </motion.li>
                      ))}
                  </ul>
                </motion.div>

                {/* 匹配亮点 */}
                <motion.div
                  className="relative flex flex-col gap-1 rounded-[18px] border p-2.5"
                  style={{
                    background: T.cardBg,
                    borderColor: T.cardBorder,
                    boxShadow: T.cardShadow,
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: T.cardShadowHover,
                    borderColor: T.cardBorderHover,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{
                        background: "rgba(242,140,56,0.12)",
                        color: T.orange,
                      }}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3
                      className="text-[14px] font-bold"
                      style={{ color: T.orange }}
                    >
                      匹配亮点
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {matchResult.highlights.slice(0, 3).map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-2 text-[11px] leading-[1.5]"
                        style={{ color: T.textSecondary }}
                      >
                        <span
                          className="mt-1.5 block w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: T.orange,
                            boxShadow: `0 0 4px ${T.orangeSoft}`,
                          }}
                        />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>

              {/* 第二行：维度导航 + 证据详情 */}
              <motion.div
                variants={staggerItem(0.25)}
                initial="hidden"
                animate="visible"
                className="demo-result-main-row"
              >
                {/* 维度导航面板 */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col rounded-[24px] border"
                  style={{
                    background: "rgba(255,255,252,0.68)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderColor: T.cardBorder,
                    boxShadow: T.cardShadow,
                  }}
                >
                  <div className="flex items-baseline justify-between px-5 pt-3 pb-1.5 flex-shrink-0">
                    <div className="flex items-baseline gap-2">
                      <h3
                        className="text-[14px] font-extrabold tracking-tight"
                        style={{ color: T.greenDeep }}
                      >
                        匹配维度
                      </h3>
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{ color: T.textMuted }}
                      >
                        点击维度查看对应证据
                      </p>
                    </div>
                  </div>
                  <div
                    className="mx-5 border-t flex-shrink-0"
                    style={{ borderColor: T.dividerColor }}
                  />
                  <div className="flex-1 flex flex-col px-3 py-0.5">
                    {matchResult.dimensions.map((dim, i) => (
                      <div key={dim.id} className="flex flex-col flex-1">
                        {i > 0 && (
                          <div
                            className="mx-4 border-t flex-shrink-0"
                            style={{
                              borderColor: "rgba(120,160,130,0.07)",
                            }}
                          />
                        )}
                        <DimensionNavItem
                          dimension={dim}
                          isActive={dim.id === activeDimensionId}
                          onClick={() => setActiveDimensionId(dim.id)}
                          index={i}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 证据详情 */}
                <div className="min-h-0">
                  <AnimatePresence mode="wait">
                    {activeDimension && (
                      <EvidenceDetailPanel
                        key={activeDimension.id}
                        dimension={activeDimension}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* 待确认点 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-1.5 rounded-[18px] border p-2.5"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  borderColor: "rgba(74,132,120,0.16)",
                  boxShadow:
                    "0 1px 3px rgba(47,111,100,0.03), 0 6px 18px rgba(47,111,100,0.04)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-md"
                    style={{
                      background: "rgba(111,175,162,0.12)",
                      color: "#2F6F64",
                    }}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <h4
                    className="text-[13px] font-bold"
                    style={{ color: "#2F6F64" }}
                  >
                    待确认点
                  </h4>
                  <span
                    className="text-[10px] ml-2 px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(111,175,162,0.10)",
                      color: "#2F6F64",
                    }}
                  >
                    建议面试环节进一步确认
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: "rgba(111,175,162,0.14)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#6FAFA2" }}
                    />
                  </span>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "#4E6258" }}
                  >
                    {matchResult.concerns[0]}
                  </p>
                </div>
              </motion.div>

              {/* 底部提示 */}
              <motion.p
                variants={staggerItem(0.45)}
                initial="hidden"
                animate="visible"
                className="text-center text-[10px] pt-1"
                style={{ color: T.textMuted }}
              >
                以上分析由 AI 基于简历内容与 JD 要求自动生成，仅供参考
              </motion.p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* ======== 分隔线：结果 → 设计说明 ======== */}
        <div className="relative z-10 flex items-center gap-4 my-16">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--green-soft, #A7C1A8) 30%, var(--green-soft, #A7C1A8) 70%, transparent)" }} />
          <span className="text-xs font-semibold tracking-[0.15em] flex-shrink-0" style={{ color: T.textMuted }}>
            设计思路
          </span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--green-soft, #A7C1A8) 30%, var(--green-soft, #A7C1A8) 70%, transparent)" }} />
        </div>

        {/* ======== 底部内容区 ======== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 space-y-12"
        >
          {/* 这个 Demo 如何设计 */}
          <section>
            <h2
              className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6"
              style={{ color: T.greenDeep }}
            >
              这个 Demo 如何设计
            </h2>
            <div
              className="rounded-[28px] border p-6 md:p-8 space-y-5"
              style={{
                background: "rgba(255,255,252,0.72)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderColor: "rgba(120,160,130,0.16)",
                boxShadow:
                  "0 1px 3px rgba(20,45,35,0.03), 0 8px 28px rgba(20,45,35,0.06)",
              }}
            >
              <div className="space-y-3">
                <h3
                  className="text-lg font-bold"
                  style={{ color: T.greenDeep }}
                >
                  多维匹配，而非关键词打分
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: T.textSecondary }}
                >
                  AI
                  匹配器的核心逻辑不是简单的关键词命中计数。它从「业务场景」「产品能力」「项目经验」「岗位加分匹配度」四个维度，将
                  JD 中的每一条要求与简历中的具体经历进行语义对齐，寻找可验证的证据链。
                  每个维度的得分都有明确的 JD 证据摘录和简历证据摘录作为支撑，让匹配结果透明可解释。
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className="text-lg font-bold"
                  style={{ color: T.greenDeep }}
                >
                  评分规则透明，可解释可追溯
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: T.textSecondary }}
                >
                  每个维度的评分都有「匹配原因」和「扣分原因」两个分析视角，让招聘方不仅看到分数，还能看到分数背后的推理逻辑。
                  权重设计也反映了产品经理岗位的真实需求：产品能力和项目经验各占
                  30%，业务场景占 25%，加分项占 15%。
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className="text-lg font-bold"
                  style={{ color: T.greenDeep }}
                >
                  待确认点 — AI 的能力边界
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: T.textSecondary }}
                >
                  AI
                  不可能完全了解候选人的所有经历细节。因此匹配报告专门设计了「待确认点」模块，将
                  AI
                  无法判定的领域明确标注出来，建议在面试环节进一步确认。这是对 AI
                  能力边界的产品思考，也是负责任的匹配态度。
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

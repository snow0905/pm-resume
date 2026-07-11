"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  X,
  Sparkles,
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
} from "lucide-react";
import type { MatchResult, MatchDimension } from "@/types";

interface JdMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: "loading" | "result" | "error";
  result?: MatchResult;
  onRetry?: () => void;
}

// ---- 维度图标映射 ----
const dimIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  businessScenario: Building2,
  productCapability: Layers,
  projectExperience: Rocket,
  bonusPotential: TrendingUp,
};

const dimDecorLabels: Record<string, string> = {
  businessScenario: "业务场景匹配",
  productCapability: "产品能力匹配",
  projectExperience: "项目经验匹配",
  bonusPotential: "岗位加分项",
};

// ================================================================
// 设计 Token — 浅色高级科技风 · 玻璃拟态 · 绿色科技感
// ================================================================
const T = {
  // 背景
  modalBg:
    "linear-gradient(135deg, rgba(250,252,246,0.96), rgba(238,247,238,0.92))",
  // 卡片
  cardBg: "rgba(255,255,252,0.72)",
  cardBgHover: "rgba(255,255,252,0.90)",
  cardBgActive: "rgba(255,255,254,0.94)",
  cardBorder: "rgba(120,160,130,0.16)",
  cardBorderHover: "rgba(120,160,130,0.30)",
  cardBorderActive: "rgba(73,138,95,0.38)",
  cardRadius: "20px",
  cardShadow: "0 1px 3px rgba(20,45,35,0.03), 0 8px 28px rgba(20,45,35,0.06)",
  cardShadowHover:
    "0 18px 40px rgba(32,84,60,0.12), 0 0 0 1px rgba(120,160,130,0.18)",
  cardShadowActive:
    "0 18px 40px rgba(32,84,60,0.14), 0 0 0 1px rgba(73,138,95,0.32), 0 0 28px rgba(129,154,145,0.10)",
  // 颜色
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

// ================================================================
// 背景氛围组件 — 粒子、光晕、网格
// ================================================================
function BackgroundAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
      {/* 径向光斑 */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,191,138,0.10) 0%, rgba(167,193,168,0.04) 35%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-8%] left-[-5%] w-[40%] h-[40%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167,193,168,0.12) 0%, rgba(238,247,238,0.06) 30%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute top-[35%] left-[25%] w-[30%] h-[30%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(242,140,56,0.05) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />

      {/* 极淡网格纹理 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,160,130,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,130,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 30%, transparent 70%)",
        }}
      />

      {/* 浮动粒子 */}
      <motion.div
        className="absolute w-1 h-1 rounded-full"
        style={{
          top: "12%",
          left: "8%",
          background: "rgba(111,191,138,0.5)",
          boxShadow: "0 0 6px rgba(111,191,138,0.4)",
        }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          top: "22%",
          right: "12%",
          background: "rgba(167,193,168,0.45)",
          boxShadow: "0 0 4px rgba(167,193,168,0.3)",
        }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full"
        style={{
          bottom: "18%",
          left: "15%",
          background: "rgba(111,191,138,0.4)",
          boxShadow: "0 0 5px rgba(111,191,138,0.35)",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full"
        style={{
          top: "55%",
          right: "8%",
          background: "rgba(242,140,56,0.25)",
          boxShadow: "0 0 4px rgba(242,140,56,0.2)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
      <motion.div
        className="absolute w-[2px] h-[2px] rounded-full"
        style={{
          top: "68%",
          left: "28%",
          background: "rgba(167,193,168,0.5)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* 细线轨迹 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.06 }}
        viewBox="0 0 1040 860"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-20,200 Q120,180 200,260 Q280,340 350,280"
          stroke="#6FBF8A"
          strokeWidth="1"
          strokeDasharray="4 12"
        />
        <path
          d="M800,-10 Q820,80 780,160 Q740,240 850,300"
          stroke="#A7C1A8"
          strokeWidth="0.8"
          strokeDasharray="3 10"
        />
        <circle cx="180" cy="240" r="2" fill="#6FBF8A" opacity="0.5" />
        <circle cx="800" cy="140" r="1.5" fill="#A7C1A8" opacity="0.4" />
      </svg>
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
          <Star
            className="w-2.5 h-2.5"
            fill="#F28C38"
            stroke="none"
          />
        </motion.div>
      ))}
    </div>
  );
}

// ================================================================
// 环形得分仪表盘 — 大号 220px
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
        {/* 外层光晕 */}
        <div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(111,191,138,0.16) 0%, rgba(111,191,138,0.05) 38%, transparent 66%)",
            filter: "blur(24px)",
          }}
        />
        <div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(167,193,168,0.14) 0%, transparent 55%)",
            filter: "blur(10px)",
          }}
        />

        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="transform -rotate-90 relative z-10"
          style={{ animation: "countUpPulse 3s ease-in-out infinite" }}
        >
          <defs>
            <linearGradient
              id="scoreRingGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6FBF8A" />
              <stop offset="40%" stopColor="#2F7D55" />
              <stop offset="100%" stopColor="#174A38" />
            </linearGradient>
            <filter id="ringGlow2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="endGlow2" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 外层虚线轨道 */}
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius + 8}
            fill="none"
            stroke="rgba(167,193,168,0.14)"
            strokeWidth="0.8"
            strokeDasharray="3 8"
          />

          {/* 背景轨道环 */}
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius}
            fill="none"
            stroke="rgba(167,193,168,0.15)"
            strokeWidth="7"
          />

          {/* 主进度环 */}
          <circle
            cx={svgCenter}
            cy={svgCenter}
            r={ringRadius}
            fill="none"
            stroke="url(#scoreRingGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${fillLength} ${emptyLength}`}
            filter="url(#ringGlow2)"
          />

          {/* 进度末端光点 */}
          {displayScore > 0 && (
            <>
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
                r={5}
                fill="rgba(111,191,138,0.22)"
                filter="url(#endGlow2)"
              />
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
            </>
          )}
        </svg>

        {/* 中心分数 */}
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

        {/* 绕行粒子 */}
        <motion.div
          className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
          style={{
            background: "rgba(111,191,138,0.55)",
            boxShadow: "0 0 8px rgba(111,191,138,0.5)",
          }}
          animate={{
            top: ["8%", "10%", "50%", "90%", "92%", "50%", "8%"],
            left: ["50%", "90%", "92%", "50%", "8%", "10%", "50%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-20"
          style={{
            background: "rgba(167,193,168,0.45)",
            boxShadow: "0 0 5px rgba(167,193,168,0.35)",
          }}
          animate={{
            top: ["92%", "90%", "50%", "8%", "10%", "50%", "92%"],
            left: ["50%", "8%", "10%", "50%", "90%", "92%", "50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 0,
          }}
        />

        {/* 呼吸光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-0"
          style={{
            boxShadow: "0 0 20px rgba(111,191,138,0.18)",
          }}
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

      {/* 标签 + 星星 */}
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

// ---- Info Tooltip ----
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
        onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) =>
          (e.currentTarget.style.color = T.greenMain)
        }
        onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) =>
          (e.currentTarget.style.color = T.textMuted)
        }
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
            <div className="flex flex-col gap-0.5 text-[11px] leading-relaxed" style={{ color: T.textSecondary }}>
              <span>业务场景匹配度 × 25%</span>
              <span className="font-medium" style={{ color: T.orange }}>
                + 产品能力匹配度 × 30%
              </span>
              <span className="font-medium" style={{ color: T.orange }}>
                + 项目经验匹配度 × 30%
              </span>
              <span>+ 岗位加分项匹配度 × 15%</span>
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
// 匹配维度导航面板 — 统一容器 + 轻量 item（Evidence Navigator 风格）
// ================================================================

// ---- 单个维度导航项（科技能量条 + 精致 active 态） ----
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
        scale: 1.006,
        y: -1,
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{ scale: 0.995 }}
      className="relative flex items-stretch gap-3 w-full text-left cursor-pointer rounded-xl px-3 py-2.5 group flex-1"
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(111,191,138,0.10) 0%, rgba(167,193,168,0.04) 60%, rgba(255,255,252,0.28) 100%)"
          : "transparent",
        border: isActive
          ? `2px solid rgba(47,125,85,0.35)`
          : "2px solid transparent",
        boxShadow: isActive
          ? `0 2px 18px ${T.greenSoft}1a, 0 0 0 1px rgba(111,191,138,0.08), 0 0 28px rgba(111,191,138,0.06)`
          : "none",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* ── Active 左侧竖向高亮指示条 ── */}
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

      {/* ── Active 右侧连接箭头（指向证据详情，轻量不抢眼） ── */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -right-[5px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          style={{ width: 10, height: 16 }}
        >
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
          >
            <path
              d="M2 4L6 8L2 12"
              stroke={T.greenSoft}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      )}

      {/* ══════ 左段：icon 底盘 + 标题（固定宽度保证进度条对齐） ══════ */}
      <div
        className="flex items-center gap-2.5 flex-shrink-0 self-center"
        style={{ width: 130 }}
      >
        <motion.div
          animate={isActive ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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

      {/* ══════ 中段：科技感能量进度条 ══════ */}
      <div className="flex-1 flex items-center min-w-0 self-center">
        {/* 轨道 */}
        <div
          className="flex-1 h-[10px] rounded-full relative overflow-hidden"
          style={{
            background: "rgba(167,193,168,0.07)",
            boxShadow:
              "inset 0 2px 5px rgba(0,0,0,0.07), inset 0 1px 1px rgba(0,0,0,0.03), 0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          {/* 轨道微纹理 */}
          <div
            className="absolute inset-0 rounded-full opacity-[0.14]"
            style={{
              background: `repeating-linear-gradient(90deg,
                transparent,
                transparent 2px,
                ${T.greenPale} 2px,
                ${T.greenPale} 3px)`,
            }}
          />

          {/* ── 填充层 ── */}
          <motion.div
            key={`barFill-${dimension.id}-${String(isActive)}`}
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
            {/* 顶部高光线 */}
            <div
              className="absolute top-px left-2 right-4 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 100%)",
              }}
            />

            {/* 中部柔光带 */}
            <div
              className="absolute top-[3px] left-3 right-6 h-[2px] rounded-full opacity-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
              }}
            />

            {/* 流光扫过（克制） */}
            <motion.div
              className="absolute inset-y-0 w-[50%] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.03) 60%, transparent 100%)",
              }}
              animate={{ left: ["-50%", "100%"] }}
              transition={{
                duration: 4.0 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* 末端能量节点 */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full"
              style={{
                background: `radial-gradient(circle, #A7E0B8 0%, ${T.greenSoft} 30%, rgba(111,191,138,0.15) 65%, transparent 75%)`,
              }}
              animate={{
                boxShadow: isActive
                  ? [
                      `0 0 12px ${T.greenSoft}cc, 0 0 24px ${T.greenSoft}59, 0 0 38px ${T.greenPale}1f`,
                      `0 0 18px ${T.greenSoft}ff, 0 0 32px ${T.greenSoft}8c, 0 0 46px ${T.greenPale}40`,
                      `0 0 12px ${T.greenSoft}cc, 0 0 24px ${T.greenSoft}59, 0 0 38px ${T.greenPale}1f`,
                    ]
                  : [
                      `0 0 7px ${T.greenSoft}80, 0 0 14px ${T.greenSoft}33`,
                      `0 0 7px ${T.greenSoft}80, 0 0 14px ${T.greenSoft}33`,
                    ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* ══════ 右段：百分比 + 查看证据（固定宽度保证进度条对齐） ══════ */}
      <div
        className="flex flex-col items-end justify-center gap-0.5 flex-shrink-0"
        style={{ width: 66 }}
      >
        <motion.span
          className="text-[18px] font-extrabold tracking-tight leading-none tabular-nums"
          style={{ color: T.orange }}
          animate={isActive ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {dimension.scorePercent}
        </motion.span>
        <span
          className="inline-flex items-center text-[10px] font-medium rounded-2xl px-2.5 py-1 mt-0.5 select-none transition-all duration-300"
          style={{
            color: isActive ? T.greenDeep : T.greenMain,
            background: isActive
              ? `linear-gradient(135deg, rgba(111,191,138,0.65), rgba(47,125,85,0.45))`
              : "rgba(167,193,168,0.12)",
            border: isActive
              ? `1px solid rgba(111,191,138,0.45)`
              : `1px solid ${T.cardBorder}`,
            boxShadow: isActive
              ? `0 2px 8px ${T.greenSoft}38`
              : "none",
          }}
        >
          查看证据
        </span>
      </div>
    </motion.button>
  );
}

// ---- 匹配维度导航面板容器 ----
function DimensionNavPanel({
  dimensions,
  activeId,
  onSelect,
}: {
  dimensions: MatchDimension[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-[24px] border h-full"
      style={{
        background: "rgba(255,255,252,0.68)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: T.cardBorder,
        boxShadow: T.cardShadow,
      }}
    >
      {/* 面板标题 */}
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

      {/* 分割线 */}
      <div
        className="mx-5 border-t flex-shrink-0"
        style={{ borderColor: T.dividerColor }}
      />

      {/* 维度列表 — 平分高度，占满面板 */}
      <div className="flex-1 flex flex-col px-3 py-0.5 overflow-y-auto">
        {dimensions.map((dim, i) => (
          <div key={dim.id} className="flex flex-col flex-1">
            {i > 0 && (
              <div
                className="mx-4 border-t flex-shrink-0"
                style={{ borderColor: "rgba(120,160,130,0.07)" }}
              />
            )}
            <DimensionNavItem
              dimension={dim}
              isActive={dim.id === activeId}
              onClick={() => onSelect(dim.id)}
              index={i}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ================================================================
// 加载阶段文案
// ================================================================
function getLoadingStage(elapsed: number): {
  title: string;
  subtitle: string;
} {
  if (elapsed < 1)
    return {
      title: "正在识别岗位核心要求...",
      subtitle: "提取 JD 中的关键评估维度与能力项",
    };
  if (elapsed < 3)
    return {
      title: "正在匹配简历经历...",
      subtitle: "逐维度比对 JD 要求与候选人证据",
    };
  if (elapsed < 12)
    return {
      title: "正在生成匹配报告...",
      subtitle: "综合评估各维度匹配度与证据链",
    };
  return {
    title: "分析时间较长，正在继续...",
    subtitle: "深度分析中，请耐心等待",
  };
}

// ================================================================
// 动画变体
// ================================================================
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

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
// 证据详情面板 — 右侧展示 JD 摘录 / 简历证据 / 评分说明
// ================================================================
function EvidenceDetailPanel({
  dimension,
}: {
  dimension: MatchDimension;
}) {
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
      {/* 标题栏 */}
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
        {/* 模块 A：JD 要求摘录 */}
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

        {/* 模块 B：简历证据摘录 */}
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

        {/* 模块 C：评分说明 */}
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

          {/* 匹配原因 — 浅橙色卡片 */}
          <div
            className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{
              background: "rgba(242,140,56,0.04)",
              border: `1px solid rgba(242,140,56,0.10)`,
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

          {/* 扣分原因 — 浅绿色卡片 */}
          <div
            className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{
              background: "rgba(111,191,138,0.06)",
              border: `1px solid rgba(111,191,138,0.12)`,
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

          {/* 该维度得分 */}
          <div
            className="flex items-center justify-end gap-2 pt-2 border-t"
            style={{ borderColor: T.dividerColor }}
          >
            <span
              className="text-[10px]"
              style={{ color: T.textMuted }}
            >
              该维度得分
            </span>
            <span
              className="text-[20px] font-extrabold tracking-tight"
              style={{ color: T.orange }}
            >
              {dimension.finalScore}
            </span>
            <span
              className="text-[11px]"
              style={{ color: T.textMuted }}
            >
              / 100
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ================================================================
// 底部待确认点 — 通栏展示
// ================================================================
function ConcernsPanel({ concerns }: { concerns: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-1.5 rounded-[18px] border p-2.5 flex-shrink-0"
      style={{
        background: "rgba(255,255,255,0.82)",
        borderColor: "rgba(74,132,120,0.16)",
        boxShadow: "0 1px 3px rgba(47,111,100,0.03), 0 6px 18px rgba(47,111,100,0.04)",
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
          {concerns[0]}
        </p>
      </div>
    </motion.div>
  );
}

// ================================================================
// 主组件
// ================================================================
export default function JdMatchModal({
  isOpen,
  onClose,
  state,
  result,
  onRetry,
}: JdMatchModalProps) {
  const loadingStartRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [activeDimensionId, setActiveDimensionId] =
    useState("businessScenario");

  useEffect(() => {
    if (state === "loading") {
      loadingStartRef.current = Date.now();
      setElapsed(0);
      const timer = setInterval(() => {
        setElapsed((Date.now() - loadingStartRef.current) / 1000);
      }, 200);
      return () => clearInterval(timer);
    }
  }, [state]);

  useEffect(() => {
    if (isOpen && state === "result" && result) {
      setActiveDimensionId(result.dimensions[0]?.id || "businessScenario");
    }
  }, [isOpen, state, result]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const activeDimension = result?.dimensions.find(
    (d) => d.id === activeDimensionId,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 遮罩 */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{
              background: "rgba(20, 40, 30, 0.28)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={onClose}
          />

          {/* 模态面板 */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="AI 岗位匹配报告"
            className="relative z-10 flex flex-col overflow-hidden"
            style={{
              width: "min(1040px, 94vw)",
              height: "min(860px, 88vh)",
              background: T.modalBg,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(120,160,130,0.22)",
              borderRadius: "36px",
              boxShadow:
                "0 30px 80px rgba(20,45,35,0.28), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* 背景氛围 */}
            <BackgroundAtmosphere />

            {/* ======== Loading ======== */}
            {state === "loading" &&
              (() => {
                const stage = getLoadingStage(elapsed);
                return (
                  <div className="flex flex-col items-center justify-center flex-1 gap-5 relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="flex items-center justify-center w-16 h-16 rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(111,191,138,0.15), rgba(47,125,85,0.08))",
                        boxShadow: "0 0 30px rgba(111,191,138,0.15)",
                      }}
                    >
                      <Loader2
                        className="w-8 h-8"
                        style={{ color: T.greenMain }}
                      />
                    </motion.div>
                    <motion.p
                      key={stage.title}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[15px] font-semibold"
                      style={{ color: T.textMain }}
                    >
                      {stage.title}
                    </motion.p>
                    <motion.p
                      key={stage.subtitle}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="text-[13px]"
                      style={{ color: T.textMuted }}
                    >
                      {stage.subtitle}
                    </motion.p>
                    <div className="flex gap-2 mt-2">
                      {[0, 1, 2, 3].map((i) => {
                        const thresholds = [0, 1, 3, 12];
                        const active = elapsed >= thresholds[i];
                        return (
                          <span
                            key={i}
                            className={`block w-2 h-2 rounded-full transition-all duration-500`}
                            style={{
                              background: active
                                ? T.greenMain
                                : T.greenPale,
                              boxShadow: active
                                ? `0 0 8px ${T.greenMain}80`
                                : "none",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            {/* ======== Error ======== */}
            {state === "error" && (
              <div className="flex flex-col items-center justify-center flex-1 gap-5 relative z-10">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl"
                  style={{
                    background: "rgba(242,140,56,0.12)",
                  }}
                >
                  <AlertCircle
                    className="w-8 h-8"
                    style={{ color: T.orange }}
                  />
                </div>
                <div className="text-center">
                  <p
                    className="text-[17px] font-semibold"
                    style={{ color: T.greenDeep }}
                  >
                    分析失败
                  </p>
                  <p
                    className="text-[13px] mt-1.5"
                    style={{ color: T.textSecondary }}
                  >
                    请检查网络连接后重试
                  </p>
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${T.greenDeep}, ${T.greenMain})`,
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    重试
                  </button>
                )}
              </div>
            )}

            {/* ======== Result ======== */}
            {state === "result" && result && (
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-6 py-2.5 gap-1.5 relative z-10">
                {/* ---- Header ---- */}
                <motion.header
                  variants={staggerItem(0.05)}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center justify-between flex-shrink-0"
                >
                  <div className="flex items-center gap-4">
                    {/* AI 发光图标 */}
                    <motion.div
                      className="flex items-center justify-center rounded-2xl flex-shrink-0"
                      style={{
                        width: 36,
                        height: 42,
                        background:
                          "linear-gradient(135deg, rgba(111,191,138,0.22), rgba(47,125,85,0.10))",
                        boxShadow:
                          "0 0 24px rgba(111,191,138,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
                        border: "1px solid rgba(120,160,130,0.18)",
                      }}
                      whileHover={{ scale: 1.05 }}
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
                        className="w-5 h-5"
                        style={{ color: T.greenDeep }}
                      />
                    </motion.div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h2
                          className="text-[20px] font-extrabold tracking-tight leading-none"
                          style={{ color: T.greenDeep }}
                        >
                          AI 岗位匹配报告
                        </h2>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: "rgba(167,193,168,0.18)",
                            color: T.greenMain,
                            border: `1px solid ${T.cardBorder}`,
                          }}
                        >
                          基于岗位 JD 与简历证据分析
                        </span>
                    </div>
                  </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 分析完成状态 */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                      style={{
                        background: "rgba(111,191,138,0.10)",
                        color: T.greenMain,
                        border: `1px solid ${T.cardBorder}`,
                      }}
                    >
                      <CheckCircle2
                        className="w-3 h-3"
                        style={{ color: T.greenSoft }}
                      />
                      分析完成
                    </span>
                    {/* 关闭按钮 */}
                    <motion.button
                      onClick={onClose}
                      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                      style={{
                        color: T.textMuted,
                        background: "rgba(167,193,168,0.06)",
                      }}
                      whileHover={{
                        background: "rgba(167,193,168,0.16)",
                        color: T.greenDeep,
                        rotate: 90,
                      }}
                      aria-label="关闭"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.header>

                {/* ---- 第一行：三栏 — 综合分 | 匹配结论 | 匹配亮点 ---- */}
                <motion.div
                  variants={staggerItem(0.12)}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-3 flex-shrink-0"
                  style={{ gridTemplateColumns: "210px 1fr 1fr" }}
                >
                  {/* 左侧：ScoreRing */}
                  <div
                    className="relative flex items-center justify-center py-2 px-2"
                  >
                    <ScoreRing score={result.overallScore} />
                  </div>

                  {/* 中间：匹配结论 */}
                  <motion.div
                    className="relative flex flex-col gap-1 rounded-[18px] border p-2.5 group"
                    style={{
                      background: T.cardBg,
                      borderColor: T.cardBorder,
                      boxShadow: T.cardShadow,
                    }}
                    whileHover={{ y: -4, boxShadow: T.cardShadowHover, borderColor: T.cardBorderHover }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                      {result.conclusion
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
                    {/* 光泽流动效果 */}
                    <div
                      className="absolute inset-0 rounded-[18px] pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 48%, transparent 62%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmerSweep 1.5s ease-in-out",
                      }}
                    />
                  </motion.div>

                  {/* 右侧：匹配亮点 */}
                  <motion.div
                    className="relative flex flex-col gap-1 rounded-[18px] border p-2.5"
                    style={{
                      background: T.cardBg,
                      borderColor: T.cardBorder,
                      boxShadow: T.cardShadow,
                    }}
                    whileHover={{ y: -4, boxShadow: T.cardShadowHover, borderColor: T.cardBorderHover }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                      {result.highlights.slice(0, 3).map((h, i) => (
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

                {/* ---- 主交互区：左侧匹配维度导航面板 + 右侧证据详情面板 ---- */}
                <motion.div
                  variants={staggerItem(0.25)}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-3 flex-1 min-h-0"
                  style={{ gridTemplateColumns: "56% 44%" }}
                >
                  {/* 左侧：匹配维度导航面板（统一容器） */}
                  <DimensionNavPanel
                    dimensions={result.dimensions}
                    activeId={activeDimensionId}
                    onSelect={setActiveDimensionId}
                  />

                  {/* 右侧：证据详情面板 */}
                  <div className="overflow-y-auto">
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

                {/* ---- 底部：待确认点通栏 ---- */}
                <ConcernsPanel concerns={result.concerns} />

                {/* ---- 底部小字 ---- */}
                <motion.p
                  variants={staggerItem(0.45)}
                  initial="hidden"
                  animate="visible"
                  className="text-center text-[10px] flex-shrink-0 pb-0.5"
                  style={{ color: T.textMuted }}
                >
                  以上分析由 AI 基于简历内容与 JD 要求自动生成，仅供参考
                </motion.p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

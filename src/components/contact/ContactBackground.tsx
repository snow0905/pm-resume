"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

/** 浮动粒子 */
function FloatingParticles() {
  const particles = [
    { cx: "10%", cy: "20%", r: 3, delay: 0, dur: 7, opacity: 0.18 },
    { cx: "78%", cy: "15%", r: 4, delay: 1.2, dur: 8, opacity: 0.14 },
    { cx: "42%", cy: "78%", r: 2.5, delay: 2.5, dur: 6.5, opacity: 0.2 },
    { cx: "65%", cy: "55%", r: 3.5, delay: 0.8, dur: 7.5, opacity: 0.13 },
    { cx: "25%", cy: "82%", r: 2, delay: 3.2, dur: 6, opacity: 0.22 },
    { cx: "88%", cy: "38%", r: 3, delay: 1.8, dur: 8.5, opacity: 0.15 },
    { cx: "6%", cy: "62%", r: 2.8, delay: 4.0, dur: 7.2, opacity: 0.17 },
    { cx: "52%", cy: "10%", r: 3.2, delay: 2.0, dur: 9, opacity: 0.12 },
    { cx: "72%", cy: "72%", r: 2.2, delay: 3.8, dur: 6.8, opacity: 0.19 },
    { cx: "33%", cy: "42%", r: 2.6, delay: 0.5, dur: 8.2, opacity: 0.16 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.circle
          key={`p-${i}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="var(--green-soft)"
          initial={{ opacity: p.opacity * 0.3 }}
          animate={{
            opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3],
            y: [0, -14, 0],
            x: [0, 8, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 暖橙点缀 */}
      <motion.circle
        cx="74%"
        cy="66%"
        r="4.5"
        fill="var(--orange)"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.05, 0.16, 0.05] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="30%"
        cy="30%"
        r="2.5"
        fill="var(--orange)"
        initial={{ opacity: 0.08 }}
        animate={{ opacity: [0.04, 0.13, 0.04] }}
        transition={{ duration: 5.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="56%"
        cy="84%"
        r="3"
        fill="var(--orange)"
        initial={{ opacity: 0.09 }}
        animate={{ opacity: [0.04, 0.14, 0.04] }}
        transition={{ duration: 6, delay: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/** 纸飞机 + 虚线轨迹 */
function PaperPlane() {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{ top: "14%", left: "48%" }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 虚线轨迹 */}
      <svg
        width="200"
        height="70"
        viewBox="0 0 200 70"
        className="absolute -left-40 top-2"
        style={{ overflow: "visible" }}
      >
        <line
          x1="180"
          y1="35"
          x2="15"
          y2="10"
          stroke="var(--green-soft)"
          strokeWidth="1"
          strokeDasharray="6 8"
          opacity="0.2"
        />
      </svg>

      {/* 纸飞机 */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "rgba(167, 193, 168, 0.06)",
        }}
      >
        <Send
          size={18}
          color="var(--green-soft)"
          style={{ transform: "rotate(-30deg)", opacity: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

/** 多段弧线轨迹 */
function ArcTraces() {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ top: "5%", right: "3%", width: 380, height: 400, overflow: "visible" }}
      viewBox="0 0 380 400"
    >
      <motion.path
        d="M300,30 C230,110 270,220 190,310"
        fill="none"
        stroke="var(--green-soft)"
        strokeWidth="0.8"
        opacity={0.12}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M340,15 C270,95 310,200 230,290"
        fill="none"
        stroke="var(--green-pale)"
        strokeWidth="0.6"
        opacity={0.08}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.8, delay: 1.0, ease: "easeInOut" }}
      />
      <motion.path
        d="M260,50 C190,130 230,240 150,330"
        fill="none"
        stroke="var(--green-soft)"
        strokeWidth="0.5"
        opacity={0.09}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.0, delay: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** 底部流线 */
function BottomFlowLines() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: 140 }}
    >
      <svg
        width="100%"
        height="140"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0"
      >
        <defs>
          <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--green-soft)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--green-soft)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--green-pale)" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--green-soft)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--green-soft)" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* 主波浪 */}
        <motion.path
          d="M0,90 C200,50 400,110 720,80 C1040,50 1200,100 1440,70 L1440,140 L0,140 Z"
          fill="url(#flowGrad1)"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 第二条更浅的波浪 */}
        <motion.path
          d="M0,100 C300,60 500,100 800,90 C1100,80 1300,110 1440,85 L1440,140 L0,140 Z"
          fill="url(#flowGrad2)"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export default function ContactBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 基础渐变底 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 74% 24%, rgba(167, 193, 168, 0.10), transparent 44%),
            radial-gradient(circle at 26% 70%, rgba(241, 242, 235, 0.7), transparent 40%),
            radial-gradient(circle at 80% 76%, rgba(242, 155, 88, 0.04), transparent 32%),
            linear-gradient(180deg, #FBFBF4 0%, #EEF1E3 100%)
          `,
        }}
      />

      {/* 右上点阵 */}
      <div
        className="absolute"
        style={{
          top: "10%",
          right: "5%",
          width: 240,
          height: 300,
          backgroundImage:
            "radial-gradient(circle, rgba(167,193,168,0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* 左下小点阵 */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "3%",
          width: 160,
          height: 200,
          backgroundImage:
            "radial-gradient(circle, rgba(167,193,168,0.12) 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* 弧线轨迹 */}
      <ArcTraces />

      {/* 粒子 */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        <FloatingParticles />
      </svg>

      {/* 纸飞机 */}
      <PaperPlane />

      {/* 底部流线 */}
      <BottomFlowLines />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

/**
 * CareerBackground — 全屏背景装饰层
 * 右侧光晕、弧形轨迹线、底部波形光带、点阵、微光粒子
 * 绝对定位，pointer-events-none，z-0
 */
export default function CareerBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* —— 右侧大面积淡绿色光晕 —— */}
      <div
        className="absolute top-0 right-0 w-[55%] h-[70%]"
        style={{
          background:
            "radial-gradient(ellipse at 78% 36%, rgba(167,193,168,0.2), transparent 55%)",
        }}
      />
      <div
        className="absolute top-[20%] right-[5%] w-[40%] h-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(167,193,168,0.14), transparent 60%)",
        }}
      />

      {/* —— 底部柔和波形光带 —— */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{
          background:
            "linear-gradient(0deg, rgba(238,239,224,0.7) 0%, transparent 100%)",
        }}
      />

      {/* —— 右侧弧形轨迹线（SVG） —— */}
      <svg
        className="absolute top-0 right-0 w-[50%] h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
      >
        {/* 大弧线 — 包裹当前卡片 */}
        <motion.path
          d="M580,120 C380,180 200,380 220,620"
          fill="none"
          stroke="rgba(167,193,168,0.22)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M560,140 C360,200 220,380 240,600"
          fill="none"
          stroke="rgba(167,193,168,0.14)"
          strokeWidth="0.8"
          strokeDasharray="3 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        {/* 第三道更淡的弧线 */}
        <motion.path
          d="M540,160 C380,220 260,360 260,560"
          fill="none"
          stroke="rgba(167,193,168,0.1)"
          strokeWidth="0.6"
          strokeDasharray="2 14"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.7, ease: "easeInOut" }}
        />
      </svg>

      {/* —— 右上极淡点阵 —— */}
      <div
        className="absolute top-[8%] right-[8%] w-[280px] h-[200px] opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(167,193,168,0.3) 0.7px, transparent 0.7px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* —— 散布微光粒子 —— */}
      {[
        { cx: "72%", cy: "18%", size: 4, delay: 0 },
        { cx: "82%", cy: "32%", size: 5, delay: 1.2 },
        { cx: "65%", cy: "44%", size: 3, delay: 0.7 },
        { cx: "76%", cy: "52%", size: 4, delay: 1.8 },
        { cx: "58%", cy: "28%", size: 3, delay: 0.4 },
        { cx: "88%", cy: "40%", size: 5, delay: 1.5 },
        { cx: "70%", cy: "60%", size: 4, delay: 2.0 },
        { cx: "48%", cy: "22%", size: 3, delay: 0.9 },
        { cx: "54%", cy: "55%", size: 5, delay: 1.1 },
        { cx: "38%", cy: "48%", size: 3, delay: 1.7 },
      ].map((p, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            left: p.cx,
            top: p.cy,
            width: p.size,
            height: p.size,
            background: "rgba(167,193,168,0.35)",
          }}
          animate={{
            y: [0, -5, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4.5 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

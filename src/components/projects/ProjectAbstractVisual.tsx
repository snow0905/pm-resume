"use client";

import { motion } from "framer-motion";

/**
 * ProjectAbstractVisual — 横向抽象氛围视觉图
 * 位于标题下方、项目卡片背后，横向贯穿页面
 * 绝对定位，pointer-events-none，z-0
 */
export default function ProjectAbstractVisual() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* —— 大半径绿色光晕（标题与卡片之间的氛围） —— */}
      <div
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[90%] h-[260px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(167,193,168,0.22), transparent 75%)",
        }}
      />
      <div
        className="absolute top-[15%] left-[15%] w-[35%] h-[200px] opacity-30"
        style={{
          background:
            "radial-gradient(circle at 40% 50%, rgba(167,193,168,0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute top-[10%] right-[10%] w-[30%] h-[180px] opacity-25"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(129,154,145,0.14), transparent 65%)",
        }}
      />

      {/* —— 极淡网格点阵 —— */}
      <div
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[88%] h-[240px] opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(167,193,168,0.22) 0.8px, transparent 0.8px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* —— SVG 多层柔和波形曲线 —— */}
      <svg
        className="absolute top-[5%] left-0 w-full h-[250px]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 260"
      >
        {/* 第一层：较粗低频波 */}
        <path
          d="M0,140 C180,100 360,170 540,130 C720,90 900,160 1080,120 C1260,80 1440,140 1440,140"
          fill="none"
          stroke="rgba(167,193,168,0.28)"
          strokeWidth="1.8"
        />
        {/* 第二层：中频波 */}
        <path
          d="M0,160 C150,130 300,190 500,150 C700,110 850,180 1050,145 C1200,120 1350,165 1440,155"
          fill="none"
          stroke="rgba(167,193,168,0.2)"
          strokeWidth="1.2"
        />
        {/* 第三层：高频小波 */}
        <path
          d="M0,175 C120,155 240,195 380,170 C520,145 640,190 780,168 C920,146 1040,185 1180,165 C1300,148 1400,178 1440,172"
          fill="none"
          stroke="rgba(129,154,145,0.16)"
          strokeWidth="0.8"
        />
        {/* 第四层：直线横向流线 */}
        <path
          d="M0,195 Q360,185 720,195 T1440,195"
          fill="none"
          stroke="rgba(167,193,168,0.14)"
          strokeWidth="0.6"
          strokeDasharray="4 12"
        />
        <path
          d="M0,210 Q400,200 800,210 T1440,210"
          fill="none"
          stroke="rgba(129,154,145,0.12)"
          strokeWidth="0.5"
          strokeDasharray="3 16"
        />
      </svg>

      {/* —— 漂浮绿色圆点粒子 —— */}
      {[
        { cx: "6%", cy: "18%", size: 5, delay: 0 },
        { cx: "15%", cy: "28%", size: 7, delay: 1.3 },
        { cx: "25%", cy: "12%", size: 4, delay: 0.7 },
        { cx: "38%", cy: "22%", size: 6, delay: 1.9 },
        { cx: "48%", cy: "15%", size: 5, delay: 0.4 },
        { cx: "55%", cy: "25%", size: 8, delay: 1.6 },
        { cx: "62%", cy: "10%", size: 4, delay: 2.1 },
        { cx: "72%", cy: "20%", size: 6, delay: 0.9 },
        { cx: "80%", cy: "28%", size: 5, delay: 1.1 },
        { cx: "90%", cy: "14%", size: 7, delay: 1.7 },
        { cx: "94%", cy: "24%", size: 4, delay: 0.3 },
      ].map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{
            left: dot.cx,
            top: dot.cy,
            width: dot.size,
            height: dot.size,
            background: "rgba(167,193,168,0.45)",
          }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 4.5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
      ))}

      {/* —— 橙色点缀节点 —— */}
      {[
        { cx: "22%", cy: "30%", size: 8, delay: 0 },
        { cx: "52%", cy: "18%", size: 10, delay: 1.8 },
        { cx: "76%", cy: "26%", size: 7, delay: 0.8 },
      ].map((node, i) => (
        <motion.div
          key={`orange-${i}`}
          className="absolute rounded-full"
          style={{
            left: node.cx,
            top: node.cy,
            width: node.size,
            height: node.size,
            background: "rgba(242,155,88,0.28)",
            boxShadow: "0 0 10px rgba(242,155,88,0.12)",
          }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.42, 0.25],
          }}
          transition={{
            duration: 3.8 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: node.delay,
          }}
        />
      ))}

      {/* —— 半透明圆形 / 球体 —— */}
      {[
        { cx: "12%", cy: "22%", size: 40, delay: 0 },
        { cx: "44%", cy: "12%", size: 32, delay: 1.2 },
        { cx: "68%", cy: "20%", size: 48, delay: 0.5 },
        { cx: "85%", cy: "15%", size: 36, delay: 1.6 },
      ].map((sphere, i) => (
        <motion.div
          key={`sphere-${i}`}
          className="absolute rounded-full"
          style={{
            left: sphere.cx,
            top: sphere.cy,
            width: sphere.size,
            height: sphere.size,
            background:
              "radial-gradient(circle at 35% 35%, rgba(167,193,168,0.32), rgba(167,193,168,0.06) 70%)",
          }}
          animate={{
            y: [0, -4, 0],
            opacity: [0.35, 0.5, 0.35],
          }}
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sphere.delay,
          }}
        />
      ))}

      {/* —— 小立方体装饰 —— */}
      {[
        { cx: "30%", cy: "32%", size: 10, delay: 0 },
        { cx: "58%", cy: "28%", size: 8, delay: 1.4 },
        { cx: "78%", cy: "34%", size: 12, delay: 2.0 },
      ].map((cube, i) => (
        <motion.div
          key={`cube-${i}`}
          className="absolute rounded-sm"
          style={{
            left: cube.cx,
            top: cube.cy,
            width: cube.size,
            height: cube.size,
            border: "1px solid rgba(167,193,168,0.3)",
            background: "rgba(167,193,168,0.08)",
            transform: "rotate(45deg)",
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [45, 50, 45],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5.5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cube.delay,
          }}
        />
      ))}
    </div>
  );
}

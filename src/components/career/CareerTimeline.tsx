"use client";

import { motion } from "framer-motion";
import type { ExperienceItem } from "@/types";

interface CareerTimelineProps {
  experiences: ExperienceItem[];
  activeExperienceId: string;
}

/** 每个节点在轨道上的水平位置 */
const nodePositionMap: Record<string, string> = {
  start: "18%",
  growth: "50%",
  current: "82%",
};

export default function CareerTimeline({
  experiences,
  activeExperienceId,
}: CareerTimelineProps) {
  const currentExp = experiences.find((e) => e.status === "current");
  const others = experiences.filter((e) => e.status !== "current");
  const sorted = [...others, currentExp!].filter(Boolean);

  return (
    <div className="absolute left-[9%] right-[8%] bottom-[80px] z-20">
      {/* ==== 主发光轨道 ==== */}
      <div className="relative h-5">
        {/* 外层发光轨道 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(129,154,145,0.15), rgba(129,154,145,0.42), rgba(242,155,88,0.36), rgba(129,154,145,0.18))",
            boxShadow:
              "0 0 30px rgba(167,193,168,0.35), inset 0 0 12px rgba(255,255,255,0.7)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        />

        {/* 内层亮线轨道 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: "7px 16px",
            background: "rgba(255,255,255,0.72)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 0.61, 0.36, 1] }}
        />

        {/* ==== 光流效果 ==== */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.5) 60%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["-200% center", "200% center"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5,
          }}
        />

        {/* ==== 暖橙色光晕位置跟随 active 节点 ==== */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full pointer-events-none"
          style={{
            left: nodePositionMap[activeExperienceId] ?? "82%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(242,155,88,0.28), transparent 65%)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ==== 三个节点 ==== */}
        <div className="absolute inset-0 flex items-center">
          {sorted.map((exp, i) => {
            const isActive = exp.id === activeExperienceId;
            const left = nodePositionMap[exp.id] ?? "50%";

            return (
              <motion.div
                key={exp.id}
                className="absolute flex flex-col items-center"
                style={{ left, top: "50%", transform: "translateX(-50%)" }}
              >
                {/* 当前节点上方垂直线 */}
                {isActive && (
                  <motion.div
                    className="w-px h-20 mb-1"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(242,155,88,0.3), transparent)",
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  />
                )}

                {/* 节点圆 */}
                <motion.div
                  className={`relative flex items-center justify-center z-10 ${isActive ? "w-8 h-8" : "w-5 h-5"}`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: isActive ? 0.9 : 0.6 + i * 0.1,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  animate={
                    isActive
                      ? { scale: [1, 1.16, 1] }
                      : { scale: 1 }
                  }
                  style={{
                    transition:
                      "transform 360ms ease, box-shadow 360ms ease, border-color 360ms ease, background 360ms ease",
                  }}
                >
                  {isActive ? (
                    <>
                      {/* 同心圆光晕 */}
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: "2px solid rgba(242,155,88,0.7)",
                          boxShadow:
                            "0 0 0 10px rgba(242,155,88,0.16), 0 0 34px rgba(242,155,88,0.75)",
                        }}
                        animate={{
                          opacity: [0.7, 1, 0.7],
                          boxShadow: [
                            "0 0 0 8px rgba(242,155,88,0.18), 0 0 30px rgba(242,155,88,0.6)",
                            "0 0 0 14px rgba(242,155,88,0.08), 0 0 44px rgba(242,155,88,0.85)",
                            "0 0 0 8px rgba(242,155,88,0.18), 0 0 30px rgba(242,155,88,0.6)",
                          ],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {/* 实心圆 */}
                      <span className="w-3 h-3 rounded-full bg-[var(--orange)] relative z-10" />
                    </>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--green-soft)]" />
                  )}
                </motion.div>

                {/* 节点下方标签 */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[10px] font-semibold tracking-wider ${isActive
                      ? "text-[var(--orange)]"
                      : "text-[var(--text-muted)]"
                      }`}
                    style={{
                      transition: "color 360ms ease",
                    }}
                  >
                    {exp.stage}
                  </span>
                  <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-mono tracking-tight">
                    {exp.period.replace(/\s/g, "")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==== 右侧箭头暗示 ==== */}
      <motion.div
        className="absolute -right-6 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 6h12M10 2l4 4-4 4"
            stroke="rgba(129,154,145,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

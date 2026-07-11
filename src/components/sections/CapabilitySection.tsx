"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { capabilities } from "@/data/capabilities";
import SectionHeader from "@/components/common/SectionHeader";
import CapabilityCore from "@/components/capability/CapabilityCore";
import CapabilityCard from "@/components/capability/CapabilityCard";

/** 四张卡片在十字布局中的方位 */
type Position = "top" | "right" | "bottom" | "left";

const positionMap: Record<Position, { col: string; row: string }> = {
  top: { col: "col-start-2", row: "row-start-1" },
  right: { col: "col-start-3", row: "row-start-2" },
  bottom: { col: "col-start-2", row: "row-start-3" },
  left: { col: "col-start-1", row: "row-start-2" },
};

function getPosition(index: number): Position {
  const positions: Position[] = ["top", "right", "bottom", "left"];
  return positions[index % 4];
}

/**
 * CapabilitySection — 第五屏：能力画像
 * 中央核心模块 + 四张围绕的能力卡片（十字布局）+ SVG 连接线
 */
export default function CapabilitySection() {
  const [activeCapabilityId, setActiveCapabilityId] = useState<string | null>(
    null,
  );

  const activePhrase = useMemo(() => {
    if (!activeCapabilityId) return null;
    const cap = capabilities.find((c) => c.id === activeCapabilityId);
    return cap?.phrase ?? null;
  }, [activeCapabilityId]);

  return (
    <section
      id="capability"
      className="relative section-bg min-h-screen flex items-center py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden snap-section"
    >
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <SectionHeader
          label="CAPABILITY MAP"
          title="这些经历，沉淀成了我的产品能力"
          subtitle="我关注的不只是完成需求，而是把复杂问题拆清、把方案推进落地，并持续探索更高效的实现方式。"
        />

        {/* ===== 中央 + 四张卡片的十字布局 ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-16"
        >
          {/* --- SVG 连接线层 --- */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ minHeight: "520px" }}
          >
            <svg
              viewBox="0 0 500 520"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/*
                四张卡片的端点位置（相对于中央核心）：
                - top:    (250, 60)
                - right:  (400, 260)
                - bottom: (250, 460)
                - left:   (100, 260)
                中央核心位于 (250, 260)
              */}
              {[
                { id: capabilities[0]?.id, x1: 250, y1: 260, x2: 250, y2: 65 },
                { id: capabilities[1]?.id, x1: 250, y1: 260, x2: 395, y2: 260 },
                { id: capabilities[2]?.id, x1: 250, y1: 260, x2: 250, y2: 455 },
                { id: capabilities[3]?.id, x1: 250, y1: 260, x2: 105, y2: 260 },
              ].map((line) => {
                const isActive = line.id === activeCapabilityId;
                return (
                  <motion.line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={
                      isActive ? "var(--green-main)" : "var(--green-soft)"
                    }
                    strokeWidth={isActive ? 2.5 : 1.2}
                    strokeOpacity={isActive ? 0.7 : 0.35}
                    strokeDasharray={isActive ? "0" : "5 6"}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  />
                );
              })}
            </svg>
          </svg>

          {/* --- CSS Grid 十字布局 (3x3) --- */}
          <div
            className="relative z-20 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] gap-4 md:gap-6 items-center justify-items-center"
            style={{ minHeight: "520px" }}
          >
            {/* 四张卡片按照 top/right/bottom/left 填充 */}
            {capabilities.map((cap, i) => {
              const pos = getPosition(i);
              const { col, row } = positionMap[pos];

              return (
                <motion.div
                  key={cap.id}
                  className={`${col} ${row} w-full max-w-[260px]`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: 0.4 + i * 0.15,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <CapabilityCard
                    item={cap}
                    index={i}
                    isActive={activeCapabilityId === cap.id}
                    onMouseEnter={() => setActiveCapabilityId(cap.id)}
                    onMouseLeave={() => setActiveCapabilityId(null)}
                    onFocus={() => setActiveCapabilityId(cap.id)}
                  />
                </motion.div>
              );
            })}

            {/* 中央核心模块 (col-start-2, row-start-2) */}
            <motion.div
              className="col-start-2 row-start-2 z-30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <CapabilityCore activePhrase={activePhrase} />
            </motion.div>
          </div>
        </motion.div>

        {/* ===== 底部总结句 ===== */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center text-[var(--text-muted)] text-base italic leading-relaxed"
        >
          理解问题、定义方案、推动落地、快速验证&mdash;&mdash;这是我做产品的基本方式。
        </motion.p>
      </div>
    </section>
  );
}

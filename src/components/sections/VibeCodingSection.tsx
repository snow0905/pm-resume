"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { vibeProjects } from "@/data/vibeProjects";
import SectionHeader from "@/components/common/SectionHeader";
import CardSwap from "@/components/vibe/CardSwap";
import VibeTextCard from "@/components/vibe/VibeTextCard";
import VibeVisualCard from "@/components/vibe/VibeVisualCard";

/**
 * VibeCodingSection — 第四屏：Vibe Coding
 *
 * 左右双栏布局：
 * - 左侧：两个项目的文字介绍卡片，hover 预览 / click 选中
 * - 右侧：CardSwap 堆叠交换视觉卡片，与左侧联动
 *
 * 状态管理：
 * - selectedIndex：用户点击确认的选中项目
 * - previewIndex：hover 时临时预览的项目
 * - activeIndex = previewIndex ?? selectedIndex（唯一状态源）
 */
export default function VibeCodingSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const activeIndex = previewIndex ?? selectedIndex;

  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardEnter = useCallback((index: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setPreviewIndex(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    // 小延迟防止在相邻卡片间快速移动时闪烁
    leaveTimeoutRef.current = setTimeout(() => {
      setPreviewIndex(null);
    }, 150);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setPreviewIndex(null);
  }, []);

  const handleSwapClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setPreviewIndex(null);
  }, []);

  return (
    <section
      id="vibe"
      className="relative section-bg-alt min-h-screen flex items-center py-24 md:py-32 px-6 md:px-12 lg:px-20 snap-section"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* ===== 标题区 ===== */}
        <SectionHeader
          label="VIBE CODING"
          title="The Creator"
          subtitle="从产品想法到可交互 Demo，用 AI 快速验证，体现产品思维与实践能力的完整闭环。"
        />

          {/* ===== 双栏布局 ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
          {/* ===== 左侧：文字介绍卡片 ===== */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {vibeProjects.map((project, index) => (
              <VibeTextCard
                key={project.id}
                project={project}
                isSelected={selectedIndex === index}
                isPreviewed={previewIndex === index}
                onMouseEnter={() => handleCardEnter(index)}
                onMouseLeave={handleCardLeave}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </motion.div>

          {/* ===== 右侧：CardSwap 视觉展示 ===== */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <CardSwap
              activeIndex={activeIndex}
              width={600}
              height={440}
              cardDistance={52}
              verticalDistance={80}
              delay={4000}
              pauseOnHover={true}
              easing="smooth"
              skewAmount={0}
              onCardClick={handleSwapClick}
            >
              {vibeProjects.map((project) => (
                <VibeVisualCard
                  key={project.id}
                  project={project}
                  isFront={false}
                />
              ))}
            </CardSwap>
          </motion.div>
        </div>

        {/* ===== 底部过渡文案 ===== */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 text-center text-[var(--text-muted)] text-sm italic"
        >
          这些正式项目与 AI 实践，最终沉淀成了我的产品能力。
        </motion.p>
      </div>
    </section>
  );
}

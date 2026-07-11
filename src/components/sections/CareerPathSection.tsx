"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { experiences } from "@/data/experiences";
import type { ExperienceItem } from "@/types";
import CareerBackground from "@/components/career/CareerBackground";
import CareerCards from "@/components/career/CareerCards";
import CareerTimeline from "@/components/career/CareerTimeline";
import CareerDetailDrawer from "@/components/career/CareerDetailDrawer";
import ShinyTitle from "@/components/common/ShinyTitle";

/**
 * CareerPathSection — 第二屏：职业路径
 *
 * 16:9 首屏式构图，min-height: 100vh
 * hover 切换 active 经历卡片 → 卡片聚焦/后退 + 时间轴节点联动
 * 点击「查看详情」→ 右侧 Drawer 展示完整经历
 */
export default function CareerPathSection() {
  const [activeExperienceId, setActiveExperienceId] = useState("current");
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceItem | null>(null);

  // Drawer 打开时锁定外层滚动
  useEffect(() => {
    const html = document.documentElement;
    if (selectedExperience !== null) {
      html.classList.add("scroll-locked");
    } else {
      html.classList.remove("scroll-locked");
    }
    return () => html.classList.remove("scroll-locked");
  }, [selectedExperience]);

  return (
    <section
      id="career"
      className="relative min-h-screen flex items-center overflow-hidden snap-section"
      style={{
        background: `
          radial-gradient(circle at 78% 36%, rgba(167,193,168,0.22), transparent 34%),
          radial-gradient(circle at 42% 82%, rgba(238,239,224,0.9), transparent 36%),
          linear-gradient(180deg, #fbfbf4 0%, #eef1e3 100%)
        `,
      }}
    >
      {/* ===== 背景装饰层 ===== */}
      <CareerBackground />

      {/* ===== 自定义标题区（左上角 absolute） ===== */}
      <motion.div
        className="absolute z-10"
        style={{ left: "80px", top: "70px" }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--text-muted)] mb-3 block">
          CAREER PATH
        </span>
        <ShinyTitle
          as="h2"
          className="text-3xl md:text-4xl font-extrabold leading-none mb-5"
        >
          我的工作经历
        </ShinyTitle>
        <p
          className="text-[var(--text-secondary)] leading-relaxed"
          style={{
            maxWidth: "720px",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            lineHeight: "1.8",
          }}
        >
          每一段经历，都让我更清楚如何把复杂问题转化为可执行的产品方案。
        </p>
      </motion.div>

      {/* ===== 三张经历卡片（absolute 定位，hover 切换 active） ===== */}
      <CareerCards
        experiences={experiences}
        activeId={activeExperienceId}
        onHover={setActiveExperienceId}
        onViewDetail={setSelectedExperience}
      />

      {/* ===== 底部发光轨道时间轴（节点跟随 active 联动） ===== */}
      <CareerTimeline
        experiences={experiences}
        activeExperienceId={activeExperienceId}
      />

      {/* ===== 经历详情 Drawer ===== */}
      <CareerDetailDrawer
        isOpen={selectedExperience !== null}
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />
    </section>
  );
}

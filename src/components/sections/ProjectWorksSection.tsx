"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { ProjectItem } from "@/types";
import SectionHeader from "@/components/common/SectionHeader";
import ProjectAbstractVisual from "@/components/projects/ProjectAbstractVisual";
import ProjectCarousel from "@/components/projects/ProjectCarousel";
import ProjectDetailDrawer from "@/components/projects/ProjectDetailDrawer";

/**
 * ProjectWorksSection — 第三屏：项目经历
 *
 * 四层结构（从上到下）：
 * 1. 标题区（左上对齐）
 * 2. 横向抽象视觉图（z-0，标题和卡片之间的氛围层）
 * 3. 横向项目卡片展厅（z-10，叠在视觉图上方）
 * 4. 底部进度指示 + 过渡文案（由 Carousel 内部管理）
 */
export default function ProjectWorksSection() {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? "project-01");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Drawer 打开时锁定外层滚动
  useEffect(() => {
    const html = document.documentElement;
    if (selectedProject !== null) {
      html.classList.add("scroll-locked");
    } else {
      html.classList.remove("scroll-locked");
    }
    return () => html.classList.remove("scroll-locked");
  }, [selectedProject]);

  return (
    <section
      id="projects"
      className="relative section-bg min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden snap-section"
    >
      {/* ===== Layer 1: 横向抽象视觉图（标题后方 + 卡片背后） ===== */}
      <ProjectAbstractVisual />

      {/* ===== 内容层 (z-10) ===== */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ===== 标题区（左上对齐） ===== */}
        <SectionHeader
          label="PROJECT WORKS"
          title="我推动落地的项目"
          subtitle="从问题理解，到方案设计，再到推进上线，我更关心项目背后的真实落地过程。"
        />

        {/* ===== Layer 2: 横向展厅（卡片 + 底部指示器） ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-10"
        >
          <ProjectCarousel
            projects={projects}
            activeProjectId={activeProjectId}
            onProjectChange={setActiveProjectId}
            onViewDetail={setSelectedProject}
          />
        </motion.div>
      </div>

      {/* ===== 详情 Drawer ===== */}
      <ProjectDetailDrawer
        isOpen={selectedProject !== null}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

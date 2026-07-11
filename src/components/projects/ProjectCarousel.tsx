"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ProjectItem } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";
import ProgressIndicator from "@/components/common/ProgressIndicator";

interface ProjectCarouselProps {
  projects: ProjectItem[];
  activeProjectId: string;
  onProjectChange: (id: string) => void;
  onViewDetail: (project: ProjectItem) => void;
}

/**
 * ProjectCarousel — 横向项目卡片展厅
 * 布局顺序: PROJECT 01 → PROJECT 02 → PROJECT 03 → PROJECT 04（从左到右）
 * hover 切换 active，重分配 main/side variant
 */
export default function ProjectCarousel({
  projects,
  activeProjectId,
  onProjectChange,
  onViewDetail,
}: ProjectCarouselProps) {
  // 按展厅顺序重排: P04, P01, P02, P03
  const orderedIds = ["project-01", "project-02", "project-03", "project-04"];
  const orderedProjects = useMemo(() => {
    const map = new Map(projects.map((p) => [p.id, p]));
    return orderedIds.map((id) => map.get(id)).filter(Boolean) as ProjectItem[];
  }, [projects]);

  const currentIndex = useMemo(() => {
    const idx = orderedProjects.findIndex((p) => p.id === activeProjectId);
    return idx >= 0 ? idx : 0;
  }, [orderedProjects, activeProjectId]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 卡片横向排列 */}
      <div className="flex items-end justify-center gap-4 lg:gap-6 w-full flex-wrap md:flex-nowrap">
        {orderedProjects.map((project, i) => {
          const isActive = project.id === activeProjectId;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.12,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <ProjectCard
                project={project}
                variant={isActive ? "main" : "side"}
                onMouseEnter={() => onProjectChange(project.id)}
                onFocus={() => onProjectChange(project.id)}
                onViewDetail={() => onViewDetail(project)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 底部：进度指示器 + 序号 + 过渡文案 */}
      <div className="flex items-center justify-between w-full max-w-3xl mt-4">
        <ProgressIndicator
          total={orderedProjects.length}
          current={currentIndex}
          onChange={(index) => {
            const target = orderedProjects[index];
            if (target) onProjectChange(target.id);
          }}
          showCounter
          showArrows
        />

        <p className="text-sm text-[var(--text-muted)] italic text-right whitespace-nowrap leading-relaxed">
          除了正式业务项目，我也在用 AI 更快地验证自己的产品想法。
        </p>
      </div>
    </div>
  );
}

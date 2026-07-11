"use client";

import { motion } from "framer-motion";
import type { ProjectItem } from "@/types";
import Tag from "@/components/common/Tag";

interface ProjectCardProps {
  project: ProjectItem;
  variant: "main" | "side";
  onMouseEnter: () => void;
  onFocus: () => void;
  onViewDetail: () => void;
}

const cardSizes = {
  main: "w-full max-w-[460px] min-h-[380px]",
  side: "w-full max-w-[320px] min-h-[330px]",
};

const inactiveCardStyle: React.CSSProperties = {
  background: "rgba(255,255,248,0.72)",
  border: "1px solid rgba(167,193,168,0.18)",
  boxShadow:
    "0 16px 44px rgba(31,59,52,0.06), inset 0 1px 0 rgba(255,255,255,0.65)",
  borderRadius: "28px",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const activeCardStyle: React.CSSProperties = {
  background: "rgba(255,255,250,0.96)",
  border: "1px solid rgba(242,155,88,0.32)",
  boxShadow:
    "0 34px 110px rgba(129,154,145,0.28), 0 0 60px rgba(167,193,168,0.28), inset 0 0 0 1px rgba(255,255,255,0.75)",
  borderRadius: "32px",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

/**
 * ProjectCard — 单张项目卡片
 * 支持 main（主卡，大尺寸、高亮）和 side（辅助卡，小尺寸、后退感）
 * hover 效果参考 CareerCard：橙色边框 + 多层光晕 + 去饱和后退
 */
export default function ProjectCard({
  project,
  variant,
  onMouseEnter,
  onFocus,
  onViewDetail,
}: ProjectCardProps) {
  const isMain = variant === "main";
  const cardStyle = isMain ? activeCardStyle : inactiveCardStyle;

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      animate={{
        scale: isMain ? 1.08 : 0.96,
        y: isMain ? -18 : 4,
        opacity: isMain ? 1 : 0.72,
        filter: isMain ? "none" : "saturate(0.85)",
        zIndex: isMain ? 20 : 1,
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className={`relative flex-shrink-0 cursor-default ${cardSizes[variant]}`}
      style={cardStyle}
    >
      <div className="p-6 flex flex-col gap-4 h-full">
        {/* 项目编号 */}
        <span
          className={`text-[11px] font-medium tracking-[0.22em] uppercase transition-colors duration-300 ${
            isMain ? "text-[var(--orange)]" : "text-[var(--text-muted)]"
          }`}
        >
          {project.indexLabel}
        </span>

        {/* 项目名称 */}
        <h3 className="text-xl font-bold text-[var(--green-deep)] leading-tight">
          {project.title}
        </h3>

        {/* 一句话问题定义 */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {project.oneLiner}
        </p>

        {/* 角色 */}
        <span className="inline-block self-start px-2.5 py-0.5 text-xs font-medium rounded-md bg-[var(--bg-soft)] text-[var(--text-secondary)] border border-[var(--line-soft)]">
          {project.role}
        </span>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} variant={isMain ? "orange" : "green"} />
          ))}
        </div>

        {/* 查看详情按钮 */}
        <div className="mt-auto pt-3">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetail();
            }}
            className={`inline-flex items-center justify-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-300 cursor-pointer w-full ${
              isMain
                ? "text-[var(--orange)] hover:text-white hover:bg-[var(--orange)] border border-[var(--orange)]"
                : "text-[var(--text-muted)] hover:text-[var(--green-deep)] hover:bg-[rgba(167,193,168,0.15)] border border-transparent"
            }`}
          >
            查看详情
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M3 2l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

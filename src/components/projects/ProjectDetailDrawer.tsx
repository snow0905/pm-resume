"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ProjectItem } from "@/types";

interface ProjectDetailDrawerProps {
  isOpen: boolean;
  project: ProjectItem | null;
  onClose: () => void;
}

/** Drawer 内部内容区块标题 */
function DetailHeading({
  enLabel,
  zhLabel,
}: {
  enLabel: string;
  zhLabel: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[var(--text-muted)]">
        {enLabel}
      </span>
      <span className="w-px h-3 bg-[var(--line-soft)]" />
      <span className="text-sm font-semibold text-[var(--green-deep)]">
        {zhLabel}
      </span>
    </div>
  );
}

/**
 * ProjectDetailDrawer — 右侧滑入详情抽屉
 * 展示项目详情的完整结构：背景 → 职责 → 成果 → 复盘
 */
export default function ProjectDetailDrawer({
  isOpen,
  project,
  onClose,
}: ProjectDetailDrawerProps) {
  // ESC 关闭
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  // 锁定 body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, handleEsc]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer 面板 */}
          <motion.div
            className="fixed right-0 top-0 h-full z-50 flex flex-col
                       w-full md:w-[520px] lg:w-[520px]
                       max-md:w-[90vw] max-sm:w-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              background: "var(--card-bg-strong)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderLeft: "1px solid var(--line-soft)",
            }}
          >
            {/* 顶部：编号 + 标题 + 关闭按钮 */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--text-muted)]">
                  {project.indexLabel}
                </span>
                <h2 className="text-2xl font-bold text-[var(--green-deep)] mt-1">
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--bg-soft)] transition-colors text-[var(--text-muted)] hover:text-[var(--green-deep)]"
                aria-label="关闭"
              >
                <X size={22} />
              </button>
            </div>

            {/* 分隔线 */}
            <div className="mx-6 mt-4 mb-5 h-px bg-[var(--line-soft)]" />

            {/* 可滚动内容区 */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8">
              {/* 背景与问题 */}
              <section>
                <DetailHeading enLabel="Background" zhLabel="背景与问题" />
                <ul className="space-y-2">
                  {project.detail.background.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--green-soft)] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 我的职责 */}
              <section>
                <DetailHeading enLabel="Responsibilities" zhLabel="我的职责" />
                <ul className="space-y-2">
                  {project.detail.responsibilities.map((item, i) => {
                    const colonIndex = item.search(/[：:]/);
                    const hasHeading = colonIndex > 0;
                    const heading = hasHeading ? item.slice(0, colonIndex + 1) : "";
                    const content = hasHeading ? item.slice(colonIndex + 1) : item;
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--orange)] shrink-0" />
                        <span>
                          {hasHeading && <span className="font-semibold text-[var(--green-deep)]">{heading}</span>}
                          {content}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>


              {/* 项目成果 */}
              <section>
                <DetailHeading enLabel="Outcomes" zhLabel="项目成果" />
                <ul className="space-y-2">
                  {project.detail.outcomes.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="text-[var(--orange)] mt-px shrink-0">
                        &#10003;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 我的收获与复盘 */}
              <section>
                <DetailHeading
                  enLabel="Reflection"
                  zhLabel="我的收获与复盘"
                />
                <ul className="space-y-3">
                  {project.detail.reflection.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[var(--text-secondary)] italic leading-relaxed pl-3 border-l-2 border-[var(--green-soft)]"
                    >
                      <span className="text-xs text-[var(--text-muted)] mt-px shrink-0 select-none">
                        {i + 1}.
                      </span>
                      <span>&ldquo;{item}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 底部留白 */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

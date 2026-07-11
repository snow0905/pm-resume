"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ExperienceItem } from "@/types";

interface CareerDetailDrawerProps {
  isOpen: boolean;
  experience: ExperienceItem | null;
  onClose: () => void;
}

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

export default function CareerDetailDrawer({
  isOpen,
  experience,
  onClose,
}: CareerDetailDrawerProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

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
      {isOpen && experience && (
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
                       w-full md:w-[600px] lg:w-[640px]
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
            {/* 顶部：阶段标签 + 公司·岗位 + 时间 + 关闭按钮 */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[var(--orange)] rounded-full mb-2">
                  {experience.stage}
                </span>
                <h2 className="text-2xl font-bold text-[var(--green-deep)] mt-1">
                  {experience.company}
                  <span className="text-[var(--text-muted)] mx-1.5 font-normal">
                    ·
                  </span>
                  {experience.role}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1.5">
                  {experience.period}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[var(--bg-soft)] transition-colors text-[var(--text-muted)] hover:text-[var(--green-deep)] shrink-0"
                aria-label="关闭"
              >
                <X size={22} />
              </button>
            </div>

            {/* 分隔线 */}
            <div className="mx-6 mt-4 mb-5 h-px bg-[var(--line-soft)]" />

            {/* 可滚动内容区 */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8">
              {/* 工作总结 */}
              <section>
                <DetailHeading enLabel="Background" zhLabel="工作背景" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {experience.detail.background}
                </p>
              </section>

              {/* 核心职责 */}
              <section>
                <DetailHeading
                  enLabel="Responsibilities"
                  zhLabel="核心职责"
                />
                <ul className="space-y-2">
                  {experience.detail.responsibilities.map((item, i) => {
                    const colonIndex = item.search(/[：:]/);
                    const hasHeading = colonIndex > 0;
                    const heading = hasHeading ? item.slice(0, colonIndex + 1) : "";
                    const content = hasHeading ? item.slice(colonIndex + 1) : item;
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--green-soft)] shrink-0" />
                        <span>
                          {hasHeading && <span className="font-semibold text-[var(--green-deep)]">{heading}</span>}
                          {content}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* 主要成果 */}
              <section>
                <DetailHeading enLabel="Outcomes" zhLabel="主要成果" />
                <ul className="space-y-2">
                  {experience.detail.outcomes.map((item, i) => (
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

              {/* 成长收获 */}
              <section>
                <DetailHeading enLabel="Growth" zhLabel="成长收获" />
                <div className="text-sm text-[var(--text-secondary)] italic leading-relaxed pl-3 border-l-2 border-[var(--orange)]">
                  &ldquo;{experience.detail.growth}&rdquo;
                </div>
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

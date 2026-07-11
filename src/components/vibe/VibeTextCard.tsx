"use client";

import { useRef, useCallback } from "react";
import { ExternalLink, FlaskConical } from "lucide-react";
import type { VibeProjectItem } from "@/types";

interface VibeTextCardProps {
  project: VibeProjectItem;
  isSelected: boolean;
  isPreviewed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export default function VibeTextCard({
  project,
  isSelected,
  isPreviewed,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: VibeTextCardProps) {
  const hasDemo = project.demoUrl && project.demoUrl !== "#";
  const cardRef = useRef<HTMLDivElement>(null);

  // 边框光晕跟随鼠标 — 直接操作 CSS 变量，避免 React 重渲染
  const trackGlow = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
    card.style.setProperty("--glow-intensity", "1");
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      trackGlow(e);
      onMouseEnter();
    },
    [trackGlow, onMouseEnter],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      trackGlow(e);
    },
    [trackGlow],
  );

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--glow-intensity", "0");
    onMouseLeave();
  }, [onMouseLeave]);

  // 选中 / 预选中 状态
  const borderClass = isSelected
    ? "border-[rgba(167,193,168,0.55)] shadow-[0_0_24px_rgba(167,193,168,0.20),0_8px_32px_rgba(31,59,52,0.10)]"
    : isPreviewed
      ? "border-[rgba(167,193,168,0.45)] shadow-[0_0_16px_rgba(167,193,168,0.14),0_6px_24px_rgba(31,59,52,0.06)]"
      : "border-[var(--line-soft)] shadow-[0_4px_20px_rgba(31,59,52,0.04)]";

  const floatClass = isSelected
    ? "-translate-y-1.5"
    : isPreviewed
      ? "-translate-y-1"
      : "";

  const bgClass = isSelected
    ? "bg-[rgba(255,255,250,0.94)]"
    : isPreviewed
      ? "bg-[rgba(255,255,250,0.92)]"
      : "bg-[rgba(255,255,248,0.78)]";

  const indicatorClass = isSelected
    ? "bg-gradient-to-b from-[var(--green-soft)] to-[var(--orange)] opacity-100"
    : isPreviewed
      ? "bg-gradient-to-b from-[var(--green-soft)] to-[var(--orange)] opacity-65"
      : "bg-[var(--green-soft)] opacity-0";

  return (
    <div
      ref={cardRef}
      className={`group relative cursor-pointer rounded-2xl border ${borderClass} ${bgClass} ${floatClass}
        backdrop-blur-lg transition-all duration-400 p-5 md:p-6`}
      style={{
        transition:
          "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), border-color 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), background 0.4s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* 边框光晕层 — mask 技法只让光晕出现在边框区域，跟随鼠标 */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
        style={{
          padding: "3px",
          background:
            "radial-gradient(280px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(167,193,168,0.65) 0%, rgba(242,155,88,0.30) 35%, transparent 65%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude" as unknown as string,
          opacity: "var(--glow-intensity, 0)",
          transition: "opacity 0.3s ease",
        } as React.CSSProperties}
      />

      {/* 左侧渐变选中指示条 */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-all duration-400 ${indicatorClass}`}
      />

      {/* 项目编号 */}
      <span className="text-xs font-semibold tracking-[0.15em] text-[var(--text-muted)] mb-2 block">
        {project.indexLabel}
      </span>

      {/* 标题 */}
      <h3 className="text-xl md:text-2xl font-bold text-[var(--green-deep)] mb-1.5 leading-tight">
        {project.title}
      </h3>

      {/* 一句话价值描述 */}
      <p className="text-sm text-[var(--orange)] font-medium mb-3">
        {project.oneLiner}
      </p>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full border
              transition-colors duration-300
              ${isSelected
                ? "bg-[rgba(167,193,168,0.18)] text-[var(--green-deep)] border-[rgba(167,193,168,0.30)]"
                : "bg-[var(--bg-soft)] text-[var(--text-secondary)] border-[var(--line-soft)]"
              }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 简短说明 */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* 按钮 */}
      <button
        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300
          px-4 py-2 rounded-xl border cursor-pointer
          ${isSelected
            ? "bg-[var(--green-deep)] text-white border-[var(--green-deep)] shadow-[0_4px_16px_rgba(31,59,52,0.22)]"
            : isPreviewed
              ? "text-[var(--green-deep)] border-[var(--green-soft)] bg-[rgba(167,193,168,0.08)]"
              : "text-[var(--text-secondary)] border-[var(--line-soft)] bg-transparent hover:text-[var(--green-deep)] hover:border-[var(--green-soft)]"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasDemo) {
            window.open(project.demoUrl, "_blank", "noopener,noreferrer");
          }
          onClick();
        }}
      >
        {hasDemo ? (
          <>
            <ExternalLink size={14} />
            <span>进入体验</span>
          </>
        ) : (
          <>
            <ExternalLink size={14} />
            <span>进入体验</span>
          </>
        )}
      </button>

      {/* 选中静态底纹（非 hover 时可见） */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(167,193,168,0.10) 0%, transparent 60%)",
          }}
        />
      )}
    </div>
  );
}

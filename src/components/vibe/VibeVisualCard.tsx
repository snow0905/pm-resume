"use client";

import { useRef, useCallback } from "react";
import type { VibeProjectItem } from "@/types";

interface VibeVisualCardProps {
  project: VibeProjectItem;
  isFront: boolean;
}

export default function VibeVisualCard({ project, isFront }: VibeVisualCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

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
    },
    [trackGlow],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      trackGlow(e);
    },
    [trackGlow],
  );

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--glow-intensity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full h-full rounded-xl overflow-hidden relative flex flex-col select-none"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isFront
          ? "linear-gradient(145deg, rgba(255,255,250,0.95) 0%, rgba(238,241,227,0.9) 100%)"
          : "linear-gradient(145deg, rgba(255,255,248,0.9) 0%, rgba(238,241,227,0.85) 100%)",
        border: "1px solid rgba(167,193,168,0.25)",
        boxShadow: isFront
          ? "inset 0 1px 0 rgba(255,255,255,0.8)"
          : "inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* 边框光晕层 — 跟随鼠标的流动光晕 */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-[1]"
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

      {/* ===== 标题栏 ===== */}
      <div
        className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3.5 border-b"
        style={{ borderColor: "rgba(167,193,168,0.18)" }}
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "var(--orange)" }}
        />
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--green-deep)" }}
        >
          {project.visualTitle}
        </span>
      </div>

      {/* ===== 内容区 ===== */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: "55%",
              height: "55%",
              top: "-10%",
              right: "-15%",
              background:
                "radial-gradient(circle, rgba(167,193,168,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "30%",
              height: "30%",
              bottom: "-5%",
              left: "-5%",
              background:
                "radial-gradient(circle, rgba(242,155,88,0.08) 0%, transparent 70%)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            style={{ stroke: "var(--green-main)" }}
          >
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {project.visualUrl ? (
          <img
            src={project.visualUrl}
            alt={project.visualTitle}
            className="relative z-10 w-full h-full object-contain p-3"
          />
        ) : (
          <span
            className="relative z-10 text-xs font-medium tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            内容区域
          </span>
        )}
      </div>
    </div>
  );
}

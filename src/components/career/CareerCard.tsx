"use client";

import { motion } from "framer-motion";
import type { ExperienceItem } from "@/types";
import Tag from "@/components/common/Tag";

interface CareerCardProps {
  experience: ExperienceItem;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onFocus: () => void;
  onViewDetail: () => void;
}

const cardBaseSize = "w-[360px]";

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

export default function CareerCard({
  experience,
  index,
  isActive,
  onMouseEnter,
  onFocus,
  onViewDetail,
}: CareerCardProps) {
  const { summary } = experience;
  const isPast = experience.status === "past";
  const cardStyle = isActive ? activeCardStyle : inactiveCardStyle;

  const displayTags = summary.tags.slice(0, 4);

  return (
    <motion.div
      className={`${cardBaseSize} flex-shrink-0 cursor-default`}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: 0.2 + index * 0.15,
          ease: [0.22, 0.61, 0.36, 1],
        },
      }}
      viewport={{ once: true, margin: "-60px" }}
      animate={{
        scale: isActive ? 1.08 : 0.96,
        y: isActive ? -18 : 4,
        opacity: isActive ? 1 : 0.72,
        filter: isActive ? "none" : "saturate(0.85)",
        zIndex: isActive ? 10 : 1,
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={cardStyle}
    >
      <div className="p-6 flex flex-col">
        {/* ---- 头部：active 显示 pill + 时间, inactive 显示简单标签 ---- */}
        {isActive ? (
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[var(--orange)] rounded-full">
              {experience.stage}
            </span>
            <span className="text-xs text-[var(--text-muted)] tracking-wide">
              {experience.period}
            </span>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1 block">
              {experience.stage}
            </span>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              {experience.period}
            </p>
          </>
        )}

        {/* ---- 公司 · 岗位 ---- */}
        <h3
          className={`font-bold text-[var(--green-deep)] ${isActive ? "text-xl mb-2" : "text-lg mb-2"}`}
        >
          {experience.company}
          <span className="text-[var(--text-muted)] mx-1.5 font-normal">·</span>
          {experience.role}
        </h3>

        {/* ---- 职责描述（完整展示，不截断） ---- */}
        <p
          className="text-[var(--text-secondary)] mb-3"
          style={{
            fontSize: "clamp(13px, 0.95vw, 15px)",
            lineHeight: "1.8",
            whiteSpace: "normal",
            overflow: "visible",
            display: "block",
          }}
        >
          {summary.description}
        </p>

        {/* ---- 能力标签（最多 4 个） ---- */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {displayTags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              variant={isActive ? "orange" : isPast ? "muted" : "green"}
            />
          ))}
        </div>

        {/* ---- 查看详情按钮 ---- */}
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail();
            }}
            className={`inline-flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-300 cursor-pointer ${
              isActive
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

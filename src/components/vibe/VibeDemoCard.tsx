"use client";

import { motion } from "framer-motion";
import { ExternalLink, Bot, FileText, ListChecks } from "lucide-react";
import type { VibeProjectItem } from "@/types";
import GlassCard from "@/components/common/GlassCard";

interface VibeDemoCardProps {
  project: VibeProjectItem;
  variant: "primary" | "secondary";
}

/** 模拟浏览器预览窗口（primary 变体用） */
function BrowserMockup() {
  return (
    <div className="rounded-xl border border-[var(--line-soft)] bg-[var(--bg-cream)] overflow-hidden shadow-sm">
      {/* 浏览器顶栏：红黄绿圆点 */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[var(--bg-soft)] border-b border-[var(--line-soft)]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
      </div>
      {/* 抽象 UI 占位 */}
      <div className="p-4 space-y-3">
        {/* 搜索/输入栏 */}
        <div className="h-3 w-3/4 rounded-full bg-[var(--bg-soft)]" />
        {/* 卡片块 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded-lg bg-[var(--bg-soft)]" />
          <div className="h-12 rounded-lg bg-[var(--bg-soft)]" />
          <div className="h-12 rounded-lg bg-[var(--bg-soft)]" />
        </div>
        {/* 进度条 */}
        <div className="h-2 w-full rounded-full bg-[var(--bg-soft)]">
          <motion.div
            className="h-full w-3/5 rounded-full"
            style={{ background: "var(--green-main)" }}
            animate={{ width: ["60%", "75%", "60%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {/* 小卡片行 */}
        <div className="space-y-2">
          <div className="h-2 w-5/6 rounded-full bg-[var(--bg-soft)]" />
          <div className="h-2 w-2/3 rounded-full bg-[var(--bg-soft)]" />
        </div>
      </div>
      {/* 点状微弱光效提示 */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, rgba(167,193,168,0.6) 0%, transparent 40%)",
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/** 辅助流程步骤（secondary 变体用） */
function StepFlow() {
  const steps = [
    { icon: Bot, label: "输入需求" },
    { icon: ListChecks, label: "拆解分析" },
    { icon: FileText, label: "输出 PRD 草稿" },
  ];

  return (
    <div className="flex items-center gap-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] border border-[var(--line-soft)] flex items-center justify-center">
              <step.icon size={16} className="text-[var(--green-main)]" />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-6 h-px bg-[var(--green-soft)] mt-[-8px]" />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * VibeDemoCard — AI Demo 展示卡片
 * primary: 大卡片，左右两栏带浏览器预览
 * secondary: 小卡片，横向布局带流程示意
 */
export default function VibeDemoCard({
  project,
  variant,
}: VibeDemoCardProps) {
  const isPrimary = variant === "primary";
  const hasDemo = project.demoUrl && project.demoUrl !== "#";

  const handleOpen = () => {
    if (!hasDemo) return;
    window.open(project.demoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <GlassCard
      strong={isPrimary}
      className={`${isPrimary ? "p-7 md:p-8" : "p-5 md:p-6"}`}
    >
      <div
        className={`flex ${isPrimary ? "flex-col md:flex-row gap-6 md:gap-8" : "flex-col sm:flex-row gap-5 items-start"}`}
      >
        {/* ===== 左侧：文字内容 ===== */}
        <div className={`${isPrimary ? "md:w-3/5" : "flex-1"}`}>
          {/* 项目标题 */}
          <h3
            className={`font-bold text-[var(--green-deep)] ${isPrimary ? "text-2xl md:text-3xl mb-3" : "text-lg mb-2"}`}
          >
            {project.title}
          </h3>

          {/* 状态胶囊 */}
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full border mb-3
              ${isPrimary
                ? "bg-[var(--orange-soft)] text-[var(--orange)] border-[rgba(242,155,88,0.3)]"
                : "bg-[var(--bg-soft)] text-[var(--text-secondary)] border-[var(--line-soft)]"
              }`}
          >
            {project.status}
          </span>

          {/* 描述 */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            {project.description}
          </p>

          {/* 查看 Demo 按钮 */}
          <button
            onClick={handleOpen}
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors
              ${hasDemo
                ? "text-[var(--green-deep)] hover:text-[var(--orange)] cursor-pointer"
                : "text-[var(--text-muted)] cursor-not-allowed"
              }`}
            disabled={!hasDemo}
          >
            <ExternalLink size={15} />
            <span>{hasDemo ? "体验 Demo" : "Demo 即将上线"}</span>
          </button>
        </div>

        {/* ===== 右侧：Demo 预览 / 流程示意 ===== */}
        <div className={`${isPrimary ? "md:w-2/5" : "shrink-0"}`}>
          {isPrimary ? <BrowserMockup /> : <StepFlow />}
        </div>
      </div>
    </GlassCard>
  );
}

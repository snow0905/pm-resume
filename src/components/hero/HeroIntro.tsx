"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "@/data/profile";
import Button from "@/components/common/Button";
import ShinyTitle from "@/components/common/ShinyTitle";

interface HeroIntroProps {
  onContactClick: () => void;
}

export default function HeroIntro({ onContactClick }: HeroIntroProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = profile.resumeUrl;
    link.download = "樊佳园_简历.pdf";
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      {/* 主标题 */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--text-muted)]">
          Product Manager
        </p>
        <ShinyTitle as="h1" className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
          Hi，我是 {profile.name}
        </ShinyTitle>
      </div>

      {/* 副文案 */}
      <p className="text-base lg:text-lg leading-relaxed text-[var(--text-secondary)] max-w-md">
        5 年零售 SaaS 产品经验，擅长将复杂业务场景抽象为可配置、可复用的产品能力。关注 AI Agent、智能运营与营销自动化方向。
      </p>

      {/* 按钮组 */}
      <motion.div
        className="flex items-center gap-4 pt-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Button variant="primary" size="lg" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          下载简历
        </Button>
        <Button variant="outline" size="lg" onClick={onContactClick}>
          联系我
        </Button>
      </motion.div>
    </motion.div>
  );
}

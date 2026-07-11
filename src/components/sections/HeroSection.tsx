"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import HeroIntro from "@/components/hero/HeroIntro";
import JdMatcherCard from "@/components/hero/JdMatcherCard";
import HeroWorkbenchVideo from "@/components/hero/HeroWorkbenchVideo";
import ContactModal from "@/components/contact/ContactModal";

const JdMatchModal = lazy(() => import("@/components/hero/JdMatchModal"));
import type { MatchResult, MatchModalState } from "@/types";

const JD_MAX_LENGTH = 8000;

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [matchState, setMatchState] = useState<MatchModalState>("closed");
  const [matchResult, setMatchResult] = useState<MatchResult | undefined>();
  const [lastJd, setLastJd] = useState("");

  // 联系我点击 —— 弹出 Modal
  const handleContactClick = useCallback(() => {
    setIsContactModalOpen(true);
  }, []);

  // 开始匹配
  const handleStartMatch = useCallback(async (jd: string) => {
    // 前端预校验：JD 过长直接提示，不打开 Modal
    if (jd.length > JD_MAX_LENGTH) {
      alert(`JD 内容过长（当前 ${jd.length} 字），请精简至 ${JD_MAX_LENGTH} 字以内再试`);
      return;
    }

    setLastJd(jd);
    setIsModalOpen(true);
    setMatchState("loading");
    setMatchResult(undefined);

    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          alert(err.error || "请求参数有误");
          setIsModalOpen(false);
          setMatchState("closed");
          return;
        }
        throw new Error();
      }

      const data: MatchResult = await res.json();
      setMatchState("result");
      setMatchResult(data);
    } catch {
      setMatchState("error");
    }
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setMatchState("closed");
    setMatchResult(undefined);
  }, []);

  // 重试
  const handleRetry = useCallback(async () => {
    if (!lastJd) return;
    setMatchState("loading");
    setMatchResult(undefined);

    try {
      const res = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: lastJd }),
      });

      if (!res.ok) throw new Error();

      const data: MatchResult = await res.json();
      setMatchState("result");
      setMatchResult(data);
    } catch {
      setMatchState("error");
    }
  }, [lastJd]);

  // 弹窗打开时锁定外层滚动
  useEffect(() => {
    const html = document.documentElement;
    if (isModalOpen) {
      html.classList.add("scroll-locked");
    } else {
      html.classList.remove("scroll-locked");
    }
    return () => html.classList.remove("scroll-locked");
  }, [isModalOpen]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center section-bg overflow-hidden snap-section"
    >
      {/* 背景装饰光晕 */}
      <div className="absolute top-0 right-0 w-[60%] h-[80%] pointer-events-none opacity-30">
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(167,193,168,0.25),transparent_70%)]" />
        <div className="absolute top-[30%] right-[30%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(242,155,88,0.12),transparent_70%)]" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16 py-20 lg:py-28">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(420px,0.40fr)_minmax(760px,0.60fr)] gap-10 lg:gap-12 xl:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* ===== 左侧 42% ===== */}
          <motion.div
            className="flex flex-col gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.4 } },
            }}
          >
            <HeroIntro onContactClick={handleContactClick} />
            <JdMatcherCard onStartMatch={handleStartMatch} />
          </motion.div>

          {/* ===== 右侧 58%：工作台视频 ===== */}
          <motion.div
            className="flex items-center justify-center"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
          >
            <HeroWorkbenchVideo videoSrc="/工作台2.mp4" />
          </motion.div>
        </motion.div>
      </div>

      {/* ===== JD 匹配弹窗 — 按需加载 ===== */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <JdMatchModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            state={matchState as "loading" | "result" | "error"}
            result={matchResult}
            onRetry={handleRetry}
          />
        </Suspense>
      )}

      {/* ===== 联系我弹窗 ===== */}
      <ContactModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
}

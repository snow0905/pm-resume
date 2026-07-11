"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CapabilityCoreProps {
  activePhrase: string | null;
}

/**
 * CapabilityCore — 中央能力核心模块
 * 显示 "产品能力画像 / PRODUCT MINDSET"，
 * hover 某卡片时切换为对应能力短语
 */
export default function CapabilityCore({ activePhrase }: CapabilityCoreProps) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex flex-col items-center justify-center
                 w-44 h-44 md:w-52 md:h-52 rounded-[2rem]
                 glass-card-strong
                 shadow-[0_0_48px_rgba(167,193,168,0.2)]
                 mx-auto"
    >
      {/* 柔和光晕边缘 */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-40 pointer-events-none"
        style={{
          boxShadow: "0 0 30px rgba(167,193,168,0.3), inset 0 0 20px rgba(167,193,168,0.12)",
        }}
      />

      {/* 内部内容 */}
      <AnimatePresence mode="wait">
        {activePhrase ? (
          <motion.div
            key="phrase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-center gap-1 px-3"
          >
            <span className="text-sm md:text-base font-bold text-[var(--green-deep)] text-center leading-snug">
              {activePhrase}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-center gap-2 px-3"
          >
            <span className="text-base md:text-lg font-bold text-[var(--green-deep)] text-center leading-tight">
              产品能力画像
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--text-muted)]">
              PRODUCT MINDSET
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

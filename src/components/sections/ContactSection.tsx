"use client";

import { motion } from "framer-motion";
import ShinyTitle from "@/components/common/ShinyTitle";
import ContactBackground from "@/components/contact/ContactBackground";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import EducationCard from "@/components/contact/EducationCard";

interface ContactSectionProps {
  pulse?: boolean;
}

export default function ContactSection({ pulse = false }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative snap-section"
      style={{
        height: "100vh",
        minHeight: 900,
        overflow: "hidden",
        background: "linear-gradient(180deg, #FBFBF4 0%, #EEF1E3 100%)",
      }}
    >
      {/* ===== 背景装饰层 z-0 ===== */}
      <ContactBackground />

      {/* ===== 标题区 z-3 ===== */}
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-block flex-shrink-0"
            style={{ width: 24, height: 1, background: "var(--green-soft)" }}
          />
          <span
            className="text-sm font-semibold tracking-[0.22em] uppercase"
            style={{ color: "var(--green-soft)" }}
          >
            CONTACT ME
          </span>
        </div>
        <ShinyTitle
          as="h2"
          className="text-3xl md:text-4xl font-extrabold leading-none"
        >
          联系我
        </ShinyTitle>
      </motion.div>

      {/* ===== 双栏内容区 z-2 ===== */}
      <div className="contact-content">
        {/* 左侧：联系主卡 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.div
            animate={
              pulse
                ? {
                    filter: [
                      "drop-shadow(0 0 0px rgba(167,193,168,0))",
                      "drop-shadow(0 0 28px rgba(167,193,168,0.55))",
                      "drop-shadow(0 0 0px rgba(167,193,168,0))",
                    ],
                  }
                : { y: [0, -4, 0] }
            }
            transition={
              pulse
                ? { duration: 1.2, ease: "easeInOut", times: [0, 0.4, 1] }
                : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
            whileHover={{
              y: -8,
              transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
            }}
          >
            <ContactInfoCard />
          </motion.div>
        </motion.div>

        {/* 右侧：教育经历卡 */}
        <motion.div
          className="self-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              y: -6,
              transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
            }}
          >
            <EducationCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "工作经历", href: "#career" },
  { label: "项目经历", href: "#projects" },
  { label: "Vibe Coding", href: "#vibe" },
  { label: "联系我", href: "#contact" },
];

const SECTION_IDS = ["hero", "career", "projects", "vibe", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver：监听当前处于视口的 section，阈值 60%
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // 取可见比例最高的那个
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          );
          setActiveSection(best.target.id);
        }
      },
      {
        threshold: [0.6, 0.8],
        rootMargin: "-64px 0px 0px 0px",
      },
    );

    elements.forEach((el) => observerRef.current?.observe(el!));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[rgba(251,251,244,0.85)] backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 像素风头像 logo */}
        <button
          onClick={() => handleClick("#hero")}
          className="cursor-pointer bg-transparent border-0 p-0"
          aria-label="回到首页"
        >
          <div className="w-9 h-9 rounded-lg bg-[var(--green-deep)] flex items-center justify-center
            shadow-[0_2px_8px_rgba(31,59,52,0.15)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="3" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="8" y="3" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="12" y="3" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="4" y="7" width="4" height="4" rx="1" fill="var(--green-soft)" />
              <rect x="8" y="7" width="4" height="4" rx="1" fill="var(--green-soft)" />
              <rect x="12" y="7" width="4" height="4" rx="1" fill="var(--green-soft)" />
              <rect x="4" y="11" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="8" y="11" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="12" y="11" width="4" height="4" rx="1" fill="var(--bg-cream)" />
              <rect x="4" y="15" width="12" height="4" rx="1" fill="var(--orange)" />
            </svg>
          </div>
        </button>

        {/* 导航链接 */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200 cursor-pointer bg-transparent border-0
                    ${isActive
                      ? "text-[var(--orange)] bg-[var(--orange-soft)]/40"
                      : "text-[var(--text-secondary)] hover:text-[var(--green-deep)] hover:bg-[var(--bg-soft)]"
                    }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

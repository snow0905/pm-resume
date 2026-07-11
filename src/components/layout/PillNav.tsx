"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "首页", href: "#hero" },
  { label: "工作经历", href: "#career" },
  { label: "项目经历", href: "#projects" },
  { label: "实践项目", href: "#vibe" },
  { label: "联系我", href: "#contact" },
];

const SECTION_IDS = ["hero", "career", "projects", "vibe", "contact"];

export default function PillNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // IntersectionObserver：检测当前 section
  useEffect(() => {
    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
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

  // 点击外部关闭移动菜单
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // 导航跳转 + 关闭移动菜单
  const handleClick = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  }, []);

  return (
    <div className="pill-nav-wrapper">
      <nav className="pill-nav" aria-label="主导航">
        {/* Logo */}
        <a
          href="#hero"
          className="pill-nav-logo"
          aria-label="回到首页"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            handleClick("#hero");
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={42}
            height={42}
            priority
          />
        </a>

        {/* 桌面端药丸列表 */}
        <ul className="pill-nav-list" role="menubar">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  className={`pill-item${isActive ? " is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item.href);
                  }}
                >
                  <span className="hover-circle" aria-hidden="true" />
                  <span className="pill-label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* 移动端汉堡按钮 */}
        <button
          ref={hamburgerRef}
          className="pill-nav-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          <span
            className="hamburger-line"
            style={{
              transform: mobileOpen
                ? "rotate(45deg) translateY(3.5px)"
                : "none",
            }}
          />
          <span
            className="hamburger-line"
            style={{
              transform: mobileOpen
                ? "rotate(-45deg) translateY(-3.5px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* 移动端弹出菜单 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            className="pill-mobile-menu"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <ul className="pill-mobile-list">
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;

                return (
                  <li key={item.href}>
                    <button
                      className={`pill-mobile-link${isActive ? " is-active" : ""}`}
                      onClick={() => handleClick(item.href)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

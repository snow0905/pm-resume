"use client";

import { useCallback } from "react";

export function useScrollToSection() {
  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToContact = useCallback(() => {
    scrollTo("#contact");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("contact-pulse"));
    }, 600);
  }, [scrollTo]);

  return { scrollTo, scrollToContact };
}

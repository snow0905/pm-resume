"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import PillNav from "@/components/layout/PillNav";
import HeroSection from "@/components/sections/HeroSection";

const CareerPathSection = lazy(() => import("@/components/sections/CareerPathSection"));
const ProjectWorksSection = lazy(() => import("@/components/sections/ProjectWorksSection"));
const VibeCodingSection = lazy(() => import("@/components/sections/VibeCodingSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

function SectionFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-6 h-6 rounded-full border-2 border-[var(--green-soft)] border-t-transparent animate-spin"
        aria-label="加载中"
      />
    </div>
  );
}

export default function Home() {
  const [contactPulse, setContactPulse] = useState(false);

  const handleContactPulse = useCallback(() => {
    setContactPulse(true);
    setTimeout(() => setContactPulse(false), 2000);
  }, []);

  useEffect(() => {
    window.addEventListener("contact-pulse", handleContactPulse);
    return () => window.removeEventListener("contact-pulse", handleContactPulse);
  }, [handleContactPulse]);

  return (
    <>
      <PillNav />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <CareerPathSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProjectWorksSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <VibeCodingSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection pulse={contactPulse} />
        </Suspense>
      </main>
    </>
  );
}

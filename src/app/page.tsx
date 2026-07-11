"use client";

import { useState, useEffect, useCallback } from "react";
import PillNav from "@/components/layout/PillNav";
import HeroSection from "@/components/sections/HeroSection";
import CareerPathSection from "@/components/sections/CareerPathSection";
import ProjectWorksSection from "@/components/sections/ProjectWorksSection";
import VibeCodingSection from "@/components/sections/VibeCodingSection";
import ContactSection from "@/components/sections/ContactSection";

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
        <CareerPathSection />
        <ProjectWorksSection />
        <VibeCodingSection />
        <ContactSection pulse={contactPulse} />
      </main>
    </>
  );
}

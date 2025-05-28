"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

import HeroSection from './components/HeroSection';
import TechGridSection from './components/TechGridSection';
import ProjectsSection from './components/ProjectsSection';
import ProcessSection from './components/ProcessSection';
import ContactSection from './components/ContactSection';
import SaaSComparisonSection from './components/SaaSComparisonSection';
import TestimonialsSection from './components/TestimonialsSection';
// import SharpImageSection from './components/SharpImageSection'; // Commented out as it's not used

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  // Clean up ScrollTrigger on component unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <HeroSection />
      <TechGridSection />
      <ProjectsSection />
      <ProcessSection />
      <SaaSComparisonSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}

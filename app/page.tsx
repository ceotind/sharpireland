"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

import HeroSection from './components/HeroSection';
import TechGridSection from './components/TechGridSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import SaaSComparisonSection from './components/SaaSComparisonSection';
import SharpImageSection from './components/SharpImageSection';

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
    <div className="min-h-screen">
      <HeroSection />
      <TechGridSection />
      <ProjectsSection />
      <SaaSComparisonSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

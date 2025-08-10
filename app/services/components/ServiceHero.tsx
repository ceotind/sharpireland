"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ServiceHeroContent } from "../data/services-content";

interface ServiceHeroProps {
  content: ServiceHeroContent;
}

export default function ServiceHero({ content }: ServiceHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = gsap.utils.selector(sectionRef)(".animate-element");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <section
      id="services-hero-root"
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-[var(--bg-100)] to-[var(--bg-200)]"
    >
      <div
        id="services-hero-content"
        className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        {/* Left Column: Copy */}
        <div id="services-hero-left-column" className="lg:w-1/2 text-center lg:text-left">
          <h1
            id="services-hero-title"
            className="animate-element text-4xl md:text-6xl font-extrabold text-[var(--text-100)] leading-tight font-anton"
          >
            {content.title}
          </h1>
          <p
            id="services-hero-subtitle"
            className="animate-element mt-4 text-lg md:text-xl text-[var(--text-200)] font-inter"
          >
            {content.subtitle}
          </p>
          <div
            id="services-hero-cta-buttons"
            className="animate-element mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
          >
            <button
              id="services-hero-primary-cta"
              className="px-8 py-3 rounded-full bg-[var(--accent-green)] text-[var(--white-color)] font-semibold text-lg shadow-lg hover:bg-[var(--accent-green-base)] transition-colors duration-300"
              onClick={() => window.location.href = content.primaryCtaLink}
            >
              {content.primaryCtaText}
            </button>
            <button
              id="services-hero-secondary-cta"
              className="px-8 py-3 rounded-full border-2 border-[var(--accent-green)] text-[var(--accent-green)] font-semibold text-lg hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] transition-colors duration-300"
              onClick={() => window.location.href = content.secondaryCtaLink}
            >
              {content.secondaryCtaText}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Collage (Placeholder) */}
        <div id="services-hero-right-column" className="lg:w-1/2 mt-12 lg:mt-0">
          {/* Placeholder for visual collage */}
          <div
            id="services-hero-visual-placeholder"
            className="animate-element w-full h-64 md:h-96 bg-[var(--bg-300)] rounded-lg flex items-center justify-center text-[var(--text-200)] text-xl"
          >
            Visual Collage Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
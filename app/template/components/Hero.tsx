'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import content from '../content.json';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-element');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-[var(--bg-100)] px-4"
      aria-labelledby="template-hero-heading"
    >
      <div className="w-full max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="template-hero-heading"
          className="animate-element text-4xl sm:text-5xl font-bold text-[var(--text-100)] leading-tight"
        >
          {content.hero.heading}
        </h1>
        <p className="animate-element text-base sm:text-lg text-[var(--text-200)] max-w-xl mx-auto">
          {content.hero.subheading}
        </p>
        <div className="animate-element flex justify-center mt-6">
          <button
            className="px-8 py-3 bg-[var(--accent-green)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--accent-green-base)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2"
          >
            {content.hero.ctaButton}
          </button>
        </div>
        {/* Trusted by logos */}
        <div className="animate-element mt-8">
          <div className="text-xs sm:text-sm text-[var(--text-200)] mb-3">{content.hero.trustedText}</div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {content.hero.trustedLogos.map((logo, index) => (
              <img 
                key={index}
                src={logo.src} 
                alt={logo.alt} 
                className="h-7 w-auto opacity-80" 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
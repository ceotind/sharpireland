'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useContentSection } from '../../context/ContentContext';

export default function Hero() {
  const hero = useContentSection('hero');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run animations if hero content is available and sectionRef is mounted
    if (hero && sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.animate-element');
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }
    }
  }, [hero]); // Re-run effect if hero content changes

  if (!hero) {
    return null; // Don't render if hero content is not available
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-[var(--bg-100)] px-4"
      aria-labelledby="industry-hero-heading"
    >
      <div className="w-full max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="industry-hero-heading"
          className="animate-element text-4xl sm:text-5xl font-bold text-[var(--text-100)] leading-tight"
        >
          {hero.heading}
        </h1>
        <p className="animate-element text-base sm:text-lg text-[var(--text-200)] max-w-xl mx-auto">
          {hero.subheading}
        </p>
        <div className="animate-element flex justify-center mt-6">
          <button
            className="px-8 py-3 bg-[var(--primary-100)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--primary-200)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] focus:ring-offset-2"
          >
            {hero.ctaButton}
          </button>
        </div>
        {/* Trusted by logos */}
        {hero.trustedLogos && hero.trustedLogos.length > 0 && (
          <div className="animate-element mt-8">
            <div className="text-xs sm:text-sm text-[var(--text-200)] mb-3">{hero.trustedText}</div>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              {hero.trustedLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-7 w-auto opacity-80"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
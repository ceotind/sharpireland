'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContentSection } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const cta = useContentSection('cta');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run animations if cta content is available and sectionRef is mounted
    if (cta && sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.animate-element');
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }
  }, [cta]); // Re-run effect if cta content changes

  if (!cta) {
    return null; // Don't render if cta content is not available
  }

  return (
    <section ref={sectionRef} className="py-16 bg-[var(--bg-100)]">
      {/* Visually hidden heading for accessibility and ARIA */}
      <h2 id="template-cta-heading" className="sr-only">Call to Action</h2>
      <div className="w-full max-w-2xl mx-auto px-4 text-center">
        <div className="animate-element">
          <h2 className="text-3xl font-semibold text-[var(--text-100)] mb-4">
            {cta.heading}
          </h2>
          <p className="text-[var(--text-200)] mb-8">
            {cta.subheading}
          </p>
        </div>

        <div className="animate-element flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-6 py-3 bg-[var(--accent-green)] text-white rounded-md hover:bg-[var(--accent-green-hover)] transition-colors"
            data-action={cta.buttons.primary.action}
          >
            {cta.buttons.primary.text}
          </button>
          <button
            className="px-6 py-3 border border-[var(--border-200)] text-[var(--text-100)] rounded-md hover:bg-[var(--bg-200)] transition-colors"
            data-action={cta.buttons.secondary.action}
          >
            {cta.buttons.secondary.text}
          </button>
        </div>

        <div className="animate-element mt-8 text-sm text-[var(--text-300)]">
          {cta.footer && cta.footer.text && (
            <p>{cta.footer.text}</p>
          )}
        </div>
      </div>
    </section>
  );
}
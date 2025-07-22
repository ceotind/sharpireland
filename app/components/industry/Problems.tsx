'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useContentSection } from '../../context/ContentContext';

export default function Problems() {
  const problems = useContentSection('problems');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run animations if problems content is available and sectionRef is mounted
    if (problems && sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.animate-element');
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }
    }
  }, [problems]); // Re-run effect if problems content changes

  if (!problems) {
    return null; // Don't render if problems content is not available
  }

  return (
    <section
      ref={sectionRef}
      id="problems"
      className="relative py-20"
      style={{ background: 'linear-gradient(135deg, var(--bg-100) 60%, var(--accent-green)/10 100%)' }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 text-center">
        <div className="animate-element text-sm font-semibold uppercase tracking-wider text-[var(--accent-green)] mb-3">
          {problems.tagline}
        </div>
        <h2 className="animate-element text-3xl sm:text-4xl font-bold text-[var(--text-100)] mb-8">
          {problems.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {problems.items.map((problem, index) => (
            <div
              key={index}
              className="animate-element bg-[var(--bg-100)] rounded-xl p-6 shadow-sm border-l-4 border-[var(--accent-green)] text-left hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-[var(--accent-green)] mb-2">{problem.title}</h3>
              <p className="text-[var(--text-200)] text-sm">{problem.description}</p>
            </div>
          ))}
        </div>
        <div className="animate-element flex justify-center">
          <button
            className="px-8 py-3 bg-[var(--accent-green)] text-white font-semibold rounded-lg shadow-lg hover:bg-[var(--accent-green-base)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 text-lg transition-all duration-200 animate-bounce"
          >
            {problems.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
}
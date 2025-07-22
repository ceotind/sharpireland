'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useContentSection } from '../../context/ContentContext';

export default function Solution() {
  const solution = useContentSection('solution');
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
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} id="solution" className="py-20">
      <div className="w-full max-w-5xl mx-auto px-4">
        <h2 className="animate-element text-3xl sm:text-4xl font-bold text-[var(--text-100)] mb-3 text-center">
          {solution.heading}
        </h2>
        <p className="animate-element text-base sm:text-lg text-[var(--text-200)] mb-12 max-w-2xl mx-auto text-center">
          {solution.subheading}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-12">
          {/* What You Get */}
          <div className="animate-element bg-[var(--bg-100)]/80 rounded-2xl p-8 flex flex-col gap-6 shadow-md border border-[var(--bg-200)]">
            <h3 className="text-xl font-semibold text-[var(--accent-green)] mb-2">{solution.benefits.title}</h3>
            {solution.benefits.items.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="text-3xl md:text-4xl">{benefit.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-[var(--text-100)]">{benefit.title}</div>
                  <div className="text-[var(--text-200)] text-sm">{benefit.description}</div>
                </div>
              </div>
            ))}
          </div>
          {/* How It Works */}
          <div className="animate-element bg-[var(--bg-100)]/80 rounded-2xl p-8 flex flex-col gap-6 shadow-md border border-[var(--bg-200)]">
            <h3 className="text-xl font-semibold text-[var(--accent-green)] mb-2">{solution.steps.title}</h3>
            {solution.steps.items.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent-green)] text-white font-bold text-lg mt-1">{index+1}</span>
                <div className="text-left">
                  <div className="font-semibold text-[var(--text-100)]">{step.title}</div>
                  <div className="text-[var(--text-200)] text-sm">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-element flex justify-center">
          <button
            className="px-8 py-3 bg-[var(--accent-green)] text-white font-semibold rounded-lg shadow-lg hover:bg-[var(--accent-green-base)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 text-lg transition-all duration-200"
          >
            {solution.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
}
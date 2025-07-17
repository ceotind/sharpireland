'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-element');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }, []);

  const reasons = [
    {
      title: 'Dental-Only Specialization',
      description: '20+ years focused exclusively on dental practices. We understand the difference between a crown and a veneer, patient psychology, and regulatory complexities.',
      stat: '20+ Years'
    },
    {
      title: 'Proven Track Record',
      description: '2,500+ practices served, 3M+ patients attracted, thousands of Page 1 Google rankings across Europe.',
      stat: '2,500+ Practices'
    },
    {
      title: 'Technical Excellence',
      description: 'Lightning-fast websites with Core Web Vitals optimization, built for performance and search engine visibility.',
      stat: '< 2s Load Times'
    },
    {
      title: 'European Compliance',
      description: 'GDPR-first approach with deep expertise in GDC, ICO, and other European healthcare regulations.',
      stat: '100% Compliant'
    }
  ];

  return (
    <section ref={sectionRef} id="why-us" className="py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="animate-element text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            Why Choose Us
          </span>
          <h2 className="animate-element mt-4 text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            A Partner Who Understands
            <br />
            <span className="text-[var(--accent-green)]">Dentistry</span>
          </h2>
          <p className="animate-element mt-4 max-w-3xl mx-auto text-[var(--text-200)] text-base md:text-lg">
            Deep specialization means we build websites that don't just look good—they deliver measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="animate-element">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-[var(--text-100)]">
                  {reason.title}
                </h3>
                <span className="text-lg font-medium text-[var(--accent-green)]">
                  {reason.stat}
                </span>
              </div>
              <p className="text-[var(--text-200)] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
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
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-[var(--bg-100)]">
      <div className="w-full max-w-2xl mx-auto px-4 text-center">
        <div className="animate-element">
          <h2 className="text-3xl font-semibold text-[var(--text-100)] mb-4">
            Ready to grow your practice?
          </h2>
          <p className="text-[var(--text-200)] mb-8">
            Book a free strategy call to see how we can help you attract more patients.
          </p>
        </div>

        <div className="animate-element flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 bg-[var(--accent-green)] text-white rounded-md hover:bg-[var(--accent-green-hover)] transition-colors">
            Schedule Call
          </button>
          <button className="px-6 py-3 border border-[var(--border-200)] text-[var(--text-100)] rounded-md hover:bg-[var(--bg-200)] transition-colors">
            View Case Studies
          </button>
        </div>

        <div className="animate-element mt-8 text-sm text-[var(--text-300)]">
          <p>90-day performance guarantee • No-risk trial</p>
        </div>
      </div>
    </section>
  );
}
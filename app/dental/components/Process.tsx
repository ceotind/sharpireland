'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
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

  const steps = [
    {
      title: 'Discovery Call',
      description: 'Understand your practice goals and current challenges through a focused strategy session.'
    },
    {
      title: 'Strategy & Planning',
      description: 'Develop a custom growth strategy tailored to your practice, market, and competition.'
    },
    {
      title: 'Design & Development',
      description: 'Create a bespoke website with SEO optimization and integrated booking systems.'
    },
    {
      title: 'Launch & Optimization',
      description: 'Go live with continuous monitoring, optimization, and performance tracking.'
    }
  ];

  return (
    <section ref={sectionRef} id="process" className="py-20 md:py-32 bg-[var(--bg-200)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-3xl md:text-4xl font-bold text-[var(--text-100)]">
            Our Process
          </h2>
          <p className="animate-element mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base">
            A proven approach that transforms your practice's digital presence into a growth engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="animate-element">
              <div className="bg-[var(--bg-100)] p-6">
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--text-200)] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Solution() {
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

  const features = [
    {
      title: 'Patient Acquisition',
      description: 'Turn your website into a magnet for high-value patients through strategic SEO and conversion optimization.',
      items: [
        'Local SEO dominance for "dentist near me"',
        'High-value service pages for implants & cosmetic',
        'Conversion-optimized booking flows',
        'Strategic call-to-action placement'
      ]
    },
    {
      title: 'Practice Efficiency',
      description: 'Automate administrative tasks and streamline operations with integrated booking and communication systems.',
      items: [
        '24/7 online appointment booking',
        'Automated patient reminders',
        'Digital forms and intake',
        'Real-time calendar sync'
      ]
    }
  ];

  return (
    <section ref={sectionRef} id="solution" className="py-20 md:py-32 bg-[var(--bg-100)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="animate-element text-sm uppercase tracking-wide text-[var(--text-200)]">
            The Solution
          </span>
          <h2 className="animate-element mt-4 text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            Your Website as a Business Asset
          </h2>
          <p className="animate-element mt-4 max-w-3xl mx-auto text-[var(--text-200)]">
            Modern dental websites serve two critical functions simultaneously: attracting patients and streamlining operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="animate-element">
              <div className="bg-[var(--bg-200)] p-8">
                <h3 className="text-2xl font-bold text-[var(--text-100)] mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-[var(--text-200)] mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="text-[var(--text-200)] mt-1">•</span>
                      <span className="text-[var(--text-200)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Problems() {
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

  const problems = [
    {
      title: 'Wrong Patients, Wrong Cases',
      description: 'Your marketing attracts price-shoppers and low-value inquiries instead of the complex implant, orthodontic, and cosmetic cases that build your reputation and profitability.'
    },
    {
      title: 'Invisible to Locals',
      description: 'You\'re losing your most valuable local patients to competitors who consistently outrank you on Google for critical searches like "dentist near me" or "emergency dentist".'
    },
    {
      title: 'Overwhelmed Front Desk',
      description: 'Your reception team spends countless hours on the phone scheduling appointments, answering repetitive questions, and manually reminding patients, taking them away from in-person care.'
    },
    {
      title: 'Compliance & Security Worries',
      description: 'You\'re uncertain if your website and patient communication methods are fully compliant with complex regulations like GDPR, leaving your practice exposed to significant risk.'
    },
    {
      title: 'Empty Chairs from No-Shows',
      description: 'Your schedule is constantly disrupted by patient no-shows, leading to wasted chair time, frustrated clinicians, and a direct hit to your daily revenue.'
    }
  ];

  return (
    <section ref={sectionRef} id="problems" className="py-20 md:py-32 bg-[var(--bg-200)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            The Hidden Costs of an
            <br />
            <span className="text-[var(--accent-green)]">Outdated Website</span>
          </h2>
          <p className="animate-element mt-4 max-w-3xl mx-auto text-[var(--text-200)] text-base md:text-lg">
            These aren't just website problems—they're business problems that directly impact your bottom line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="animate-element"
            >
              <h3 className="text-xl font-bold text-[var(--text-100)] mb-3">
                {problem.title}
              </h3>
              <p className="text-[var(--text-200)] leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
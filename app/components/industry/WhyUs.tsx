'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as PhosphorIcons from '@phosphor-icons/react';
import { useContentSection } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function WhyUs() {
  const whyUs = useContentSection('whyUs');
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
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  // Function to render the icon safely
  const renderIcon = (Icon: React.ElementType) => {
    return (
      <div className="text-[var(--primary-100)]" style={{ fontSize: 28 }}>
        {Icon && <Icon />}
      </div>
    );
  };

  return (
    <section ref={sectionRef} id="why-us" className="py-20 md:py-32">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="animate-element text-sm uppercase tracking-wide text-[var(--primary-100)] font-medium">
            {whyUs?.tagline}
          </span>
          <h2 className="animate-element mt-4 text-3xl sm:text-4xl font-bold text-[var(--text-100)]">
            {whyUs?.heading} <span className="text-[var(--primary-100)]">{whyUs?.headingHighlight}</span>
          </h2>
          <p className="animate-element mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base sm:text-lg">
            {whyUs?.subheading}
          </p>
        </div>
        <div className="relative">
          {/* Vertical line, centered in left column */}
          <div className="absolute left-0 top-0 bottom-0 flex w-12 justify-center z-0">
            <div className="w-0.5 bg-[var(--bg-200)] h-full"></div>
          </div>
          <ul className="space-y-10">
            {whyUs?.reasons?.map((reason, idx) => {
              // Dynamically get icon component
              const Icon = (PhosphorIcons[reason.icon as keyof typeof PhosphorIcons] as React.ElementType)
                           || PhosphorIcons.Question;
              return (
                <li key={idx} className="animate-element flex items-start relative">
                  {/* Timeline icon and connector */}
                  <div className="relative flex flex-col items-center w-12 z-10">
                    <div className="w-10 h-10 rounded-full border border-[var(--primary-100)] bg-[var(--bg-100)] flex items-center justify-center mb-2">
                      {renderIcon(Icon)}
                    </div>
                    {/* Connector for mobile */}
                    {idx !== (whyUs?.reasons?.length ?? 0) - 1 && (
                      <div className="w-0.5 flex-1 bg-[var(--bg-200)] mx-auto sm:hidden"></div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pl-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-[var(--text-100)]">{reason.title}</h3>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded-full bg-[var(--bg-200)] text-[var(--primary-100)] text-xs font-medium">{reason.stat}</span>
                    </div>
                    <p className="text-[var(--text-200)] text-sm">{reason.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
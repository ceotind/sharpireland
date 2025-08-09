"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ComparisonPoint = ({ children, type }: { children: React.ReactNode; type: 'pro' | 'con' }) => (
  <div className="flex items-start gap-2">
    {type === 'pro' ? (
      <span className="text-[var(--primary-100)] mt-0.5">✓</span>
    ) : (
      <span className="text-[var(--error-text)] mt-0.5">✗</span>
    )}
    <span className="text-[var(--text-100)] leading-relaxed">{children}</span>
  </div>
);

export default function SaaSComparisonSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [mobileTab, setMobileTab] = useState<'win' | 'rush'>('win');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simplified header animation following established patterns
      const headerElements = sectionRef.current?.querySelectorAll(".animate-element");
      if (headerElements) {
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Clean card animation
      const cards = cardsRef.current?.querySelectorAll(".comparison-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      // Subtle hover effects
      cards?.forEach((card) => {
        const cardElement = card as HTMLElement;
        
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(cardElement, {
            y: -4,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        cardElement.addEventListener('mouseleave', () => {
          gsap.to(cardElement, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Card content
  const sharpPoints = [
    { text: 'Strategic planning & architecture', type: 'pro' },
    { text: 'Scalable & maintainable codebase', type: 'pro' },
    { text: 'Performance-first optimization', type: 'pro' },
    { text: 'Enterprise-grade security', type: 'pro' },
    { text: 'Comprehensive testing & QA', type: 'pro' },
    { text: 'Long-term support & evolution', type: 'pro' },
  ];
  const fastPoints = [
    { text: 'Rushed implementation without planning', type: 'con' },
    { text: 'Limited scalability and flexibility', type: 'con' },
    { text: 'Poor performance optimization', type: 'con' },
    { text: 'Security vulnerabilities', type: 'con' },
    { text: 'High long-term maintenance costs', type: 'con' },
    { text: 'Technical debt accumulation', type: 'con' },
  ];

  return (
    <section
      id="saas-comparison"
      ref={sectionRef}
      className="py-14 md:py-32 px-2 sm:px-4"
    >
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col gap-10 md:gap-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="animate-element text-xs sm:text-sm uppercase tracking-wide text-[var(--primary-100)] font-medium">
            Development Philosophy
          </span>
          <h2 className="animate-element mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]">
            Quality Over <span className="text-[var(--primary-100)]">Speed</span>
          </h2>
          <p className="animate-element mt-3 sm:mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80">
            We believe in building digital solutions that last, not just solutions that launch fast.
          </p>
        </div>

        {/* Mobile: Toggle between cards */}
        <div className="flex flex-col gap-6 md:hidden">
          <div className="flex justify-center mb-4">
            <div className="relative flex w-full max-w-xs">
              <button
                className={`flex-1 py-2 rounded-l-full font-bold text-base transition-all duration-200 border border-[var(--bg-300)] ${mobileTab === 'win' ? 'bg-[var(--primary-100)] text-white shadow' : 'bg-transparent text-[var(--text-200)]'}`}
                style={{ zIndex: 2 }}
                onClick={() => setMobileTab('win')}
              >
                Build to Win
              </button>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-[var(--primary-100)] text-[var(--primary-100)] font-extrabold text-xs px-3 py-1 rounded-full shadow z-10 select-none">VS</span>
              <button
                className={`flex-1 py-2 rounded-r-full font-bold text-base transition-all duration-200 border border-l-0 border-[var(--bg-300)] ${mobileTab === 'rush' ? 'bg-[var(--error-text)] text-white shadow' : 'bg-transparent text-[var(--text-200)]'}`}
                style={{ zIndex: 2 }}
                onClick={() => setMobileTab('rush')}
              >
                Build to Rush
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
          {mobileTab === 'win' ? (
            <div className="bg-[var(--bg-300)] rounded-2xl p-6 border-2 border-[var(--primary-100)]/40 shadow-lg relative flex flex-col items-center w-full">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary-100)] text-white text-xs font-bold px-4 py-1 rounded-full shadow z-10">Recommended</span>
              <div className="w-16 h-16 rounded-xl bg-[var(--primary-100)]/20 flex items-center justify-center mb-4 mt-6">
                <svg className="w-8 h-8 text-[var(--primary-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-100)] mb-2 text-center">Build to Win</h3>
              <p className="text-[var(--primary-100)] text-base font-medium text-center mb-4">Strategic, sustainable, and growth-focused development</p>
              <div className="space-y-3 w-full max-w-xs mx-auto mb-4">
                {sharpPoints.map((pt, i) => <ComparisonPoint key={i} type={pt.type as 'pro' | 'con'}>{pt.text}</ComparisonPoint>)}
              </div>
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-[var(--primary-100)]/15 text-[var(--primary-100)] mt-2">
                Sustainable success
              </span>
              <a
                href="#contact"
                className="w-full mt-6 inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[var(--primary-100)] text-white font-bold text-lg shadow-lg hover:bg-[var(--primary-200)] transition-colors duration-200 !text-white"
                style={{ color: undefined }}
              >
                Start Your Project
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="bg-[var(--bg-300)] rounded-2xl p-6 border-2 border-[var(--error-border)] shadow-lg relative flex flex-col items-center w-full">
              <div className="w-16 h-16 rounded-xl bg-[var(--error-bg)] flex items-center justify-center mb-4 mt-6">
                <svg className="w-8 h-8 text-[var(--error-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-100)] mb-2 text-center">Build to Rush</h3>
              <p className="text-[var(--error-text)] text-base font-medium text-center mb-4">Quick, cheap, and risky development</p>
              <div className="space-y-3 w-full max-w-xs mx-auto mb-4">
                {fastPoints.map((pt, i) => <ComparisonPoint key={i} type={pt.type as 'pro' | 'con'}>{pt.text}</ComparisonPoint>)}
              </div>
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-[var(--error-bg)] text-[var(--error-text)] mt-2">
                Short-term thinking
              </span>
            </div>
          )}
          </div>
        </div>

        {/* Desktop: Side-by-side with VS badge */}
        <div className="hidden md:grid grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch relative">
          {/* Fast Development Card */}
          <div className="comparison-card bg-[var(--bg-300)] rounded-2xl p-8 border-2 border-[var(--error-border)] shadow-lg flex flex-col items-center relative">
            <div className="w-16 h-16 rounded-xl bg-[var(--error-bg)] flex items-center justify-center mb-4 mt-2">
              <svg className="w-8 h-8 text-[var(--error-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-100)] mb-2 text-center">Build to Rush</h3>
            <p className="text-[var(--error-text)] text-base font-medium text-center mb-4">Quick, cheap, and risky development</p>
            <div className="space-y-3 w-full max-w-xs mx-auto mb-4">
              {fastPoints.map((pt, i) => <ComparisonPoint key={i} type={pt.type as 'pro' | 'con'}>{pt.text}</ComparisonPoint>)}
            </div>
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-[var(--error-bg)] text-[var(--error-text)] mt-2">
              Short-term thinking
            </span>
          </div>
          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="bg-white shadow-lg border-2 border-[var(--primary-100)] text-[var(--primary-100)] font-extrabold text-2xl px-8 py-4 rounded-full">VS</span>
          </div>
          {/* Sharp Digital Card */}
          <div className="comparison-card bg-[var(--bg-300)] rounded-2xl p-8 border-2 border-[var(--primary-100)]/40 shadow-lg flex flex-col items-center relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary-100)] text-white text-xs font-bold px-4 py-1 rounded-full shadow z-10">Recommended</span>
            <div className="w-16 h-16 rounded-xl bg-[var(--primary-100)]/20 flex items-center justify-center mb-4 mt-2">
              <svg className="w-8 h-8 text-[var(--primary-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-100)] mb-2 text-center">Build to Win</h3>
            <p className="text-[var(--primary-100)] text-base font-medium text-center mb-4">Strategic, sustainable, and growth-focused development</p>
            <div className="space-y-3 w-full max-w-xs mx-auto mb-4">
              {sharpPoints.map((pt, i) => <ComparisonPoint key={i} type={pt.type as 'pro' | 'con'}>{pt.text}</ComparisonPoint>)}
            </div>
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-[var(--primary-100)]/15 text-[var(--primary-100)] mt-2">
              Sustainable success
            </span>
            <a
              href="#contact"
              className="w-full mt-6 inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[var(--primary-100)] text-white font-bold text-lg shadow-lg hover:bg-[var(--primary-200)] transition-colors duration-200 !text-white"
              style={{ color: undefined }}
            >
              Start Your Project
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

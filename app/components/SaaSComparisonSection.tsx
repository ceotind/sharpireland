"use client";

import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ComparisonItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-200)] mt-2 flex-shrink-0" />
    <span className="text-[var(--text-100)] leading-relaxed">{children}</span>
  </div>
);

const SaaSComparisonSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section
      id="saas-comparison"
      ref={sectionRef}
      className="bg-[var(--bg-100)] py-20 md:py-32"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Minimal Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="animate-element text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            Development Philosophy
          </span>
          <h2 className="animate-element mt-4 text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            Quality Over <span className="text-[var(--accent-green)]">Speed</span>
          </h2>
          <p className="animate-element mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-base md:text-lg opacity-80">
            We believe in building digital solutions that last, not just solutions that launch fast.
          </p>
        </div>

        {/* Clean Comparison Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Fast Development Card */}
          <div className="comparison-card bg-[var(--bg-200)] rounded-xl p-8 border border-[var(--bg-300)]">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-100)] mb-2">Fast Development</h3>
              <p className="text-[var(--text-200)] text-sm">Quick delivery, hidden costs</p>
            </div>

            <div className="space-y-4">
              <ComparisonItem>Rushed implementation without planning</ComparisonItem>
              <ComparisonItem>Limited scalability and flexibility</ComparisonItem>
              <ComparisonItem>Poor performance optimization</ComparisonItem>
              <ComparisonItem>Security vulnerabilities</ComparisonItem>
              <ComparisonItem>High long-term maintenance costs</ComparisonItem>
              <ComparisonItem>Technical debt accumulation</ComparisonItem>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--bg-300)]">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                Short-term thinking
              </span>
            </div>
          </div>

          {/* Sharp Digital Card */}
          <div className="comparison-card bg-[var(--bg-200)] rounded-xl p-8 border border-[var(--accent-green)]/20 relative">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                Recommended
              </span>
            </div>
            
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-green)]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-100)] mb-2">Sharp Digital</h3>
              <p className="text-[var(--accent-green)] text-sm font-medium">Strategic development approach</p>
            </div>

            <div className="space-y-4">
              <ComparisonItem>Strategic planning & architecture</ComparisonItem>
              <ComparisonItem>Scalable & maintainable codebase</ComparisonItem>
              <ComparisonItem>Performance-first optimization</ComparisonItem>
              <ComparisonItem>Enterprise-grade security</ComparisonItem>
              <ComparisonItem>Comprehensive testing & QA</ComparisonItem>
              <ComparisonItem>Long-term support & evolution</ComparisonItem>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--bg-300)]">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                Sustainable success
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-[var(--text-200)] text-sm mb-4">
            Ready to build something that lasts?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--accent-green)] text-white font-medium hover:bg-[var(--accent-green)]/90 transition-colors duration-200"
            style={{ color: '#FFFFFF !important' }}
          >
            Start Your Project
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SaaSComparisonSection;

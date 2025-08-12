"use client";

import React, { useRef, useState } from 'react';
import { motion, useInView } from "framer-motion";
import { saasContainer, saasCard } from "../utils/motion-variants";

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

  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-30%" });

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
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={saasContainer}
        >
          <motion.span
            className="text-xs sm:text-sm uppercase tracking-wide text-[var(--primary-100)] font-medium"
            variants={saasCard}
          >
            Development Philosophy
          </motion.span>
          <motion.h2
            className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]"
            variants={saasCard}
          >
            Quality Over <span className="text-[var(--primary-100)]">Speed</span>
          </motion.h2>
          <motion.p
            className="mt-3 sm:mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80"
            variants={saasCard}
          >
            We believe in building digital solutions that last, not just solutions that launch fast.
          </motion.p>
        </motion.div>

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
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-lg relative flex flex-col items-center w-full">
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
            <div className="bg-white rounded-2xl p-6 border-2 border-red-500 shadow-lg relative flex flex-col items-center w-full">
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
        <motion.div
          ref={cardsRef}
          className="hidden md:grid grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch relative"
          initial="hidden"
          animate={isCardsInView ? "visible" : "hidden"}
          variants={saasContainer}
        >
          {/* Fast Development Card */}
          <motion.div
            className="bg-white rounded-2xl p-8 border-2 border-red-500 shadow-lg flex flex-col items-center relative"
            variants={saasCard}
            whileHover="hover"
          >
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
          </motion.div>
          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="bg-white shadow-lg border-2 border-[var(--primary-100)] text-[var(--primary-100)] font-extrabold text-2xl px-8 py-4 rounded-full">VS</span>
          </div>
          {/* Sharp Digital Card */}
          <motion.div
            className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-lg flex flex-col items-center relative"
            variants={saasCard}
            whileHover="hover"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { saasContainer, saasCard, heroButton } from "../utils/motion-variants";

const seoFeatures = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Test Your Website's SEO Performance",
    description: "Get comprehensive analysis of your site's SEO health, including technical issues, content optimization, and performance metrics."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Get Actionable Recommendations",
    description: "Receive specific, prioritized suggestions to improve your search rankings and user experience based on current SEO best practices."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Identify Content Opportunities",
    description: "Discover gaps in your content strategy and find opportunities to create engaging content that ranks well and converts visitors."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy-First Analysis",
    description: "Your data stays secure with our privacy-focused approach. No signup required, no data stored, just instant professional SEO insights."
  }
];

export default function SEOAnalyzerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const isContentInView = useInView(contentRef, { once: true, margin: "-30%" });

  return (
    <section
      id="seo-analyzer"
      ref={sectionRef}
      className="bg-[var(--bg-100)] py-12 md:py-32 px-2 sm:px-4"
      aria-labelledby="seo-analyzer-heading"
    >
      <div id="seo-analyzer-div-1" className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col gap-8 md:gap-12">
        {/* Header Section */}
        <motion.div
          id="seo-analyzer-div-2"
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={saasContainer}
        >
          <motion.span
            id="seo-analyzer-div-3"
            className="text-xs sm:text-sm uppercase tracking-wide text-[var(--primary-100)] font-medium"
            variants={saasCard}
          >
            Free SEO Tools
          </motion.span>
          <motion.h2
            id="seo-analyzer-heading"
            className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]"
            variants={saasCard}
          >
            Boost Your Website's <span className="text-[var(--primary-100)]">SEO Performance</span>
          </motion.h2>
          <motion.p
            id="seo-analyzer-div-4"
            className="mt-3 sm:mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80"
            variants={saasCard}
          >
            Analyze your website's SEO health instantly with our free professional-grade tool. Get actionable insights to improve your search rankings and create content that engages your audience.
          </motion.p>
        </motion.div>

        {/* Content Section */}
        <motion.div
          id="seo-analyzer-div-5"
          ref={contentRef}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center"
          initial="hidden"
          animate={isContentInView ? "visible" : "hidden"}
          variants={saasContainer}
        >
          {/* Features List */}
          <div id="seo-analyzer-div-6" className="order-2 lg:order-1">
            <div id="seo-analyzer-div-7" className="space-y-6">
              {seoFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  id={`seo-analyzer-div-${8 + index}`}
                  className="flex items-start gap-4"
                  variants={saasCard}
                >
                  <div id={`seo-analyzer-div-${12 + index}`} className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--primary-100)]/10 flex items-center justify-center text-[var(--primary-100)]">
                    {feature.icon}
                  </div>
                  <div id={`seo-analyzer-div-${16 + index}`}>
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-100)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-200)] text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call-to-Action Card */}
          <motion.div
            id="seo-analyzer-div-20"
            className="order-1 lg:order-2"
            variants={saasCard}
          >
            <div id="seo-analyzer-div-21" className="bg-gradient-to-br from-[var(--primary-100)]/5 to-[var(--primary-100)]/10 rounded-2xl p-6 sm:p-8 border border-[var(--primary-100)]/20 text-center">
              <div id="seo-analyzer-div-22" className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--primary-100)] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-100)] mb-3">
                Ready to Analyze Your Website?
              </h3>
              
              <p className="text-[var(--text-200)] text-sm sm:text-base mb-6 leading-relaxed">
                Get instant, professional SEO insights for free. No signup required, results in seconds.
              </p>
              
              <div id="seo-analyzer-div-23" className="space-y-3 mb-6">
                <div id="seo-analyzer-div-24" className="flex items-center justify-center gap-2 text-sm text-[var(--text-200)]">
                  <svg className="w-4 h-4 text-[var(--primary-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% Free Analysis</span>
                </div>
                <div id="seo-analyzer-div-25" className="flex items-center justify-center gap-2 text-sm text-[var(--text-200)]">
                  <svg className="w-4 h-4 text-[var(--primary-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant Results</span>
                </div>
                <div id="seo-analyzer-div-26" className="flex items-center justify-center gap-2 text-sm text-[var(--text-200)]">
                  <svg className="w-4 h-4 text-[var(--primary-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Privacy Protected</span>
                </div>
              </div>
              
              <motion.div
                id="seo-analyzer-div-27"
                variants={heroButton}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/seo-analyzer"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-[var(--primary-100)] text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:bg-[var(--primary-200)] transition-colors duration-200 group"
                  aria-label="Start free SEO analysis of your website"
                >
                  Analyze My Website Now
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
              
              <p className="text-xs text-[var(--text-300)] mt-4">
                Join thousands of websites already optimized with our free SEO analyzer
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
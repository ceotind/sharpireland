"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  featureCardVariants as createFeatureCardVariants,
  type CubicBezier,
} from "../../utils/seo-variants";

export interface FeatureCardsProps {
  prefersReducedMotion: boolean;
  ease: CubicBezier;
}

export default function FeatureCards({
  prefersReducedMotion,
  ease,
}: FeatureCardsProps) {
  const featureCardVariants = createFeatureCardVariants(
    prefersReducedMotion,
    ease
  );

  const features = [
    {
      title: "Advanced Technical SEO",
      description:
        "Comprehensive analysis including Core Web Vitals, security headers, and structured data detection",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--primary-100)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Content Quality Insights",
      description:
        "Detailed content analysis including readability scores, keyword density, and word count metrics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--primary-100)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Competitive Intelligence",
      description:
        "Estimate your site's backlink profile and SERP feature opportunities compared to competitors",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--primary-100)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <motion.div
      id="seo-features-grid"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
    >
      {features.map((feature, index) => (
        <motion.div
          id={`seo-feature-card-${index + 1}`}
          key={index}
          className="p-6 rounded-2xl transition-all bg-[var(--bg-200)] border border-[var(--bg-300)] shadow-sm"
          custom={index}
          variants={featureCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover="hover"
          style={{ willChange: "transform, opacity" }}
        >
          <div
            id={`seo-feature-icon-${index + 1}`}
            className="rounded-full p-3 inline-block mb-4 bg-[var(--bg-300)]"
          >
            {feature.icon}
          </div>
          <h3
            className="text-xl font-semibold mb-2 text-[var(--text-100)]"
          >
            {feature.title}
          </h3>
          <p
            className="text-base md:text-lg text-[var(--text-200)]"
          >
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
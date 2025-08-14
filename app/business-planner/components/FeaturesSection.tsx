"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { viewportFadeIn, staggerContainer, listItem } from "../../utils/motion-variants";

const features = [
  {
    id: "feature-strategic-planning",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Strategic Planning",
    description: "Get comprehensive business strategies tailored to your industry, market, and goals. From market analysis to competitive positioning.",
  },
  {
    id: "feature-financial-modeling",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Financial Modeling",
    description: "Build realistic financial projections, cash flow forecasts, and pricing strategies that align with your business model.",
  },
  {
    id: "feature-market-research",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Market Research",
    description: "Understand your target audience, analyze competitors, and identify market opportunities with AI-powered insights.",
  },
  {
    id: "feature-growth-strategies",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Growth Strategies",
    description: "Develop scalable growth plans, marketing strategies, and operational improvements to accelerate your business.",
  },
  {
    id: "feature-risk-assessment",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Risk Assessment",
    description: "Identify potential risks, create mitigation strategies, and build resilient business processes for long-term success.",
  },
  {
    id: "feature-actionable-insights",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Actionable Insights",
    description: "Receive specific, implementable recommendations with clear next steps and timelines for maximum impact.",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="business-planner-features-section"
      ref={ref}
      className="py-24 bg-[var(--bg-100)]"
      aria-labelledby="features-heading"
    >
      <div id="business-planner-features-container" className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          id="business-planner-features-header"
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-100)] mb-6"
          >
            Everything You Need to
            <br />
            <span className="font-semibold text-[var(--primary-100)]">Build Your Business</span>
          </h2>
          <p
            id="business-planner-features-description"
            className="max-w-3xl mx-auto text-lg text-[var(--text-200)] leading-relaxed"
          >
            Our AI business planner provides comprehensive support for solo entrepreneurs, 
            freelancers, and small business owners at every stage of their journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          id="business-planner-features-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              id={feature.id}
              className="group"
              variants={listItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="h-full p-8 rounded-2xl border transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: "var(--bg-100)",
                  borderColor: "var(--bg-300)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Icon */}
                <div
                  id={`${feature.id}-icon-wrapper`}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-colors duration-300"
                  style={{
                    background: "linear-gradient(135deg, var(--primary-100), var(--primary-300))",
                    color: "var(--white-color)",
                  }}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3
                  id={`${feature.id}-title`}
                  className="text-xl font-semibold text-[var(--text-100)] mb-4"
                >
                  {feature.title}
                </h3>
                <p
                  id={`${feature.id}-description`}
                  className="text-[var(--text-200)] leading-relaxed"
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          id="business-planner-features-cta"
          className="text-center mt-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <p
            id="business-planner-features-cta-text"
            className="text-lg text-[var(--text-200)] mb-6"
          >
            Ready to transform your business ideas into actionable plans?
          </p>
          <motion.button
            id="business-planner-features-cta-button"
            className="btn-primary px-8 py-4 rounded-xl text-base font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const pricingSection = document.getElementById('business-planner-pricing-section');
              pricingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Pricing Plans
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
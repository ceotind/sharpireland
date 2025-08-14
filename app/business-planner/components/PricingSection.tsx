"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { viewportFadeIn, staggerContainer, listItem } from "../../utils/motion-variants";

const pricingPlans = [
  {
    id: "pricing-free-tier",
    name: "Free Tier",
    price: "€0",
    period: "/month",
    description: "Perfect for getting started with AI business planning",
    features: [
      "10 AI conversations per month",
      "Basic business planning templates",
      "Market research insights",
      "Financial planning basics",
      "Email support",
      "Access to community resources",
    ],
    limitations: [
      "Limited conversation history",
      "Basic export options",
    ],
    buttonText: "Start Free",
    buttonStyle: "secondary",
    popular: false,
  },
  {
    id: "pricing-pro-tier",
    name: "Pro Plan",
    price: "€5",
    period: "/month",
    description: "Unlimited access for serious entrepreneurs",
    features: [
      "50 AI conversations per month",
      "Advanced business planning tools",
      "Comprehensive market analysis",
      "Detailed financial modeling",
      "Priority email support",
      "Export to PDF/Word formats",
      "Custom business templates",
      "Competitor analysis reports",
      "Growth strategy recommendations",
    ],
    limitations: [],
    buttonText: "Upgrade to Pro",
    buttonStyle: "primary",
    popular: true,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  const handlePlanSelection = (planId: string) => {
    if (planId === "pricing-free-tier") {
      router.push("/login?redirect=/business-planner/chat");
    } else {
      router.push("/login?redirect=/business-planner/upgrade");
    }
  };

  return (
    <section
      id="business-planner-pricing-section"
      ref={ref}
      className="py-24"
      style={{ background: "var(--bg-200)" }}
      aria-labelledby="pricing-heading"
    >
      <div id="business-planner-pricing-container" className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          id="business-planner-pricing-header"
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-100)] mb-6"
          >
            Simple, Transparent
            <br />
            <span className="font-semibold text-[var(--primary-100)]">Pricing</span>
          </h2>
          <p
            id="business-planner-pricing-description"
            className="max-w-3xl mx-auto text-lg text-[var(--text-200)] leading-relaxed"
          >
            Start free and upgrade when you're ready. No hidden fees, no long-term contracts.
            Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          id="business-planner-pricing-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              id={plan.id}
              className={`relative group ${plan.popular ? 'lg:scale-105' : ''}`}
              variants={listItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  id={`${plan.id}-popular-badge`}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <span
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-green), var(--accent-green-base))",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`h-full p-8 rounded-2xl border transition-all duration-300 group-hover:shadow-xl ${
                  plan.popular ? 'border-[var(--primary-100)]' : ''
                }`}
                style={{
                  background: "var(--bg-100)",
                  borderColor: plan.popular ? "var(--primary-100)" : "var(--bg-300)",
                  boxShadow: plan.popular 
                    ? "0 8px 32px rgba(15, 81, 221, 0.15)" 
                    : "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Plan Header */}
                <div id={`${plan.id}-header`} className="text-center mb-8">
                  <h3
                    id={`${plan.id}-name`}
                    className="text-2xl font-semibold text-[var(--text-100)] mb-2"
                  >
                    {plan.name}
                  </h3>
                  <div id={`${plan.id}-price-wrapper`} className="mb-4">
                    <span
                      id={`${plan.id}-price`}
                      className="text-4xl font-bold text-[var(--primary-100)]"
                    >
                      {plan.price}
                    </span>
                    <span
                      id={`${plan.id}-period`}
                      className="text-lg text-[var(--text-200)]"
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    id={`${plan.id}-description`}
                    className="text-[var(--text-200)] leading-relaxed"
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div id={`${plan.id}-features`} className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        id={`${plan.id}-feature-${index}`}
                        className="flex items-start gap-3"
                      >
                        <svg
                          className="w-5 h-5 text-[var(--accent-green)] mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-[var(--text-100)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div id={`${plan.id}-limitations`} className="mt-6 pt-6 border-t border-[var(--bg-300)]">
                      <p className="text-sm text-[var(--text-200)] mb-3">Limitations:</p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li
                            key={index}
                            id={`${plan.id}-limitation-${index}`}
                            className="flex items-start gap-3"
                          >
                            <svg
                              className="w-4 h-4 text-[var(--text-300)] mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-[var(--text-300)]">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  id={`${plan.id}-button`}
                  className={`w-full py-4 px-6 rounded-xl text-base font-medium transition-all duration-200 ${
                    plan.buttonStyle === 'primary'
                      ? 'btn-primary'
                      : 'btn-secondary hover:bg-[var(--bg-200)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          id="business-planner-pricing-note"
          className="text-center mt-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <p className="text-[var(--text-200)] text-sm">
            All plans include secure data handling and GDPR compliance. 
            <br />
            Need a custom solution? <a href="/contact" className="link-primary">Contact us</a> for enterprise pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
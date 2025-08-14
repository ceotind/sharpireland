"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { heroFadeIn, heroElement, heroButton } from "../../utils/motion-variants";

export default function HeroSection() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleStartPlanning = () => {
    if (isLoggedIn) {
      router.push("/dashboard/business-planner");
    } else {
      router.push("/login?redirect=/dashboard/business-planner");
    }
  };

  return (
    <motion.section
      id="business-planner-hero-section"
      className="relative min-h-screen pt-36 overflow-hidden"
      aria-label="Business planner hero"
      initial="hidden"
      animate="visible"
      variants={heroFadeIn}
    >
      {/* Gradient background */}
      <div
        id="business-planner-hero-bg"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-100) 0%, var(--primary-300) 50%, var(--accent-green) 100%)",
        }}
      />

      {/* Overlay for better text readability */}
      <div
        id="business-planner-hero-overlay"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Content container */}
      <div
        id="business-planner-hero-container"
        className="relative z-10 w-full max-w-screen-xl mx-auto px-6 lg:px-8"
      >
        <div id="business-planner-hero-content" className="text-center">
          {/* Announcement pill */}
          <motion.div id="business-planner-hero-announcement-wrap" variants={heroElement}>
            <div
              id="business-planner-hero-announcement"
              className="inline-flex items-center gap-3 rounded-2xl border px-4 py-2 mb-8"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                id="business-planner-hero-announcement-text"
                className="text-[12px] tracking-[0.14em] uppercase text-[var(--text-200)]"
              >
                AI-Powered Business Planning
              </span>
              <span
                id="business-planner-hero-announcement-sep"
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent-green)" }}
              />
              <span
                id="business-planner-hero-announcement-chip"
                className="text-[11px] font-bold leading-none rounded-md px-2.5 py-1"
                style={{
                  color: "var(--white-color)",
                  backgroundColor: "var(--accent-green)",
                  boxShadow: "0 8px 20px rgba(16,185,129,0.28)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Free Tier Available
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div id="business-planner-hero-heading-wrap" variants={heroElement}>
            <h1
              id="business-planner-hero-heading"
              className="text-white font-light leading-[1.08] mb-6"
              style={{
                fontSize: "clamp(2.4rem, 6.2vw, 4.8rem)",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              AI Business Planner for
              <br />
              <span className="font-semibold">Solo Entrepreneurs</span>
            </h1>

            <p
              id="business-planner-hero-subtext"
              className="max-w-3xl mx-auto text-[1.0625rem] md:text-[1.125rem] leading-relaxed text-white/90 mb-8"
            >
              Get personalized business advice, strategic planning, and actionable insights 
              powered by AI. Perfect for startups, freelancers, and small business owners 
              looking to grow smarter.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            id="business-planner-hero-buttons"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={heroElement}
          >
            <motion.button
              id="business-planner-hero-btn-start"
              className="px-8 py-4 rounded-xl text-base font-medium text-[var(--primary-100)] bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              variants={heroButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleStartPlanning}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Start Planning for Free"}
            </motion.button>

            <motion.button
              id="business-planner-hero-btn-learn"
              className="px-8 py-4 rounded-xl text-base font-medium text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              variants={heroButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                const featuresSection = document.getElementById('business-planner-features-section');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            id="business-planner-hero-trust"
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm"
            variants={heroElement}
          >
            <div id="business-planner-hero-trust-item-1" className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>10 Free Conversations/Month</span>
            </div>
            <div id="business-planner-hero-trust-item-2" className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
            <div id="business-planner-hero-trust-item-3" className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Instant Setup</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        id="business-planner-hero-bottom-fade"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--bg-100), transparent)",
        }}
      />
    </motion.section>
  );
}
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceCTAData } from "../data/services-content";
import IconRenderer from "./IconRenderer";
import { Star } from "@phosphor-icons/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface EnhancedCTAProps {
  content: ServiceCTAData;
}

export default function EnhancedCTA({ content }: EnhancedCTAProps) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;

    // Animate CTA elements
    const elements = ctaRef.current.querySelectorAll(".animate-element");
    if (elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // Animate CTA buttons with hover effects
    const ctaButtons = ctaRef.current.querySelectorAll(".cta-button");
    ctaButtons.forEach((button) => {
      const handleMouseEnter = () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      };
      
      const handleMouseLeave = () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} weight="fill" className="text-[var(--primary-300)]" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} weight="regular" className="text-[var(--primary-300)]" />
      );
    }

    return stars;
  };

  return (
    <div
      id="enhanced-cta-section"
      ref={ctaRef}
      className="bg-[var(--bg-100)] p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl border border-[var(--bg-300)] shadow-lg text-center max-w-5xl mx-auto"
      aria-labelledby="enhanced-cta-title"
    >
      {/* CTA Header */}
      <div id="enhanced-cta-header" className="animate-element mb-6 sm:mb-8">
        <h3 id="enhanced-cta-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-100)] mb-3 sm:mb-4 leading-tight">
          Ready to Transform Your Business?
        </h3>
        <p className="text-[var(--text-200)] text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Join hundreds of successful businesses that have accelerated their growth with our proven strategies.
        </p>
      </div>

      {/* CTA Buttons */}
      {content.ctaVariants && (
        <div id="enhanced-cta-buttons" className="animate-element mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
            {content.ctaVariants.map((cta) => (
              <Link
                key={cta.id}
                href={cta.link}
                id={`enhanced-cta-${cta.id}`}
                className={`cta-button group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto min-h-[48px] ${
                  cta.style === "primary"
                    ? "bg-[var(--accent-green)] text-[var(--white-color)] hover:bg-[var(--primary-100)] shadow-lg hover:shadow-xl"
                    : "bg-[var(--bg-200)] text-[var(--text-100)] border-2 border-[var(--bg-300)] hover:border-[var(--accent-green)] hover:shadow-md"
                }`}
                aria-describedby={`enhanced-cta-${cta.id}-description`}
              >
                <IconRenderer icon={{ name: cta.icon, size: 18 }} />
                <span className="text-sm sm:text-base font-semibold">{cta.text}</span>
                <div className="hidden group-hover:block transition-all duration-300">
                  <IconRenderer icon={{ name: "ArrowRight", size: 14 }} />
                </div>
              </Link>
            ))}
          </div>
          
          {/* CTA Descriptions */}
          <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
            {content.ctaVariants.map((cta) => (
              <p
                key={`${cta.id}-desc`}
                id={`enhanced-cta-${cta.id}-description`}
                className="text-xs sm:text-sm text-[var(--text-200)] opacity-80"
              >
                {cta.description}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      {content.trustIndicators && (
        <div id="enhanced-cta-trust-indicators" className="animate-element mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {content.trustIndicators.map((indicator) => (
              <div
                key={indicator.id}
                id={`trust-indicator-${indicator.id}`}
                className="text-center p-4 sm:p-5 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--accent-green)] mb-1 sm:mb-2">
                  {indicator.value}
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-200)] font-medium">
                  {indicator.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Proof */}
      {content.socialProof && (
        <div id="enhanced-cta-social-proof" className="animate-element mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(content.socialProof.rating)}
              </div>
              <span className="text-sm sm:text-base font-semibold text-[var(--text-100)]">
                {content.socialProof.rating}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-200)] text-center sm:text-left">
              {content.socialProof.reviewCount} reviews on {content.socialProof.platform}
            </div>
          </div>
        </div>
      )}

      {/* Fallback CTA if no variants */}
      {!content.ctaVariants && (
        <div id="enhanced-cta-fallback" className="animate-element mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
            <Link
              href={content.primaryLink}
              className="cta-button bg-[var(--accent-green)] text-[var(--white-color)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[var(--primary-100)] transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto min-h-[48px] flex items-center justify-center"
            >
              {content.primaryText}
            </Link>
            <Link
              href={content.secondaryLink}
              className="cta-button bg-[var(--bg-200)] text-[var(--text-100)] border-2 border-[var(--bg-300)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:border-[var(--accent-green)] hover:shadow-md transition-all duration-300 w-full sm:w-auto min-h-[48px] flex items-center justify-center"
            >
              {content.secondaryText}
            </Link>
          </div>
        </div>
      )}

      {/* Additional Trust Message */}
      <div id="enhanced-cta-trust-message" className="animate-element">
        <p className="text-xs sm:text-sm text-[var(--text-200)] opacity-80 leading-relaxed">
          ✓ No long-term contracts ✓ 30-day money-back guarantee ✓ Free consultation
        </p>
      </div>
    </div>
  );
}
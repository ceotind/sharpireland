"use client";

import React from "react";
import { ServiceHeroContent } from "../data/services-content";
import IconRenderer from "./IconRenderer";
import { Star } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

interface ServiceHeroProps {
  content: ServiceHeroContent;
}

export default function ServiceHero({ content }: ServiceHeroProps) {

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
    <section
      id="services-hero-root"
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-[var(--bg-100)] via-[var(--bg-200)] to-[var(--bg-100)]"
      aria-labelledby="services-hero-title"
    >
      {/* Background Elements */}
      <div id="services-hero-background-elements" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div id="services-hero-bg-circle-1" className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-green)] rounded-full opacity-5"></div>
        <div id="services-hero-bg-circle-2" className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--accent-green)] rounded-full opacity-3"></div>
      </div>

      <div
        id="services-hero-container"
        className="relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Main Hero Content */}
        <div id="services-hero-main-content" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 sm:mb-16">
          {/* Left Column: Content */}
          <div id="services-hero-content-column" className="text-center lg:text-left">
            <h1
              id="services-hero-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-100)] leading-tight mb-4 sm:mb-6"
            >
              {content.title}
            </h1>
            <p
              id="services-hero-subtitle"
              className="text-lg sm:text-xl md:text-2xl text-[var(--text-200)] mb-3 sm:mb-4"
            >
              {content.subtitle}
            </p>
            <p
              id="services-hero-description"
              className="text-sm sm:text-base md:text-lg text-[var(--text-200)] opacity-80 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div
              id="services-hero-cta-buttons"
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8"
            >
              <Link
                href={content.primaryCtaLink}
                id="services-hero-primary-cta"
                className="group flex items-center justify-center gap-3 bg-[var(--primary-100)] text-[var(--white-color)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:bg-[var(--primary-200)] transition-all duration-200 hover:shadow-xl hover:scale-105"
                aria-label={`${content.primaryCtaText} - Navigate to contact page`}
              >
                <IconRenderer icon={{ name: "ArrowRight", size: 20 }} />
                <span>{content.primaryCtaText}</span>
              </Link>
              <Link
                href={content.secondaryCtaLink}
                id="services-hero-secondary-cta"
                className="group flex items-center justify-center gap-3 bg-[var(--bg-100)] text-[var(--text-100)] border-2 border-[var(--bg-300)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[var(--bg-200)] hover:border-[var(--primary-100)] transition-all duration-200"
                aria-label={`${content.secondaryCtaText} - View case studies`}
              >
                <IconRenderer icon={{ name: "Eye", size: 20 }} />
                <span>{content.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div id="services-hero-social-proof">
              <div id="services-hero-social-proof-card" className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] max-w-md mx-auto lg:mx-0">
                <div id="services-hero-rating-container" className="flex items-center gap-2">
                  <div id="services-hero-stars" className="flex">
                    {renderStars(content.socialProof.rating)}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-100)]">
                    {content.socialProof.rating}
                  </span>
                </div>
                <div id="services-hero-review-text" className="text-sm text-[var(--text-200)]">
                  {content.socialProof.reviewCount} reviews on {content.socialProof.platform}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div id="services-hero-image-column" className="order-first lg:order-last">
            <div id="services-hero-image-container" className="relative">
              {/* Main Image Container */}
              <div id="services-hero-main-image" className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/young_adult_man_admire_an_paint_back.png"
                  alt="Young adult man admiring artwork - representing creative digital solutions and artistic approach to web development"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
                
                {/* Image Overlay for Better Text Contrast */}
                <div id="services-hero-image-overlay" className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Decorative Elements */}
              <div id="services-hero-decoration-1" className="absolute -top-4 -right-4 w-12 sm:w-16 h-12 sm:h-16 bg-[var(--accent-green)] rounded-full opacity-20"></div>
              <div id="services-hero-decoration-2" className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-10 sm:w-12 h-10 sm:h-12 bg-[var(--accent-green)] rounded-full opacity-10"></div>
              
              {/* Additional Floating Element for Visual Interest */}
              <div id="services-hero-decoration-3" className="absolute top-1/2 -left-2 sm:-left-3 w-5 sm:w-6 h-5 sm:h-6 bg-[var(--accent-green)] rounded-full opacity-30 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Trust Indicators Section */}
        <div id="services-hero-trust-indicators">
          <div id="services-hero-trust-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {content.trustIndicators.map((indicator) => (
              <div
                key={indicator.id}
                id={`trust-indicator-${indicator.id}`}
                className="text-center p-4 sm:p-6 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--accent-green)] mb-1 sm:mb-2">
                  {indicator.value}
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-200)] font-medium leading-tight">
                  {indicator.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
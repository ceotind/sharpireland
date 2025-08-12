"use client";

import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import GoogleAdsPerformance from "./GoogleAdsPerformance";
import Link from "next/link";
import { GoogleAdsContent, commonCtaContent } from "../data/services-content";

interface GoogleAdsSectionProps {
  content: GoogleAdsContent;
}

export default function GoogleAdsSection({ content }: GoogleAdsSectionProps) {
  return (
    <section id="services-google-ads-root" className="bg-[var(--bg-100)] py-20 md:py-32">
      <div id="google-ads-container" className="w-full max-w-screen-xl mx-auto px-6 lg:px-8 flex flex-col gap-12 md:gap-16">
        {/* Section Header */}
        <div id="google-ads-header-wrapper">
          <SectionHeader
            id="services-google-ads"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        {/* Google Ads Performance Dashboard */}
        <div id="google-ads-performance-wrapper">
          <GoogleAdsPerformance content={content} />
        </div>

        {/* Features Grid */}
        <div id="google-ads-features-wrapper">
          <FeatureGrid id="google-ads-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="google-ads-links-wrapper" className="text-center">
          <div id="google-ads-links" className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/contact"
              id="google-ads-contact-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
            >
              Contact us about Google Ads management
            </Link>
            <Link
              href="/case-studies"
              id="google-ads-case-studies-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
            >
              View our Google Ads case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="google-ads-cta-wrapper" className="text-center mt-8 md:mt-12">
          <ServiceCTA
            id="google-ads-cta-section"
            primaryText={commonCtaContent.primaryText}
            secondaryText={commonCtaContent.secondaryText}
            primaryLink={commonCtaContent.primaryLink}
            secondaryLink={commonCtaContent.secondaryLink}
          />
        </div>
      </div>
    </section>
  );
}
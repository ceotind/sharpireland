"use client";

import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import SocialMediaDashboard from "./SocialMediaDashboard";
import Link from "next/link";
import { SocialMediaContent, commonCtaContent } from "../data/services-content";

interface SocialMediaSectionProps {
  content: SocialMediaContent;
}

export default function SocialMediaSection({ content }: SocialMediaSectionProps) {

  return (
    <section
      id="services-social-root"
      className="bg-[var(--bg-100)] py-20 md:py-32"
      aria-labelledby="social-media-section-title"
    >
      <div id="social-media-container" className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-12">
        <div id="social-media-header-wrapper">
          <SectionHeader
            id="social-media-section-header"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          {/* Hidden for screen readers but used for ARIA labeling */}
          <span id="social-media-section-title" className="sr-only">{content.title}</span>
        </div>

        {/* Social Media Dashboard */}
        <div id="social-media-dashboard-wrapper">
          <SocialMediaDashboard content={content} />
        </div>

        {/* Features Grid */}
        <div id="social-media-features-wrapper">
          <FeatureGrid id="social-media-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="social-media-links-wrapper" className="text-center">
          <div id="social-media-links" className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/contact"
              id="social-media-contact-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
              aria-label="Contact us about social media management services"
            >
              Contact us about social media management
            </Link>
            <Link
              href="/case-studies"
              id="social-media-case-studies-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
              aria-label="View our social media case studies and success stories"
            >
              View our social media case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="social-media-cta-wrapper" className="text-center mt-6 md:mt-8">
          <ServiceCTA
            id="social-media-cta-section"
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
"use client";

import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import MetaAdsTesting from "./MetaAdsTesting";
import Link from "next/link";
import { MetaAdsContent, commonCtaContent } from "../data/services-content";

interface MetaAdsSectionProps {
  content: MetaAdsContent;
}

export default function MetaAdsSection({ content }: MetaAdsSectionProps) {
  return (
    <section id="services-meta-ads-root" className="bg-[var(--bg-100)] py-16 sm:py-20 md:py-24 lg:py-32">
      <div id="meta-ads-container" className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-8 sm:gap-10 md:gap-12">
        {/* Section Header */}
        <div id="meta-ads-header-wrapper">
          <SectionHeader
            id="services-meta-ads"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        {/* Meta Ads Testing Dashboard */}
        <div id="meta-ads-testing-wrapper">
          <MetaAdsTesting content={content} />
        </div>

        {/* Features Grid */}
        <div id="meta-ads-features-wrapper">
          <FeatureGrid id="meta-ads-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="meta-ads-links-wrapper" className="text-center">
          <div id="meta-ads-links" className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <Link
              href="/contact"
              id="meta-ads-contact-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
            >
              Contact us about Meta advertising management
            </Link>
            <Link
              href="/case-studies"
              id="meta-ads-case-studies-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-3 py-2 font-medium text-sm sm:text-base transition-colors duration-200"
            >
              View our Meta advertising case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="meta-ads-cta-wrapper" className="text-center mt-6 sm:mt-8">
          <ServiceCTA
            id="meta-ads-cta-section"
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
"use client";

import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import AutomationWorkflow from "./AutomationWorkflow";
import Link from "next/link";
import { AutomationContent, commonCtaContent } from "../data/services-content";

interface AutomationSectionProps {
  content: AutomationContent;
}

export default function AutomationSection({ content }: AutomationSectionProps) {
  return (
    <section id="services-automation-root" className="bg-[var(--bg-100)] py-16 sm:py-20 md:py-32">
      <div id="automation-container" className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 sm:gap-10 md:gap-12">
        <div id="automation-header-wrapper">
          <SectionHeader
            id="services-automation"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>
        
        {/* Automation Workflow Dashboard */}
        <div id="automation-workflow-wrapper">
          <AutomationWorkflow content={content} />
        </div>
        
        {/* Features Grid */}
        <div id="automation-features-wrapper">
          <FeatureGrid id="automation-features-grid" features={content.features} />
        </div>
        
        {/* Internal Links */}
        <div id="automation-links-wrapper" className="text-center">
          <div id="automation-links" className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-8">
            <Link
              href="/contact"
              id="automation-contact-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-2 py-1 font-medium"
            >
              Contact us about automation solutions
            </Link>
            <Link
              href="/case-studies"
              id="automation-case-studies-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-xl px-2 py-1 font-medium"
            >
              View our automation case studies
            </Link>
          </div>
        </div>
        
        {/* CTA Section */}
        <div id="automation-cta-wrapper" className="text-center mt-6 sm:mt-8">
          <ServiceCTA
            id="automation-cta-section"
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
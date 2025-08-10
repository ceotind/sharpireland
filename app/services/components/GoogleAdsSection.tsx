"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import Link from "next/link";
import { GoogleAdsContent, commonCtaContent } from "../data/services-content";

gsap.registerPlugin(ScrollTrigger);

interface GoogleAdsSectionProps {
  content: GoogleAdsContent;
}

export default function GoogleAdsSection({ content }: GoogleAdsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);
  const [activeCampaignType, setActiveCampaignType] = useState("search");

  // Ensure we have a default campaign type
  const defaultCampaign = content.campaignTypes[0];
  
  // Get the active campaign type data with fallback
  const currentCampaign = content.campaignTypes.find(
    (campaign) => campaign.id === activeCampaignType
  ) || defaultCampaign;

  useEffect(() => {
    if (sectionRef.current) {
      // Animate section elements
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".animate-element"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, []);

  // Animation for metric chips when campaign type changes
  useEffect(() => {
    if (funnelRef.current) {
      const metricChips = funnelRef.current.querySelectorAll(".metric-chip");
      
      gsap.fromTo(
        metricChips,
        { opacity: 0, scale: 0.8, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [activeCampaignType]);

  return (
    <section id="services-google-ads-root" ref={sectionRef} className="bg-[var(--bg-100)] py-20 md:py-32">
      <div id="google-ads-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div id="google-ads-header-wrapper" className="animate-element">
          <SectionHeader
            id="services-google-ads"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        {/* Campaign Type Tabs */}
        <div id="google-ads-campaign-tabs-wrapper" className="animate-element">
          <div id="google-ads-campaign-tabs" className="flex flex-wrap justify-center gap-2 md:gap-4">
            {content.campaignTypes.map((campaign) => (
              <button
                key={campaign.id}
                id={`google-ads-tab-${campaign.id}`}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  activeCampaignType === campaign.id
                    ? "bg-[var(--accent-green)] text-[var(--white-color)]"
                    : "bg-[var(--bg-200)] text-[var(--text-200)] hover:bg-[var(--bg-300)]"
                }`}
                onClick={() => setActiveCampaignType(campaign.id)}
                aria-pressed={activeCampaignType === campaign.id}
                aria-controls="google-ads-funnel-visualization"
              >
                {campaign.name}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Description */}
        <div id="google-ads-campaign-description-wrapper" className="animate-element">
          <div id="google-ads-campaign-description" className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--text-200)] text-base md:text-lg">
              {currentCampaign.description}
            </p>
          </div>
        </div>

        {/* Conversion Funnel Visualization */}
        <div id="google-ads-funnel-wrapper" className="animate-element">
          <div 
            id="google-ads-funnel-visualization" 
            ref={funnelRef}
            className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
            aria-label={`${currentCampaign.name} metrics funnel`}
          >
            <div id="google-ads-funnel-header" className="mb-6 flex justify-between items-center">
              <h3 id="google-ads-funnel-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton">
                Campaign Performance Funnel
              </h3>
              <div id="google-ads-funnel-legend" className="flex gap-3">
                <span className="text-sm text-[var(--text-200)] font-inter">
                  <span className="inline-block w-3 h-3 rounded-full bg-[var(--accent-green)] mr-1"></span>
                  Conversion Metrics
                </span>
                <span className="text-sm text-[var(--text-200)] font-inter">
                  <span className="inline-block w-3 h-3 rounded-full bg-[var(--bg-300)] mr-1"></span>
                  Traffic Metrics
                </span>
              </div>
            </div>

            {/* Funnel Steps */}
            <div id="google-ads-funnel-steps" className="relative">
              {/* Funnel Shape Background */}
              <div id="google-ads-funnel-shape" className="absolute inset-0 z-0">
                <div className="h-full w-full max-w-4xl mx-auto flex flex-col">
                  <div className="h-1/3 bg-gradient-to-b from-[var(--bg-200)] to-[var(--bg-300)] opacity-10 rounded-t-lg"></div>
                  <div className="h-1/3 bg-gradient-to-b from-[var(--bg-300)] to-[var(--accent-green-base)] opacity-10"></div>
                  <div className="h-1/3 bg-gradient-to-b from-[var(--accent-green-base)] to-[var(--accent-green)] opacity-10 rounded-b-lg"></div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div id="google-ads-metrics-grid" className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {currentCampaign.metrics.map((metric) => (
                  <div
                    key={metric.id}
                    id={`google-ads-metric-${metric.id}`}
                    className="metric-chip bg-[var(--bg-100)] p-4 rounded-lg border border-[var(--bg-300)] shadow-sm flex flex-col items-center text-center"
                    style={{ borderColor: metric.color }}
                  >
                    <div id={`google-ads-metric-${metric.id}-value-container`} className="mb-1">
                      <span
                        id={`google-ads-metric-${metric.id}-value`}
                        className="text-2xl md:text-3xl font-bold text-[var(--text-100)] font-anton"
                      >
                        {metric.prefix || ""}{metric.value.toLocaleString()}{metric.suffix || ""}
                      </span>
                    </div>
                    <div id={`google-ads-metric-${metric.id}-label-container`}>
                      <span
                        id={`google-ads-metric-${metric.id}-label`}
                        className="text-xs md:text-sm text-[var(--text-200)] font-medium uppercase tracking-wide font-inter"
                      >
                        {metric.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics Explanation */}
            <div id="google-ads-metrics-explanation" className="mt-8 text-center">
              <p className="text-sm text-[var(--text-200)]">
                <span className="font-medium">ROI Focus:</span> Our Google Ads management delivers an average ROAS of {currentCampaign.metrics.find(m => m.id === "roas")?.value || "4.2"}x,
                turning your ad spend into measurable business growth.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="google-ads-features-wrapper" className="animate-element">
          <FeatureGrid id="google-ads-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="google-ads-links-wrapper" className="animate-element text-center">
          <div id="google-ads-links" className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
            <Link 
              href="/contact" 
              id="google-ads-contact-link"
              className="text-[var(--accent-green)] hover:underline font-medium"
            >
              Contact us about Google Ads management
            </Link>
            <Link 
              href="/case-studies" 
              id="google-ads-case-studies-link"
              className="text-[var(--accent-green)] hover:underline font-medium"
            >
              View our Google Ads case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="google-ads-cta-wrapper" className="animate-element text-center mt-8">
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
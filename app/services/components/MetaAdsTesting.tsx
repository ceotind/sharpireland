"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MetaAdsContent } from "../data/services-content";
import { Crown } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

interface MetaAdsTestingProps {
  content: MetaAdsContent;
}

export default function MetaAdsTesting({ content }: MetaAdsTestingProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [activeTest] = useState(0);

  useEffect(() => {
    if (!dashboardRef.current) return;

    // Animate dashboard elements
    const elements = dashboardRef.current.querySelectorAll(".animate-element");
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
            trigger: dashboardRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, []);

  const currentTest = content.creativeTests[activeTest];

  if (!currentTest) {
    return (
      <div className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md">
        <p className="text-[var(--text-200)]">No creative tests available</p>
      </div>
    );
  }

  return (
    <div
      id="meta-ads-testing-dashboard"
      ref={dashboardRef}
      className="bg-[var(--bg-200)] p-4 sm:p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
      aria-labelledby="meta-ads-dashboard-title"
    >
      {/* Dashboard Header */}
      <div id="meta-ads-dashboard-header" className="animate-element mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 id="meta-ads-dashboard-title" className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-100)]">
          A/B Testing Dashboard
        </h3>
        <div id="meta-ads-dashboard-status" className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[var(--accent-green)] rounded-full animate-pulse" aria-hidden="true"></span>
          <span className="text-xs sm:text-sm text-[var(--text-200)]">Active Tests</span>
        </div>
      </div>

      {/* Creative Test Comparison */}
      <div id="meta-ads-creative-test" className="animate-element mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0">
          <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)]">{currentTest.name}</h4>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentTest.status === "active" 
              ? "bg-[var(--accent-green)] bg-opacity-10 text-[var(--accent-green)]"
              : "bg-[var(--bg-300)] text-[var(--text-200)]"
          }`}>
            {currentTest.status}
          </div>
        </div>

        {/* A/B Test Variants Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {currentTest.variants.map((variant) => (
            <div
              key={variant.id}
              id={`variant-${variant.id}`}
              className={`relative bg-[var(--bg-100)] p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                variant.winning 
                  ? "border-[var(--accent-green)] shadow-lg" 
                  : "border-[var(--bg-300)] hover:border-[var(--bg-300)]"
              }`}
            >
              {/* Winner Badge */}
              {variant.winning && (
                <div className="absolute -top-3 left-4 bg-[var(--accent-green)] text-[var(--white-color)] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Crown size={12} weight="fill" />
                  Winner
                </div>
              )}

              {/* Variant Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0">
                <h5 className="font-medium text-[var(--text-100)] text-sm sm:text-base">{variant.name}</h5>
                <span className="text-xs bg-[var(--bg-200)] text-[var(--text-100)] px-2 py-1 rounded-full self-start sm:self-auto">
                  {variant.type}
                </span>
              </div>

              {/* Variant Metrics */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-[var(--text-200)] mb-1">Impressions</div>
                  <div className="text-base sm:text-lg font-bold text-[var(--text-100)]">{variant.impressions.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--text-200)] mb-1">Clicks</div>
                  <div className="text-base sm:text-lg font-bold text-[var(--text-100)]">{variant.clicks.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--text-200)] mb-1">CTR</div>
                  <div className="text-base sm:text-lg font-bold text-[var(--accent-green)]">{variant.ctr}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--text-200)] mb-1">Conversions</div>
                  <div className="text-base sm:text-lg font-bold text-[var(--text-100)]">{variant.conversions}</div>
                </div>
              </div>

              {/* CPA Highlight */}
              <div className="text-center p-3 bg-[var(--bg-200)] rounded-xl">
                <div className="text-xs text-[var(--text-200)] mb-1">Cost Per Acquisition</div>
                <div className="text-lg sm:text-xl font-bold text-[var(--text-100)]">${variant.cpa}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Insights */}
      <div id="meta-ads-audience-insights" className="animate-element mb-6 sm:mb-8">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-4">Audience Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.audienceInsights.map((audience) => (
            <div
              key={audience.id}
              id={`audience-${audience.id}`}
              className="bg-[var(--bg-100)] p-3 sm:p-4 rounded-xl border border-[var(--bg-300)] hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-[var(--text-100)] text-sm sm:text-base">{audience.name}</h5>
                <div className={`w-3 h-3 rounded-full ${
                  audience.performance === "high" 
                    ? "bg-[var(--accent-green)]"
                    : audience.performance === "medium"
                    ? "bg-[var(--primary-300)]"
                    : "bg-[var(--accent-red)]"
                }`}></div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Size</span>
                  <span className="text-[var(--text-100)] font-medium">{audience.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Reach</span>
                  <span className="text-[var(--text-100)] font-medium">{audience.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Engagement</span>
                  <span className="text-[var(--text-100)] font-medium">{audience.engagement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Conversions</span>
                  <span className="text-[var(--accent-green)] font-medium">{audience.conversions}</span>
                </div>
              </div>

              {/* Performance indicator */}
              <div className="mt-3 w-full bg-[var(--bg-300)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    audience.performance === "high" 
                      ? "bg-[var(--accent-green)]"
                      : audience.performance === "medium"
                      ? "bg-[var(--primary-300)]"
                      : "bg-[var(--accent-red)]"
                  }`}
                  style={{ 
                    width: `${
                      audience.performance === "high" ? 85 : 
                      audience.performance === "medium" ? 60 : 35
                    }%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div id="meta-ads-platform-breakdown" className="animate-element">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-4">Platform Performance</h4>
        <div className="bg-[var(--bg-100)] p-4 sm:p-6 rounded-xl border border-[var(--bg-300)]">
          <div className="space-y-4">
            {content.platformBreakdown.map((platform, index) => (
              <div
                key={platform.platform}
                id={`platform-breakdown-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] gap-3 sm:gap-0"
              >
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-0">
                    <h5 className="font-medium text-[var(--text-100)] text-sm sm:text-base">{platform.platform}</h5>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-[var(--text-200)]">
                        {platform.impressions.toLocaleString()} impressions
                      </span>
                      <span className="text-[var(--accent-green)] font-medium">
                        {platform.conversions} conversions
                      </span>
                      <span className="text-[var(--text-100)] font-bold">
                        ${platform.cpa} CPA
                      </span>
                    </div>
                  </div>
                  
                  {/* Performance bar */}
                  <div className="w-full bg-[var(--bg-300)] rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-green-base)] transition-all duration-1000"
                      style={{ width: `${Math.min((platform.conversions / 250) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoogleAdsContent } from "../data/services-content";

gsap.registerPlugin(ScrollTrigger);

interface GoogleAdsPerformanceProps {
  content: GoogleAdsContent;
}

export default function GoogleAdsPerformance({ content }: GoogleAdsPerformanceProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [activeCampaignType, setActiveCampaignType] = useState("search");

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

  // Animation for metric cards when campaign type changes
  useEffect(() => {
    if (dashboardRef.current) {
      const metricCards = dashboardRef.current.querySelectorAll(".metric-card");
      
      gsap.fromTo(
        metricCards,
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
    <div
      id="google-ads-performance-dashboard"
      ref={dashboardRef}
      className="bg-[var(--bg-200)] p-4 sm:p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
      aria-labelledby="google-ads-dashboard-title"
    >
      {/* Dashboard Header */}
      <div id="google-ads-dashboard-header" className="animate-element mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 id="google-ads-dashboard-title" className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-100)]">
          Campaign Performance Dashboard
        </h3>
        <div id="google-ads-dashboard-status" className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[var(--accent-green)] rounded-full animate-pulse" aria-hidden="true"></span>
          <span className="text-xs sm:text-sm text-[var(--text-200)]">Real-time Data</span>
        </div>
      </div>

      {/* Campaign Type Tabs */}
      <div id="google-ads-campaign-tabs" className="animate-element mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {content.campaignTypes.map((campaign) => (
            <button
              key={campaign.id}
              id={`google-ads-tab-${campaign.id}`}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCampaignType === campaign.id
                  ? "bg-[var(--accent-green)] text-[var(--white-color)] shadow-md"
                  : "bg-[var(--bg-100)] text-[var(--text-200)] hover:bg-[var(--bg-300)] border border-[var(--bg-300)]"
              }`}
              onClick={() => setActiveCampaignType(campaign.id)}
              aria-pressed={activeCampaignType === campaign.id}
            >
              {campaign.name}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div id="google-ads-metrics-grid" className="animate-element grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {content.dashboardMetrics.map((metric) => (
          <div
            key={metric.id}
            id={`google-ads-metric-${metric.id}`}
            className="metric-card bg-[var(--bg-100)] p-4 sm:p-5 rounded-xl border border-[var(--bg-300)] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102"
          >
            <div id={`google-ads-metric-${metric.id}-header`} className="flex items-center justify-between mb-2">
              <div className="text-xs text-[var(--text-200)] uppercase tracking-wide">
                {metric.label}
              </div>
              {metric.change && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    metric.changeType === "positive"
                      ? "bg-[var(--accent-green)] bg-opacity-10 text-[var(--accent-green)]"
                      : "bg-[var(--accent-red)] bg-opacity-10 text-[var(--accent-red)]"
                  }`}
                >
                  {metric.change}
                </span>
              )}
            </div>
            <div id={`google-ads-metric-${metric.id}-value`} className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-100)] mb-1">
              {metric.prefix || ""}{metric.value.toLocaleString()}{metric.suffix || ""}
            </div>
            {metric.period && (
              <div className="text-xs text-[var(--text-200)]">{metric.period}</div>
            )}
          </div>
        ))}
      </div>

      {/* Conversion Funnel Visualization */}
      <div id="google-ads-conversion-funnel" className="animate-element mb-8">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-4">Conversion Funnel</h4>
        <div className="bg-[var(--bg-100)] p-4 sm:p-6 rounded-xl border border-[var(--bg-300)]">
          <div className="space-y-4">
            {content.conversionFunnel.map((stage, index) => (
              <div
                key={stage.stage}
                id={`funnel-stage-${index}`}
                className="relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-[var(--text-100)]">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-[var(--text-200)]">{stage.percentage}%</span>
                    <span className="text-base sm:text-lg font-bold text-[var(--text-100)]">{stage.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-[var(--bg-300)] rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-green-base)] transition-all duration-1000"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                {index < content.conversionFunnel.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[var(--text-200)]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div id="google-ads-performance-chart" className="animate-element">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-4">Performance Over Time</h4>
        <div className="bg-[var(--bg-100)] p-4 sm:p-6 rounded-xl border border-[var(--bg-300)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.performanceChart.map((week, index) => (
              <div
                key={week.date}
                id={`performance-week-${index}`}
                className="text-center p-3 sm:p-4 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] hover:shadow-sm transition-all duration-300"
              >
                <div className="text-xs sm:text-sm text-[var(--text-200)] mb-2">{week.date}</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-[var(--text-200)]">Conversions</div>
                    <div className="text-base sm:text-lg font-bold text-[var(--text-100)]">{week.conversions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-200)]">Spend</div>
                    <div className="text-sm text-[var(--text-100)]">${week.spend.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-200)]">ROAS</div>
                    <div className="text-sm font-medium text-[var(--accent-green)]">{week.roas}x</div>
                  </div>
                </div>
                {/* Performance indicator bar */}
                <div className="mt-3 w-full bg-[var(--bg-300)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[var(--accent-green)] transition-all duration-1000"
                    style={{ width: `${Math.min((week.roas / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Description */}
      <div id="google-ads-campaign-description" className="animate-element mt-6 p-4 sm:p-5 bg-[var(--bg-100)] rounded-xl border border-[var(--bg-300)]">
        <div className="text-center">
          <h5 className="font-medium text-[var(--text-100)] mb-2">
            {content.campaignTypes.find(c => c.id === activeCampaignType)?.name}
          </h5>
          <p className="text-sm text-[var(--text-200)]">
            {content.campaignTypes.find(c => c.id === activeCampaignType)?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
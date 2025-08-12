"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SocialMediaContent } from "../data/services-content";
import IconRenderer from "./IconRenderer";

gsap.registerPlugin(ScrollTrigger);

interface SocialMediaDashboardProps {
  content: SocialMediaContent;
}

export default function SocialMediaDashboard({ content }: SocialMediaDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);

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

    // Animate metrics cards with hover effects
    const metricCards = dashboardRef.current.querySelectorAll(".metric-card");
    metricCards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  return (
    <div
      id="social-media-dashboard"
      ref={dashboardRef}
      className="bg-[var(--bg-200)] p-4 sm:p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
      aria-labelledby="social-dashboard-title"
    >
      {/* Dashboard Header */}
      <div id="social-dashboard-header" className="animate-element mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 id="social-dashboard-title" className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-100)]">
          Social Media Management Dashboard
        </h3>
        <div id="social-dashboard-status" className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--accent-green)] rounded-full animate-pulse" aria-hidden="true"></span>
          <span className="text-xs sm:text-sm text-[var(--text-200)]">Live Data</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div id="social-metrics-grid" className="animate-element grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {content.dashboardMetrics.map((metric) => (
          <div
            key={metric.id}
            id={`social-metric-${metric.id}`}
            className="metric-card bg-[var(--bg-100)] p-3 sm:p-4 rounded-xl border border-[var(--bg-300)] shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            <div id={`social-metric-${metric.id}-header`} className="flex items-center justify-between mb-2">
              <div className="text-xl sm:text-2xl text-[var(--text-200)]">
                {metric.icon && <IconRenderer icon={{ name: metric.icon, size: 20 }} />}
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
            <div id={`social-metric-${metric.id}-value`} className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-100)] mb-1">
              {metric.prefix || ""}{metric.value.toLocaleString()}{metric.suffix || ""}
            </div>
            <div id={`social-metric-${metric.id}-label`} className="text-xs sm:text-xs text-[var(--text-200)] uppercase tracking-wide">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Platform Performance Chart */}
      <div id="social-platform-chart" className="animate-element mb-6 sm:mb-8">
        <h4 id="social-platform-chart-title" className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-3 sm:mb-4">Platform Performance</h4>
        <div id="social-platform-chart-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {content.platformData.map((platform) => (
            <div
              key={platform.platform}
              id={`platform-${platform.platform.toLowerCase()}`}
              className="bg-[var(--bg-100)] p-3 sm:p-4 rounded-xl border border-[var(--bg-300)]"
            >
              <div id={`platform-${platform.platform.toLowerCase()}-header`} className="flex items-center justify-between mb-3">
                <h5 id={`platform-${platform.platform.toLowerCase()}-title`} className="font-medium text-sm sm:text-base text-[var(--text-100)]">{platform.platform}</h5>
                <div
                  id={`platform-${platform.platform.toLowerCase()}-indicator`}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                  style={{ backgroundColor: platform.color }}
                  aria-hidden="true"
                ></div>
              </div>
              <div id={`platform-${platform.platform.toLowerCase()}-metrics`} className="space-y-2">
                <div id={`platform-${platform.platform.toLowerCase()}-engagement`} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[var(--text-200)]">Engagement</span>
                  <span className="text-[var(--text-100)] font-medium">{platform.engagement}%</span>
                </div>
                <div id={`platform-${platform.platform.toLowerCase()}-progress`} className="w-full bg-[var(--bg-300)] rounded-full h-1.5 sm:h-2">
                  <div
                    id={`platform-${platform.platform.toLowerCase()}-progress-bar`}
                    className="h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                    style={{
                      backgroundColor: platform.color,
                      width: `${platform.engagement}%`,
                    }}
                  ></div>
                </div>
                <div id={`platform-${platform.platform.toLowerCase()}-reach`} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[var(--text-200)]">Reach</span>
                  <span className="text-[var(--text-100)] font-medium">{platform.reach.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts Timeline */}
      <div id="social-recent-posts" className="animate-element">
        <h4 id="social-recent-posts-title" className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-3 sm:mb-4">Recent Activity</h4>
        <div id="social-recent-posts-list" className="space-y-2 sm:space-y-3">
          {content.recentPosts.map((post) => (
            <div
              key={post.id}
              id={`recent-post-${post.id}`}
              className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-[var(--bg-100)] rounded-xl border border-[var(--bg-300)] hover:shadow-sm transition-all duration-300"
            >
              <div id={`recent-post-${post.id}-status-indicator`} className="flex-shrink-0">
                <div
                  id={`recent-post-${post.id}-status-dot`}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    post.status === "published"
                      ? "bg-[var(--accent-green)]"
                      : post.status === "scheduled"
                      ? "bg-[var(--primary-300)]"
                      : "bg-[var(--bg-300)]"
                  }`}
                  aria-hidden="true"
                ></div>
              </div>
              <div id={`recent-post-${post.id}-content`} className="flex-grow min-w-0">
                <div id={`recent-post-${post.id}-meta`} className="flex items-center gap-2 mb-1">
                  <span id={`recent-post-${post.id}-platform`} className="text-xs sm:text-sm font-medium text-[var(--text-100)]">{post.platform}</span>
                  <span id={`recent-post-${post.id}-time`} className="text-xs text-[var(--text-200)]">{post.time}</span>
                </div>
                <p id={`recent-post-${post.id}-text`} className="text-xs sm:text-sm text-[var(--text-200)] truncate">{post.content}</p>
              </div>
              <div id={`recent-post-${post.id}-stats`} className="flex-shrink-0 text-right">
                <div id={`recent-post-${post.id}-engagement`} className="text-xs text-[var(--text-200)]">{post.engagement}</div>
                <div
                  id={`recent-post-${post.id}-status-badge`}
                  className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full mt-1 ${
                    post.status === "published"
                      ? "bg-[var(--accent-green)] bg-opacity-10 text-[var(--accent-green)]"
                      : post.status === "scheduled"
                      ? "bg-[var(--primary-300)] bg-opacity-10 text-[var(--primary-100)]"
                      : "bg-[var(--bg-300)] text-[var(--text-200)]"
                  }`}
                >
                  {post.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
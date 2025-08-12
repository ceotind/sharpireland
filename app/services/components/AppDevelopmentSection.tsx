"use client";
import React from 'react';
import ServiceCTA from './ServiceCTA';
import { AppDevelopmentContent, commonCtaContent } from '../data/services-content';

interface AppDevelopmentSectionProps {
  content: AppDevelopmentContent;
}

const AppDevelopmentSection: React.FC<AppDevelopmentSectionProps> = ({ content }) => {

  // Split features into left and right groups for desktop layout
  const leftFeatures = content.features.slice(0, 2);
  const rightFeatures = content.features.slice(2, 4);

  // Phone Mockup Component to avoid duplication
  const PhoneMockup = () => (
    <div id="services-app-dev-phone-mockup" className="relative w-64 sm:w-72 h-[520px] sm:h-[560px] bg-[var(--text-100)] rounded-[2.5rem] p-2 shadow-2xl mx-auto">
      {/* Phone Screen */}
      <div id="services-app-dev-phone-screen" className="w-full h-full bg-[var(--bg-100)] rounded-[2rem] overflow-hidden relative">
        {/* Status Bar */}
        <div id="services-app-dev-status-bar" className="flex justify-between items-center px-4 sm:px-6 py-3 text-xs text-[var(--text-100)]">
          <span className="font-medium">9:41</span>
          <div id="services-app-dev-battery-indicator" className="flex items-center gap-1">
            <div className="w-4 h-2 border border-[var(--text-100)] rounded-sm">
              <div className="w-3 h-1 bg-[var(--accent-green)] rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>

        {/* App Header */}
        <div id="services-app-dev-app-header" className="px-4 sm:px-6 py-4 border-b border-[var(--bg-300)]">
          <div id="services-app-dev-header-content" className="flex items-center justify-between">
            <div id="services-app-dev-header-info">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-100)]">Untitled UI</h3>
              <div id="services-app-dev-header-actions" className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-[var(--accent-green)] rounded-full"></div>
                <span className="text-xs text-[var(--text-200)] opacity-60">Copy link</span>
                <span className="text-xs text-[var(--text-200)] opacity-60">Visit store ↗</span>
              </div>
            </div>
            <div id="services-app-dev-header-buttons" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--bg-300)] rounded"></div>
              <div className="w-6 h-6 bg-[var(--bg-300)] rounded"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div id="services-app-dev-dashboard-content" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Main Stats */}
          <div id="services-app-dev-main-stats" className="space-y-4">
            <div id="services-app-dev-stats-header" className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-200)] opacity-60">All revenue</span>
              <span className="text-xs text-[var(--text-200)] opacity-60">Page</span>
            </div>
            
            <div id="services-app-dev-stats-values" className="flex items-baseline justify-between">
              <div id="services-app-dev-primary-stat">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--text-100)]">$8,746.22</div>
                <div id="services-app-dev-primary-change" className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-[var(--accent-green)] font-medium">↗ 2.4%</span>
                </div>
              </div>
              <div id="services-app-dev-secondary-stat" className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-[var(--text-100)]">12,847</div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div id="services-app-dev-secondary-stats" className="border-t border-[var(--bg-300)] pt-4">
            <div id="services-app-dev-net-revenue-header" className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-200)] opacity-60">Net revenue</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-[var(--text-100)]">$7,804.16</div>
            <div id="services-app-dev-net-revenue-change" className="flex items-center gap-1 mt-1">
              <span className="text-xs text-[var(--accent-green)] font-medium">↗ 2.4%</span>
            </div>
          </div>

          {/* Chart Area */}
          <div id="services-app-dev-chart-section" className="space-y-3">
            <div id="services-app-dev-chart-labels" className="flex justify-between text-xs text-[var(--text-200)] opacity-60">
              <span>Jan</span>
              <span>Jul</span>
              <span>Dec</span>
              <span>Filters</span>
            </div>
            
            {/* Chart Visualization */}
            <div id="services-app-dev-chart-container" className="h-16 sm:h-20 flex items-end justify-between gap-1 bg-[var(--bg-200)] rounded-lg p-3">
              <svg className="w-full h-full" viewBox="0 0 200 60" aria-label="Revenue growth chart">
                <path
                  d="M10,50 Q30,40 50,35 T90,25 T130,20 T170,15 T190,10"
                  stroke="var(--accent-green)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M10,50 Q30,40 50,35 T90,25 T130,20 T170,15 T190,10 L190,60 L10,60 Z"
                  fill="var(--accent-green)"
                  opacity="0.1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div id="services-app-dev-home-indicator" className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[var(--bg-300)] rounded-full"></div>
    </div>
  );

  return (
    <section id="services-app-dev-root" className="py-16 sm:py-20 md:py-32 bg-[var(--bg-100)]" aria-labelledby="services-app-dev-title">
      <div id="services-app-dev-container" className="w-full max-w-screen-xl mx-auto px-6 lg:px-8 flex flex-col gap-12 md:gap-16">
        
        {/* Header Section */}
        <header id="services-app-dev-header" className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            {content.eyebrow}
          </span>
          <h2 id="services-app-dev-title" className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            {content.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base sm:text-lg md:text-xl opacity-80">
            {content.description}
          </p>
        </header>

        {/* Features and Phone Layout */}
        <div id="services-app-dev-content" className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 xl:gap-12 items-center">
            
            {/* Left Features */}
            <div id="services-app-dev-left-features" className="space-y-8">
              {leftFeatures.map((feature, index) => (
                <article key={feature.id} id={`services-app-dev-left-feature-${index + 1}`} className="text-right">
                  <div className="inline-flex items-center gap-4 flex-row-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg-200)] rounded-xl flex items-center justify-center border border-[var(--bg-300)]" aria-hidden="true">
                      <div className="w-6 h-6 bg-[var(--accent-green)] rounded opacity-80"></div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg xl:text-xl font-semibold text-[var(--text-100)] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[var(--text-200)] text-sm xl:text-base opacity-80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Center Phone Mockup */}
            <div id="services-app-dev-phone-wrapper" className="flex justify-center">
              <PhoneMockup />
            </div>

            {/* Right Features */}
            <div id="services-app-dev-right-features" className="space-y-8">
              {rightFeatures.map((feature, index) => (
                <article key={feature.id} id={`services-app-dev-right-feature-${index + 1}`} className="animate-element">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg-200)] rounded-xl flex items-center justify-center border border-[var(--bg-300)]" aria-hidden="true">
                      <div className="w-6 h-6 bg-[var(--accent-green)] rounded opacity-80"></div>
                    </div>
                    <div>
                      <h3 className="text-lg xl:text-xl font-semibold text-[var(--text-100)] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[var(--text-200)] text-sm xl:text-base opacity-80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-8 sm:space-y-12">
            {/* Phone Mockup */}
            <div id="services-app-dev-mobile-phone-wrapper" className="flex justify-center">
              <PhoneMockup />
            </div>

            {/* All Features in Mobile Layout */}
            <div id="services-app-dev-mobile-features" className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {content.features.map((feature, index) => (
                <article key={feature.id} id={`services-app-dev-mobile-feature-${index + 1}`} className="animate-element">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg-200)] rounded-xl flex items-center justify-center border border-[var(--bg-300)]" aria-hidden="true">
                      <div className="w-6 h-6 bg-[var(--accent-green)] rounded opacity-80"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[var(--text-200)] text-sm sm:text-base opacity-80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="services-app-dev-cta-wrapper" className="mt-8 sm:mt-12">
          <ServiceCTA
            id="app-dev-cta-section"
            primaryText={commonCtaContent.primaryText}
            secondaryText={commonCtaContent.secondaryText}
            primaryLink={commonCtaContent.primaryLink}
            secondaryLink={commonCtaContent.secondaryLink}
          />
        </div>
      </div>
    </section>
  );
};

export default AppDevelopmentSection;
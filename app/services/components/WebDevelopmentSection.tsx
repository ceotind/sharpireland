"use client";

import ServiceCTA from "./ServiceCTA";
import IconRenderer from "./IconRenderer";
import { WebDevelopmentContent, commonCtaContent } from "../data/services-content";

interface WebDevelopmentSectionProps {
  content: WebDevelopmentContent;
}

export default function WebDevelopmentSection({ content }: WebDevelopmentSectionProps) {

  // Take only first 4 features for 2x2 grid
  const featuresForGrid = content.features.slice(0, 4);

  return (
    <section id="services-web-dev-root" className="bg-[var(--bg-100)] py-12 sm:py-16 md:py-20 lg:py-32">
      <div id="web-dev-container" className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="web-dev-content-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div id="web-dev-content-column">
            {/* Header */}
            <div id="web-dev-header" className="mb-8 md:mb-12">
              <span className="text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
                {content.eyebrow}
              </span>
              <h2 className="mt-3 md:mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-100)] leading-tight">
                {content.title}
              </h2>
              <p className="mt-3 md:mt-4 text-[var(--text-200)] text-sm sm:text-base md:text-lg opacity-80 leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Features Grid - 2x2 */}
            <div id="web-dev-features-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {featuresForGrid.map((feature) => (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="flex flex-col"
                >
                  <div id={`${feature.id}-icon`} className="text-[var(--text-100)] mb-3 sm:mb-4">
                    <IconRenderer icon={feature.icon} />
                  </div>
                  <h3 id={`${feature.id}-title`} className="text-base sm:text-lg font-semibold text-[var(--text-100)] mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p id={`${feature.id}-description`} className="text-[var(--text-200)] text-sm sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div id="web-dev-mockup-column" className="relative mt-8 lg:mt-0">
            <div id="web-dev-dashboard-mockup" className="relative">
              {/* Main Dashboard Container */}
              <div className="bg-[var(--bg-200)] rounded-lg sm:rounded-xl shadow-2xl border border-[var(--bg-300)] overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-[var(--bg-100)] px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--bg-300)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[var(--accent-green)] rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-bold">SI</span>
                      </div>
                      <span className="text-[var(--text-100)] font-semibold text-sm sm:text-base">Sharp Ireland</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent-red)] rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--primary-300)] rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent-green)] rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 sm:p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-[var(--bg-100)] p-2 sm:p-4 rounded-lg border border-[var(--bg-300)]">
                      <div className="text-lg sm:text-2xl font-bold text-[var(--text-100)]">$8,746.22</div>
                      <div className="text-xs sm:text-sm text-[var(--text-200)]">Revenue</div>
                      <div className="text-xs text-[var(--accent-green)]">+14%</div>
                    </div>
                    <div className="bg-[var(--bg-100)] p-2 sm:p-4 rounded-lg border border-[var(--bg-300)]">
                      <div className="text-lg sm:text-2xl font-bold text-[var(--text-100)]">12,440</div>
                      <div className="text-xs sm:text-sm text-[var(--text-200)]">Visitors</div>
                      <div className="text-xs text-[var(--accent-green)]">+23%</div>
                    </div>
                    <div className="bg-[var(--bg-100)] p-2 sm:p-4 rounded-lg border border-[var(--bg-300)]">
                      <div className="text-lg sm:text-2xl font-bold text-[var(--text-100)]">96</div>
                      <div className="text-xs sm:text-sm text-[var(--text-200)]">Projects</div>
                      <div className="text-xs text-[var(--accent-green)]">+8%</div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="bg-[var(--bg-100)] p-3 sm:p-4 rounded-lg border border-[var(--bg-300)] mb-4 sm:mb-6">
                    <div className="h-24 sm:h-32 flex items-end justify-between space-x-1">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, index) => (
                        <div
                          key={index}
                          className="bg-[var(--accent-green)] rounded-t"
                          style={{ height: `${height}%`, width: '8%' }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-[var(--text-100)] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Recent Activity</h4>
                    {[
                      { name: "New Project", time: "2 min ago", status: "success" },
                      { name: "Client Meeting", time: "1 hour ago", status: "pending" },
                      { name: "Code Review", time: "3 hours ago", status: "completed" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-1.5 sm:py-2">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-[var(--accent-green)]' :
                            activity.status === 'pending' ? 'bg-[var(--primary-300)]' : 'bg-[var(--primary-100)]'
                          }`}></div>
                          <span className="text-[var(--text-100)] text-xs sm:text-sm">{activity.name}</span>
                        </div>
                        <span className="text-[var(--text-200)] text-xs">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-[var(--accent-green)] rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-8 h-8 sm:w-12 sm:h-12 bg-[var(--accent-green)] rounded-full opacity-10"></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="web-dev-cta-wrapper" className="text-center mt-12 sm:mt-16">
          <ServiceCTA
            id="web-dev-cta-section"
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
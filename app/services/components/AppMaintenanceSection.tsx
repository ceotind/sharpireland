"use client";

import React from 'react';
import { AppMaintenanceContent } from '../data/services-content';

interface AppMaintenanceSectionProps {
  content: AppMaintenanceContent;
}

const AppMaintenanceSection: React.FC<AppMaintenanceSectionProps> = ({ content }) => {

  return (
    <section id="services-maintenance-root" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[var(--bg-100)]">
      <div id="services-maintenance-container" className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div id="services-maintenance-header" className="mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs sm:text-sm uppercase tracking-wide text-[var(--primary-100)] font-medium">
            {content.eyebrow}
          </span>
          <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-100)] leading-tight">
            {content.title}
          </h2>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[var(--text-200)] leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div id="services-maintenance-content" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
          {/* Left Side - Features List */}
          <div id="services-maintenance-features" className="order-2 lg:order-1">
            <div className="space-y-6 sm:space-y-8">
              {content.features.map((feature, index) => (
                <div key={feature.id} id={`maintenance-feature-${index + 1}`} className="border-l-4 border-[var(--bg-300)] pl-4 sm:pl-6 py-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text-100)] mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-[var(--text-200)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Enhanced Visual */}
          <div id="services-maintenance-visual" className="order-1 lg:order-2">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary-100)] via-[var(--primary-200)] to-[var(--primary-300)] p-6 sm:p-8 flex items-center justify-center shadow-lg">
              {/* Enhanced placeholder content */}
              <div id="maintenance-visual-content" className="text-center text-white relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="text-base sm:text-lg font-medium opacity-90 mb-1">
                  App Maintenance Dashboard
                </p>
                <p className="text-xs sm:text-sm opacity-70">
                  24/7 monitoring & optimization
                </p>
              </div>
              
              {/* Enhanced decorative elements */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 blur-xl"></div>
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 blur-2xl"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 blur-lg"></div>
              <div className="absolute bottom-1/3 right-1/3 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/15 blur-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppMaintenanceSection;
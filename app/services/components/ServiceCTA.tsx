"use client";

import React from "react";

interface ServiceCTAProps {
  id: string;
  primaryText: string;
  secondaryText: string;
  primaryLink: string;
  secondaryLink: string;
}

export default function ServiceCTA({
  id,
  primaryText,
  secondaryText,
  primaryLink,
  secondaryLink,
}: ServiceCTAProps) {
  return (
    <div id={id} className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
      {/* Primary Button - Enhanced with better styling */}
      <a
        id={`${id}-primary-button`}
        href={primaryLink}
        className="btn-primary relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-[var(--primary-100)]/20 shadow-lg text-center w-full sm:w-auto transition-all duration-300 hover:shadow-xl"
      >
        <span className="relative z-10">{primaryText}</span>
      </a>

      {/* Secondary Button */}
      <a
        id={`${id}-secondary-button`}
        href={secondaryLink}
        className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[var(--text-100)] bg-[var(--bg-200)] border-2 border-[var(--bg-300)] rounded-xl focus:outline-none focus:ring-4 focus:ring-[var(--primary-100)]/20 shadow-md text-center backdrop-blur-sm w-full sm:w-auto transition-all duration-300 hover:shadow-lg hover:border-[var(--primary-100)]"
      >
        <span className="relative z-10">{secondaryText}</span>
      </a>
    </div>
  );
}
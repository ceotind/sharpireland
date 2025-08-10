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
    <div id={id} className="flex flex-col sm:flex-row justify-center gap-4">
      <a
        id={`${id}-primary-button`}
        href={primaryLink}
        className="btn-primary px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-center"
      >
        {primaryText}
      </a>
      <a
        id={`${id}-secondary-button`}
        href={secondaryLink}
        className="px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-center"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "var(--text-100)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
      >
        {secondaryText}
      </a>
    </div>
  );
}
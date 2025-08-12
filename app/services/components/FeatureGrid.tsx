import React from "react";
import IconRenderer from "./IconRenderer";
import { IconConfig } from "../data/services-content";

interface FeatureItem {
  id: string;
  icon: IconConfig; // Changed from React.ReactNode to IconConfig
  title: string;
  description: string;
}

interface FeatureGridProps {
  id: string;
  features: FeatureItem[];
}

export default function FeatureGrid({ id, features }: FeatureGridProps) {
  return (
    <div id={id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {features.map((feature) => (
        <div
          key={feature.id}
          id={feature.id}
          className="bg-[var(--bg-200)] p-4 sm:p-6 rounded-xl shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg"
        >
          <div id={`${feature.id}-icon`} className="text-[var(--accent-green)] text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
            <IconRenderer icon={feature.icon} />
          </div>
          <h3 id={`${feature.id}-title`} className="text-lg sm:text-xl font-semibold text-[var(--text-100)] mb-2">
            {feature.title}
          </h3>
          <p id={`${feature.id}-description`} className="text-sm sm:text-base text-[var(--text-200)] leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
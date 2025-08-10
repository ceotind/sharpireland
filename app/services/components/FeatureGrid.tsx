import React from "react";

interface FeatureItem {
  id: string;
  icon: React.ReactNode; // Or string for image path
  title: string;
  description: string;
}

interface FeatureGridProps {
  id: string;
  features: FeatureItem[];
}

export default function FeatureGrid({ id, features }: FeatureGridProps) {
  return (
    <div id={id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div
          key={feature.id}
          id={feature.id}
          className="bg-[var(--bg-200)] p-6 rounded-xl shadow-md flex flex-col items-center text-center"
        >
          <div id={`${feature.id}-icon`} className="text-[var(--accent-green)] text-5xl mb-4">
            {feature.icon}
          </div>
          <h3 id={`${feature.id}-title`} className="text-xl font-semibold text-[var(--text-100)]">
            {feature.title}
          </h3>
          <p id={`${feature.id}-description`} className="mt-2 text-[var(--text-200)]">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
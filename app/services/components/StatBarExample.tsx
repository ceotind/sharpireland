"use client";

import StatBar from "./StatBar";

export default function StatBarExample() {
  // Sample data for the StatBar component
  const sampleStats = [
    {
      id: "reach",
      label: "Monthly Reach",
      value: 125000,
      prefix: "",
      suffix: "+"
    },
    {
      id: "engagement",
      label: "Engagement Rate",
      value: 8,
      prefix: "",
      suffix: "%"
    },
    {
      id: "growth",
      label: "Follower Growth",
      value: 27,
      prefix: "+",
      suffix: "%"
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: 3.5,
      prefix: "",
      suffix: "%"
    }
  ];

  return (
    <div id="stat-bar-example-container" className="py-12 px-6">
      <h2 id="stat-bar-example-heading" className="text-3xl font-bold text-[var(--text-100)] mb-8 text-center">
        Social Media Performance
      </h2>
      
      <StatBar 
        id="social-media-stats" 
        stats={sampleStats} 
        className="max-w-5xl mx-auto"
      />
      
      <div id="stat-bar-example-description" className="mt-8 text-center text-[var(--text-200)] max-w-2xl mx-auto">
        <p>
          Our social media management services deliver measurable results across all platforms.
          From increasing your audience reach to boosting engagement and driving conversions.
        </p>
      </div>
    </div>
  );
}
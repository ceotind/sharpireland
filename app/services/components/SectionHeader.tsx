import React from "react";

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ id, eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div id={id} className="text-center">
      <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium font-inter">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--text-100)] font-anton">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base md:text-lg opacity-80 font-inter">
        {description}
      </p>
    </div>
  );
}
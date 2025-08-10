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
        className="px-8 py-3 rounded-full bg-[var(--accent-green)] text-[var(--white-color)] font-semibold text-lg shadow-lg hover:bg-[var(--accent-green-base)] transition-colors duration-300 text-center"
      >
        {primaryText}
      </a>
      <a
        id={`${id}-secondary-button`}
        href={secondaryLink}
        className="px-8 py-3 rounded-full border-2 border-[var(--accent-green)] text-[var(--accent-green)] font-semibold text-lg hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] transition-colors duration-300 text-center"
      >
        {secondaryText}
      </a>
    </div>
  );
}
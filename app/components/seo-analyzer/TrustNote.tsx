"use client";

interface TrustNoteProps {
  className?: string;
}

export default function TrustNote({ className = "" }: TrustNoteProps) {
  return (
    <div
      id="seo-hero-trust"
      className={`flex items-center justify-center gap-2 text-sm ${className}`}
    >
      <svg
        id="seo-hero-trust-icon"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: 'var(--accent-green)' }}
        aria-hidden="true"
      >
        <path
          d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span id="seo-hero-trust-text" className="text-[var(--text-300)]">
        No storage of URLs beyond generating the report.
      </span>
    </div>
  );
}
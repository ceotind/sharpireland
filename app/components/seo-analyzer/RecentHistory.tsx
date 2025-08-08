"use client";

export interface Props {
  history: string[];
  onSelect: (url: string) => void;
  className?: string;
}

export default function RecentHistory({ history, onSelect, className = "" }: Props) {
  const items = Array.isArray(history) ? history.slice(0, 3) : [];
  if (items.length === 0) return null;

  return (
    <div id="seo-recent" className={className}>
      <div id="seo-recent-header" className="text-sm font-medium text-[var(--text-100)] mb-2">
        Recent analyses
      </div>
      <div id="seo-recent-list" className="flex flex-wrap gap-2">
        {items.map((u, idx) => (
          <button
            id={`seo-recent-${idx + 1}`}
            key={u}
            type="button"
            className="px-3 py-1.5 rounded-lg border text-sm transition-colors bg-[var(--bg-300)] text-[var(--text-100)] border-[var(--border-100)]"
            onClick={() => onSelect(u)}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}
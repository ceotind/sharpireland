// Import Chrome sandbox fix to ensure it's applied
import '@/app/utils/chrome-sandbox-fix';

export function formatTextWithLineBreaks(text: string) {
  return text.split('\\n').map((line, index) => (
    <p key={index} className="mb-4 last:mb-0">
      {line}
    </p>
  ));
}

export function slugToTitle(slug: string): string {
  const specialCases: { [key: string]: string } = {
    "dtc": "DTC"
  };

  return slug
    .split('-')
    .map(word => specialCases[word] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

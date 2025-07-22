import Link from 'next/link';
import { IndustryContent } from '@/app/types/content';
import { slugToTitle } from '@/app/utils/text-utils';

interface IndustryCardProps {
  industry: IndustryContent;
}

export default function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <Link href={`/${industry.slug}`} className="group block">
      <div className="bg-[var(--bg-200)] border border-[var(--accent-blue)] rounded-lg p-6 sm:p-8 md:p-6 lg:p-8 xl:p-10 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[0_0_15px_3px_rgba(15,81,221,0.5)] hover:border-[var(--accent-blue)] transform group-hover:-translate-y-1 min-h-[400px] flex flex-col">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-green)] transition-colors duration-300">
          {slugToTitle(industry.slug)}
        </h3>
        <p className="text-[var(--foreground)] opacity-80 text-base md:text-lg lg:text-xl leading-relaxed mb-4 line-clamp-3">
          {industry.description}
        </p>
        {industry.keyPoints && industry.keyPoints.length > 0 && (
          <ul className="list-disc list-inside text-[var(--foreground)] opacity-70 text-base space-y-2">
            {industry.keyPoints.slice(0, 3).map((point, index) => (
              <li key={index} className="line-clamp-1">{point}</li>
            ))}
            {industry.keyPoints.length > 3 && (
              <li>...</li>
            )}
          </ul>
        )}

        {/* Key Features/Benefits */}
        {industry.solution?.benefits?.items && industry.solution.benefits.items.length > 0 && (
          <div className="border-t border-[var(--bg-300)] border-opacity-30 border-t-[0.5px] mb-4">
            <h4 className="mt-6 text-xl font-semibold text-[var(--foreground)] mb-3">Key Benefits</h4>
            <ul className="space-y-3">
              {industry.solution.benefits.items.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start text-[var(--foreground)] opacity-80 text-base md:text-lg lg:text-lg">
                  <span className="mr-2 text-lg">{benefit.icon}</span>
                  <div>
                    <strong className="block">{benefit.title}:</strong> {benefit.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}




      </div>
    </Link>
  );
}
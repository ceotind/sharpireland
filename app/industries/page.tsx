import { Metadata } from 'next';
import { getAllIndustries } from '@/app/utils/content-loader';
import IndustryCard from '@/app/components/industry/IndustryCard';

export const metadata: Metadata = {
  title: 'Industries - Sharp Ireland',
  description: 'Explore the industries Sharp Ireland specializes in, from artisan sellers to sustainable brands.',
};

export default async function IndustriesPage() {
  const industries = await getAllIndustries();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 md:pt-36 lg:pt-40">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 pb-20 md:pb-24 lg:pb-28">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 md:mb-20 lg:mb-24 animate-element">
          Our Industries
        </h1>
        <p className="text-center text-lg md:text-xl opacity-80 max-w-3xl mx-auto mb-12 md:mb-20 lg:mb-24 animate-element">
          We craft digital experiences tailored to the unique needs of diverse industries.
          Explore how we can help your business thrive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-20 lg:mt-24">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </div>
    </div>
  );
}
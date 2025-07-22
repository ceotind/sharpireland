import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getIndustryBySlug } from '../utils/content-loader';
import { type IndustryContent } from '../types/content';
import { ContentProvider } from '../context/ContentContext';
import LoadingUI from '../components/LoadingUI';

// Import all industry components
import CTA from '../components/industry/CTA';
import FAQ from '../components/industry/FAQ';
import Hero from '../components/industry/Hero';
import Problems from '../components/industry/Problems';
import Process from '../components/industry/Process';
import Services from '../components/industry/Services';
import Solution from '../components/industry/Solution';
import Testimonials from '../components/industry/Testimonials';
import WhyUs from '../components/industry/WhyUs';

// Map section types to components

type Props = {
  params: Promise<{ industry: string }> | { industry: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const industry = await getIndustryBySlug(resolvedParams.industry);
  if (!industry) return {};
  
  return {
    title: industry.metadata.title,
    description: industry.metadata.description,
    keywords: industry.metadata.keywords,
    openGraph: {
      title: industry.metadata.openGraph.title,
      description: industry.metadata.openGraph.description,
      locale: industry.metadata.openGraph.locale,
    },
  };
}

async function IndustryContent({ params }: { params: { industry: string } }) {
  const industry = await getIndustryBySlug(params.industry);
  if (!industry) return notFound();

  return (
    <ContentProvider content={industry}>
      <main className="min-h-screen bg-[var(--bg-100)]">
        <Hero />
        <Problems />
        <Solution />
        <Services />
        <WhyUs />
        <Process />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
    </ContentProvider>
  );
}

export default async function IndustryPage({ params }: Props) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<LoadingUI />}>
      <IndustryContent params={resolvedParams} />
    </Suspense>
  );
}
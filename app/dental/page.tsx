import { Metadata } from 'next';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Solution from './components/Solution';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';

export const metadata: Metadata = {
  title: 'Elite Dental Website Design & Development | European Dental Practices',
  description: 'Transform your dental practice with our specialized web development services. Attract high-value patients, streamline operations, and dominate your local market. GDPR compliant, GDC approved.',
  keywords: 'dental website design Europe, web developer for dentists, dental marketing agency UK, bespoke dental websites, dental web design Germany, dental SEO services, GDPR compliant dental websites',
  openGraph: {
    title: 'Elite Dental Website Design & Development | European Dental Practices',
    description: 'Transform your dental practice with our specialized web development services. Attract high-value patients, streamline operations, and dominate your local market.',
    type: 'website',
    locale: 'en_EU',
  },
  alternates: {
    canonical: '/dental',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function DentalPage() {
  return (
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
  );
}
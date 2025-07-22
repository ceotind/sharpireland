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
import content from './content.json';

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  openGraph: {
    title: content.metadata.openGraph.title,
    description: content.metadata.openGraph.description,
    type: 'website',
    locale: content.metadata.openGraph.locale,
  },
  alternates: {
    canonical: '/template',
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

export default function TemplatePage() {
  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": content.faqSchema.questions.map(q => ({
              "@type": "Question",
              "name": q.name,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
              }
            }))
          })
        }}
      />

      {/* Breadcrumb Navigation for SEO and accessibility */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {content.breadcrumb.items.map((item, index) => (
            <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">{item.name}</span>
              <meta itemProp="position" content={item.position.toString()} />
            </li>
          ))}
        </ol>
      </nav>

      <main className="min-h-screen bg-[var(--bg-100)]" role="main">
        {/* Hero Section */}
        <section aria-labelledby="template-hero-heading">
          <Hero />
        </section>
        {/* Problems Section */}
        <section aria-labelledby="template-problems-heading">
          <Problems />
        </section>
        {/* Solution Section */}
        <section aria-labelledby="template-solution-heading">
          <Solution />
        </section>
        {/* Services Section */}
        <section aria-labelledby="template-services-heading">
          <Services />
        </section>
        {/* Why Us Section */}
        <section aria-labelledby="template-whyus-heading">
          <WhyUs />
        </section>
        {/* Process Section */}
        <section aria-labelledby="template-process-heading">
          <Process />
        </section>
        {/* Testimonials Section */}
        <section aria-labelledby="template-testimonials-heading">
          <Testimonials />
        </section>
        {/* FAQ Section */}
        <section aria-labelledby="template-faq-heading">
          <FAQ />
        </section>
        {/* CTA Section */}
        <section aria-labelledby="template-cta-heading">
          <CTA />
        </section>
      </main>
    </>
  );
} 
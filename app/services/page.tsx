import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ServiceHero from "./components/ServiceHero";
import ServiceCTA from "./components/ServiceCTA";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingUI from "../components/LoadingUI";
import {
  serviceHeroContent,
  webDevelopmentContent,
  appDevelopmentContent,
  appMaintenanceContent,
  socialMediaContent,
  googleAdsContent,
  metaAdsContent,
  automationContent,
  commonCtaContent
} from "./data/services-content";
import { generateAllServicesSchemas } from "../utils/services-schema";

// Dynamically import components for code splitting
const WebDevelopmentSection = dynamic(() => import("./components/WebDevelopmentSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Web Development section...</div>
});
const AppDevelopmentSection = dynamic(() => import("./components/AppDevelopmentSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading App Development section...</div>
});
const AppMaintenanceSection = dynamic(() => import("./components/AppMaintenanceSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading App Maintenance section...</div>
});
const SocialMediaSection = dynamic(() => import("./components/SocialMediaSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Social Media section...</div>
});
const GoogleAdsSection = dynamic(() => import("./components/GoogleAdsSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Google Ads section...</div>
});
const MetaAdsSection = dynamic(() => import("./components/MetaAdsSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Meta Ads section...</div>
});
const AutomationSection = dynamic(() => import("./components/AutomationSection"), {
  loading: () => <div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Automation section...</div>
});

export const metadata: Metadata = {
  title: "Services by Sharp Ireland",
  description: "Growth focused services across web, app, marketing and automation",
  keywords: ["AI services", "digital marketing", "web development", "business growth", "Sharp Ireland", "Dublin digital agency"],
  openGraph: {
    title: "Services by Sharp Ireland",
    description: "Growth focused services across web, app, marketing and automation",
    url: "https://www.sharpireland.com/services",
    siteName: "Sharp Ireland",
    images: [
      {
        url: "https://www.sharpireland.com/og-image.jpg", // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: "Sharp Ireland Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services by Sharp Ireland",
    description: "Growth focused services across web, app, marketing and automation",
    creator: "@SharpIreland", // Replace with actual Twitter handle
    images: ["https://www.sharpireland.com/twitter-image.jpg"], // Replace with actual Twitter image
  },
  // Add canonical URL for SEO
  alternates: {
    canonical: "https://www.sharpireland.com/services",
  },
};

// Generate structured data for the services page
const servicesSchemas = generateAllServicesSchemas(
  webDevelopmentContent,
  appDevelopmentContent,
  appMaintenanceContent,
  socialMediaContent,
  googleAdsContent,
  metaAdsContent,
  automationContent
);

// Add JSON-LD structured data to the page
export default function ServicesPage() {
  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-green)] focus:text-[var(--white-color)] focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Add JSON-LD structured data */}
      {servicesSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Main content */}
      <main
        id="main-content"
        className="flex min-h-screen flex-col items-center justify-between"
        tabIndex={-1} // Makes it focusable for skip link
      >
        {/* Hero Section */}
        <ErrorBoundary>
          <ServiceHero content={serviceHeroContent} />
        </ErrorBoundary>
        
        {/* Core Service Sections */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Web Development section...</div>}>
            <WebDevelopmentSection content={webDevelopmentContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading App Development section...</div>}>
            <AppDevelopmentSection content={appDevelopmentContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading App Maintenance section...</div>}>
            <AppMaintenanceSection content={appMaintenanceContent} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Marketing Service Sections */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Social Media section...</div>}>
            <SocialMediaSection content={socialMediaContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Google Ads section...</div>}>
            <GoogleAdsSection content={googleAdsContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Meta Ads section...</div>}>
            <MetaAdsSection content={metaAdsContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 animate-pulse bg-[var(--bg-100)]">Loading Automation section...</div>}>
            <AutomationSection content={automationContent} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Global CTA Section */}
        <section
          id="services-global-cta"
          className="w-full py-20 md:py-32 bg-[var(--bg-200)]"
          aria-labelledby="services-global-cta-title"
        >
          <div className="w-full max-w-screen-xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-12">
            <div id="services-global-cta-header" className="text-center">
              <h2 id="services-global-cta-title" className="text-4xl md:text-5xl font-bold text-[var(--text-100)]">
                Ready to grow your business?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base md:text-lg opacity-80">
                Get in touch with our team to discuss how our services can help you achieve your business goals.
              </p>
            </div>
            <ServiceCTA
              id={commonCtaContent.id}
              primaryText={commonCtaContent.primaryText}
              secondaryText={commonCtaContent.secondaryText}
              primaryLink={commonCtaContent.primaryLink}
              secondaryLink={commonCtaContent.secondaryLink}
            />
          </div>
        </section>
      </main>
    </>
  );
}
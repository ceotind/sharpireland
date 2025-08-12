import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ServiceHero from "./components/ServiceHero";
import EnhancedCTA from "./components/EnhancedCTA";
import ErrorBoundary from "../components/ErrorBoundary";
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
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading Web Development section...</div>
});
const AppDevelopmentSection = dynamic(() => import("./components/AppDevelopmentSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading App Development section...</div>
});
const AppMaintenanceSection = dynamic(() => import("./components/AppMaintenanceSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading App Maintenance section...</div>
});
const SocialMediaSection = dynamic(() => import("./components/SocialMediaSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading Social Media section...</div>
});
const GoogleAdsSection = dynamic(() => import("./components/GoogleAdsSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading Google Ads section...</div>
});
const MetaAdsSection = dynamic(() => import("./components/MetaAdsSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading Meta Ads section...</div>
});
const AutomationSection = dynamic(() => import("./components/AutomationSection"), {
  loading: () => <div className="py-20 bg-[var(--bg-100)]">Loading Automation section...</div>
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
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading Web Development section...</div>}>
            <WebDevelopmentSection content={webDevelopmentContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading App Development section...</div>}>
            <AppDevelopmentSection content={appDevelopmentContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading App Maintenance section...</div>}>
            <AppMaintenanceSection content={appMaintenanceContent} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Marketing Service Sections */}
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading Social Media section...</div>}>
            <SocialMediaSection content={socialMediaContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading Google Ads section...</div>}>
            <GoogleAdsSection content={googleAdsContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading Meta Ads section...</div>}>
            <MetaAdsSection content={metaAdsContent} />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 bg-[var(--bg-100)]">Loading Automation section...</div>}>
            <AutomationSection content={automationContent} />
          </Suspense>
        </ErrorBoundary>
        
        {/* Global CTA Section - Enhanced */}
        <section
          id="services-global-cta"
          className="w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-[var(--bg-200)]"
          aria-labelledby="services-global-cta-title"
        >
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="services-global-cta-container" className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
              <div id="services-global-cta-header" className="text-center max-w-4xl">
                <h2 id="services-global-cta-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-100)] leading-tight">
                  Ready to grow your business?
                </h2>
                <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-[var(--text-200)] text-base sm:text-lg md:text-xl opacity-80 leading-relaxed">
                  Get in touch with our team to discuss how our services can help you achieve your business goals.
                </p>
              </div>
              <EnhancedCTA content={commonCtaContent} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
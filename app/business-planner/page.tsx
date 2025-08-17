"use client";

import Link from "next/link";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";

export default function BusinessPlannerPage() {
  return (
    <>
      {/* Enhanced SEO Schema for Business Planner */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://sharpdigital.ie/business-planner#webpage",
            "name": "AI Business Planner | Sharp Digital Ireland",
            "description": "Get personalized business advice and strategic planning with our AI-powered business planner. Free tier available with 10 conversations per month.",
            "url": "https://sharpdigital.ie/business-planner",
            "inLanguage": "en-IE",
            "isPartOf": {
              "@id": "https://sharpdigital.ie/#website"
            },
            "about": {
              "@id": "https://sharpdigital.ie/#organization"
            },
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "AI Business Planner",
              "description": "AI-powered business planning tool for entrepreneurs and small businesses",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Tier",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "description": "10 AI conversations per month"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "price": "5",
                  "priceCurrency": "EUR",
                  "description": "50 AI conversations per month with advanced features"
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://sharpdigital.ie"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Business Planner",
                  "item": "https://sharpdigital.ie/business-planner"
                }
              ]
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does the AI Business Planner work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI Business Planner uses advanced language models trained on business strategy, market analysis, and entrepreneurship best practices. Simply describe your business idea or challenge, and our AI will provide personalized advice, strategic recommendations, and actionable insights tailored to your specific situation and industry."
                }
              },
              {
                "@type": "Question",
                "name": "Is my business information secure and confidential?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We take data security seriously and implement enterprise-grade security measures. All conversations are encrypted in transit and at rest. We never share your business information with third parties, and you maintain full ownership of your data."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between the free and paid plans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The free tier includes 10 AI conversations per month with basic business planning features. The Pro plan (€5/month) offers 50 conversations, advanced planning tools, detailed financial modeling, comprehensive market analysis, priority support, and export capabilities."
                }
              },
              {
                "@type": "Question",
                "name": "What types of businesses can benefit from this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI Business Planner is designed for solo entrepreneurs, freelancers, startups, and small businesses across all industries. Whether you're launching a tech startup, opening a local service business, starting an e-commerce store, or scaling a consulting practice, our AI can provide relevant insights."
                }
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Business Planner",
            "description": "AI-powered business planning and strategic advice for entrepreneurs and small businesses",
            "provider": {
              "@id": "https://sharpdigital.ie/#organization"
            },
            "areaServed": "Ireland",
            "serviceType": "Business Consulting",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Business Planning Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Strategic Planning",
                    "description": "Comprehensive business strategies tailored to your industry and goals"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Financial Modeling",
                    "description": "Realistic financial projections and cash flow forecasts"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Market Research",
                    "description": "Target audience analysis and competitor insights"
                  }
                }
              ]
            }
          })
        }}
      />

      <main id="business-planner-page-main" className="min-h-screen bg-[var(--bg-100)]" role="main">
        {/* Breadcrumb Navigation */}
        <nav id="business-planner-breadcrumb-nav" aria-label="Breadcrumb" className="sr-only">
          <ol id="business-planner-breadcrumb-list" itemScope itemType="https://schema.org/BreadcrumbList">
            <li id="business-planner-breadcrumb-home" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link itemProp="item" href="/">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li id="business-planner-breadcrumb-current" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">Business Planner</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        {/* Hero Section - Primary landing area */}
        <section id="business-planner-hero-wrapper" aria-labelledby="business-planner-hero-heading">
          <HeroSection />
        </section>

        {/* Features Section - Key benefits and capabilities */}
        <section id="business-planner-features-wrapper" aria-labelledby="features-heading">
          <FeaturesSection />
        </section>

        {/* Pricing Section - Free and paid tiers */}
        <section id="business-planner-pricing-wrapper" aria-labelledby="pricing-heading">
          <PricingSection />
        </section>

        {/* FAQ Section - Common questions and answers */}
        <section id="business-planner-faq-wrapper" aria-labelledby="faq-heading">
          <FAQSection />
        </section>
      </main>
    </>
  );
}
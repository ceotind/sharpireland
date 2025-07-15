"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

import HeroSection from './components/HeroSection';
import TechGridSection from './components/TechGridSection';
import ProjectsSection from './components/ProjectsSection';
import ProcessSection from './components/ProcessSection';
import ContactSectionWrapper from './components/ContactSectionWrapper';
import SaaSComparisonSection from './components/SaaSComparisonSection';
import TestimonialsSection from './components/TestimonialsSection';
// import SharpImageSection from './components/SharpImageSection'; // Commented out as it's not used
import TripleSwitchSection from './components/TripleSwitchSection';

// Force dynamic rendering for this page since it has interactive elements
// export const dynamic = 'force-dynamic';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  // Clean up ScrollTrigger on component unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Enhanced SEO Schema for WebPage and FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://sharpdigital.ie/#webpage",
            "name": "Sharp Digital Ireland - Premier Web Development Agency Dublin",
            "description": "Leading web development agency in Ireland specializing in React, Next.js, and custom digital solutions. Expert developers serving Dublin and all of Ireland.",
            "url": "https://sharpdigital.ie",
            "inLanguage": "en-IE",
            "isPartOf": {
              "@id": "https://sharpdigital.ie/#website"
            },
            "about": {
              "@id": "https://sharpdigital.ie/#organization"
            },
            "mainEntity": {
              "@id": "https://sharpdigital.ie/#organization"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://sharpdigital.ie"
                }
              ]
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2", ".hero-description"]
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
                "name": "What web development services does Sharp Digital Ireland offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sharp Digital Ireland offers comprehensive web development services including React development, Next.js applications, full-stack development, custom software solutions, UI/UX design, e-commerce development, and digital transformation services for businesses across Ireland."
                }
              },
              {
                "@type": "Question",
                "name": "Why choose Sharp Digital for web development in Ireland?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sharp Digital Ireland stands out with expert React and Next.js development, modern technology stack, responsive design, SEO optimization, and personalized service. We deliver high-performance web applications that drive business growth for Irish companies."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sharp Digital serve clients outside Dublin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sharp Digital Ireland serves clients throughout Ireland including Dublin, Cork, Galway, and all other cities and towns. We provide remote web development services and can work with businesses across the entire country."
                }
              },
              {
                "@type": "Question",
                "name": "What technologies does Sharp Digital specialize in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sharp Digital specializes in modern web technologies including React, Next.js, TypeScript, JavaScript, Node.js, Python, PostgreSQL, MongoDB, AWS, Google Cloud, and various other cutting-edge tools for web development and digital solutions."
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
            "@type": "ItemList",
            "name": "Web Development Services Ireland",
            "description": "Comprehensive web development services offered by Sharp Digital Ireland",
            "itemListElement": [
              {
                "@type": "Service",
                "position": 1,
                "name": "React Development Ireland",
                "description": "Expert React.js development for modern, interactive web applications",
                "provider": {
                  "@id": "https://sharpdigital.ie/#organization"
                },
                "areaServed": "Ireland",
                "serviceType": "Web Development"
              },
              {
                "@type": "Service",
                "position": 2,
                "name": "Next.js Development Dublin",
                "description": "High-performance Next.js applications with server-side rendering and static generation",
                "provider": {
                  "@id": "https://sharpdigital.ie/#organization"
                },
                "areaServed": "Ireland",
                "serviceType": "Web Development"
              },
              {
                "@type": "Service",
                "position": 3,
                "name": "Full-Stack Development Ireland",
                "description": "Complete web application development from frontend to backend",
                "provider": {
                  "@id": "https://sharpdigital.ie/#organization"
                },
                "areaServed": "Ireland",
                "serviceType": "Web Development"
              },
              {
                "@type": "Service",
                "position": 4,
                "name": "Custom Software Development",
                "description": "Bespoke software solutions tailored to business needs",
                "provider": {
                  "@id": "https://sharpdigital.ie/#organization"
                },
                "areaServed": "Ireland",
                "serviceType": "Software Development"
              }
            ]
          })
        }}
      />
      
      <main className="min-h-screen bg-[var(--background)]" role="main">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">Home</span>
              <meta itemProp="position" content="1" />
            </li>
          </ol>
        </nav>

        {/* Hero Section - Primary landing area */}
        <section aria-labelledby="hero-heading">
          <HeroSection />
        </section>
        
        {/* Technologies Section - Our expertise */}
        <section aria-labelledby="technologies-heading">
          <TechGridSection />
        </section>
        
        {/* Triple Switch Section - Project constraints */}
        <section aria-labelledby="triple-switch-heading">
          <TripleSwitchSection />
        </section>
        
        {/* Portfolio Section - Our work */}
        <section aria-labelledby="projects-heading">
          <ProjectsSection />
        </section>
        
        {/* Process Section - How we work */}
        <section aria-labelledby="process-heading">
          <ProcessSection />
        </section>
        
        {/* Comparison Section - Why choose us */}
        <section aria-labelledby="comparison-heading">
          <SaaSComparisonSection />
        </section>
        
        {/* Testimonials Section - Social proof */}
        <section aria-labelledby="testimonials-heading">
          <TestimonialsSection />
        </section>
        
        {/* Contact Section - Get in touch */}
        <section aria-labelledby="contact-heading">
          <ContactSectionWrapper />
        </section>
      </main>
    </>
  );
}

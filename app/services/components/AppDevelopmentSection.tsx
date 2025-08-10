"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SectionHeader from './SectionHeader';
import FeatureGrid from './FeatureGrid';
import ServiceCTA from './ServiceCTA';
import { AppDevelopmentContent, commonCtaContent } from '../data/services-content';


interface AppDevelopmentSectionProps {
  content: AppDevelopmentContent;
}

const AppDevelopmentSection: React.FC<AppDevelopmentSectionProps> = ({ content }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.animate-element'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        mockupsRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mockupsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <section id="services-app-dev-root" className="py-20 md:py-32 bg-[var(--bg-100)]">
      <div id="services-app-dev-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          id="services-app-dev-header"
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div id="services-app-dev-content" className="grid lg:grid-cols-2 gap-12 items-center">
          <div id="services-app-dev-features" className="animate-element">
            <FeatureGrid id="app-dev-features-grid" features={content.features} />
          </div>

          <div id="services-app-dev-visuals" className="relative animate-element" ref={mockupsRef}>
            {/* Placeholder for device mockups and tabs */}
            <div id="app-dev-mockups-placeholder" className="relative w-full h-96 bg-[var(--bg-200)] rounded-xl flex items-center justify-center text-[var(--text-200)] text-center p-4 border border-[var(--bg-300)]">
              <p>Device Mockups and Tabs will go here</p>
              <div id="app-dev-mockups-gradient" className="absolute inset-0 rounded-xl opacity-30" style={{ background: 'linear-gradient(135deg, var(--primary-200) 0%, var(--primary-100) 100%)' }}></div>
            </div>
          </div>
        </div>

        <ServiceCTA id="app-dev-cta-section" primaryText={commonCtaContent.primaryText} secondaryText={commonCtaContent.secondaryText} primaryLink={commonCtaContent.primaryLink} secondaryLink={commonCtaContent.secondaryLink} />
      </div>
    </section>
  );
};

export default AppDevelopmentSection;
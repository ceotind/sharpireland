"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SectionHeader from './SectionHeader';
import FeatureGrid from './FeatureGrid';
import ProcessSteps from './ProcessSteps';
import FAQSlice from './FAQSlice';
import ServiceCTA from './ServiceCTA';
import { AppMaintenanceContent, commonCtaContent } from '../data/services-content';

gsap.registerPlugin(ScrollTrigger);

interface AppMaintenanceSectionProps {
  content: AppMaintenanceContent;
}

const AppMaintenanceSection: React.FC<AppMaintenanceSectionProps> = ({ content }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.animate-in'),
        { opacity: 0, y: 50 },
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
    }
  }, []);

  return (
    <section id="services-maintenance-root" className="py-20 md:py-32 bg-[var(--bg-100)]" ref={sectionRef}>
      <div id="services-maintenance-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          id="services-maintenance-header"
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div id="services-maintenance-content" className="grid lg:grid-cols-2 gap-12 items-start">
          <div id="services-maintenance-features" className="animate-in">
            <h3 id="services-maintenance-features-title" className="text-2xl font-bold text-[var(--text-100)] mb-6 font-anton">Key Maintenance Areas</h3>
            <FeatureGrid id="app-maint-features-grid" features={content.features} />
          </div>

          <div id="services-maintenance-process" className="animate-in">
            <h3 id="services-maintenance-process-title" className="text-2xl font-bold text-[var(--text-100)] mb-6 font-anton">Our Maintenance Process</h3>
            <ProcessSteps id="app-maint-process-steps" steps={content.processSteps} />
          </div>
        </div>

        {content.faqs && content.faqs.length > 0 && (
          <div id="services-maintenance-faq" className="animate-in">
            <h3 id="services-maintenance-faq-title" className="text-2xl font-bold text-[var(--text-100)] mb-6 font-anton">Frequently Asked Questions</h3>
            <FAQSlice id="app-maint-faq-slice" faqs={content.faqs} />
          </div>
        )}

        <ServiceCTA
          id="app-maint-cta-section"
          primaryText={commonCtaContent.primaryText}
          secondaryText={commonCtaContent.secondaryText}
          primaryLink={commonCtaContent.primaryLink}
          secondaryLink={commonCtaContent.secondaryLink}
        />
      </div>
    </section>
  );
};

export default AppMaintenanceSection;
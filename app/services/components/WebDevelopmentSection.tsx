"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import Image from "next/image";
import { WebDevelopmentContent, commonCtaContent } from "../data/services-content";

gsap.registerPlugin(ScrollTrigger);

interface WebDevelopmentSectionProps {
  content: WebDevelopmentContent;
}

export default function WebDevelopmentSection({ content }: WebDevelopmentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".animate-element"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <section id="services-web-dev-root" ref={sectionRef} className="bg-[var(--bg-100)] py-20 md:py-32">
      <div id="web-dev-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div id="web-dev-header-wrapper" className="animate-element">
          <SectionHeader
            id="web-dev-section-header"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        <div id="web-dev-content-grid" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div id="web-dev-features-column" className="animate-element">
            <FeatureGrid id="web-dev-features-grid" features={content.features} />
          </div>
          <div id="web-dev-brand-collage-column" className="animate-element p-4 rounded-xl shadow-lg bg-[var(--bg-200)] border border-[var(--bg-300)]">
            <div id="web-dev-brand-collage-grid" className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {content.brandLogos.map((logoSrc, index) => (
                <div id={`brand-logo-${index}`} key={logoSrc} className="flex items-center justify-center p-2 sm:p-4 bg-[var(--bg-100)] rounded-md shadow-sm border border-[var(--bg-300)]">
                  <Image
                    src={logoSrc}
                    alt={`Brand logo ${index + 1}`}
                    width={100} // Adjust as needed
                    height={60} // Adjust as needed
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="web-dev-cta-wrapper" className="animate-element text-center mt-12">
          <ServiceCTA
            id="web-dev-cta-section"
            primaryText={commonCtaContent.primaryText}
            secondaryText={commonCtaContent.secondaryText}
            primaryLink={commonCtaContent.primaryLink}
            secondaryLink={commonCtaContent.secondaryLink}
          />
        </div>
      </div>
    </section>
  );
}
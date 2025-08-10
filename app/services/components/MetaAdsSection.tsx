"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import Link from "next/link";
import Image from "next/image";
import { MetaAdsContent, commonCtaContent } from "../data/services-content";

gsap.registerPlugin(ScrollTrigger);

interface MetaAdsSectionProps {
  content: MetaAdsContent;
}

export default function MetaAdsSection({ content }: MetaAdsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const personasRef = useRef<HTMLDivElement>(null);
  const [activeCreative, setActiveCreative] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Animation for section elements
  useEffect(() => {
    if (sectionRef.current) {
      // Animate section elements
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".animate-element"),
        { opacity: 0, y: 30 },
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

  // Animation for persona cards
  useEffect(() => {
    if (personasRef.current) {
      const personaCards = personasRef.current.querySelectorAll(".persona-card");
      
      // Subtle floating animation for persona cards
      personaCards.forEach((card, index) => {
        gsap.to(card, {
          y: "-8px",
          duration: 0.6,
          ease: "power2.out",
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      });
    }
  }, []);

  // Carousel drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current || !e.touches[0]) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Function to navigate to next creative
  const nextCreative = () => {
    setActiveCreative((prev) => 
      prev === content.creativeCarousel.length - 1 ? 0 : prev + 1
    );
  };

  // Function to navigate to previous creative
  const prevCreative = () => {
    setActiveCreative((prev) => 
      prev === 0 ? content.creativeCarousel.length - 1 : prev - 1
    );
  };

  // Function to set active creative directly
  const setCreative = (index: number) => {
    setActiveCreative(index);
  };

  return (
    <section id="services-meta-ads-root" ref={sectionRef} className="bg-[var(--bg-100)] py-20 md:py-32">
      <div id="meta-ads-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div id="meta-ads-header-wrapper" className="animate-element">
          <SectionHeader
            id="services-meta-ads"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        {/* Creative Carousel */}
        <div id="meta-ads-creative-carousel-wrapper" className="animate-element">
          <div id="meta-ads-creative-carousel-container" className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md">
            <h3 id="meta-ads-creative-carousel-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton mb-6">
              Ad Creative Formats
            </h3>
            
            {/* Carousel Navigation */}
            <div id="meta-ads-carousel-nav" className="flex justify-between items-center mb-6">
              <button 
                id="meta-ads-carousel-prev" 
                onClick={prevCreative}
                className="bg-[var(--bg-300)] hover:bg-[var(--accent-green)] text-[var(--text-100)] hover:text-[var(--white-color)] p-2 rounded-full transition-colors duration-300"
                aria-label="Previous creative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <div id="meta-ads-carousel-indicators" className="flex gap-2">
                {content.creativeCarousel.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    id={`meta-ads-carousel-indicator-${index}`}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      activeCreative === index ? "bg-[var(--accent-green)]" : "bg-[var(--bg-300)]"
                    }`}
                    onClick={() => setCreative(index)}
                    aria-label={`Go to creative ${index + 1}`}
                    aria-current={activeCreative === index ? "true" : "false"}
                  />
                ))}
              </div>
              
              <button 
                id="meta-ads-carousel-next" 
                onClick={nextCreative}
                className="bg-[var(--bg-300)] hover:bg-[var(--accent-green)] text-[var(--text-100)] hover:text-[var(--white-color)] p-2 rounded-full transition-colors duration-300"
                aria-label="Next creative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
            {/* Carousel Content */}
            <div 
              id="meta-ads-carousel-content"
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div id="meta-ads-carousel-track" className="flex gap-4 md:gap-6 pb-4">
                {content.creativeCarousel.map((creative, index) => (
                  <div
                    key={creative.id}
                    id={creative.id}
                    className={`flex-shrink-0 w-full md:w-[calc(100%-2rem)] transition-opacity duration-300 ${
                      activeCreative === index ? "opacity-100" : "opacity-0 hidden md:block"
                    }`}
                  >
                    <div id={`${creative.id}-content`} className="flex flex-col md:flex-row gap-6 bg-[var(--bg-100)] rounded-lg overflow-hidden border border-[var(--bg-300)]">
                      {/* Creative Media */}
                      <div id={`${creative.id}-media`} className="relative w-full md:w-1/2 h-64 md:h-auto">
                        {creative.type === "video" ? (
                          <div className="relative w-full h-full">
                            <Image
                              id={`${creative.id}-thumbnail`}
                              src={creative.thumbnailUrl || creative.mediaUrl}
                              alt={creative.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-16 h-16 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            id={`${creative.id}-image`}
                            src={creative.mediaUrl}
                            alt={creative.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Creative Info */}
                      <div id={`${creative.id}-info`} className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                        <span id={`${creative.id}-type`} className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium mb-2">
                          {creative.type} Format
                        </span>
                        <h4 id={`${creative.id}-title`} className="text-xl font-bold text-[var(--text-100)] mb-2 font-anton">
                          {creative.title}
                        </h4>
                        <p id={`${creative.id}-description`} className="text-[var(--text-200)]">
                          {creative.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Swipe Instruction */}
            <div id="meta-ads-swipe-instruction" className="text-center text-sm text-[var(--text-200)] mt-4 md:hidden">
              Swipe to see more ad formats
            </div>
          </div>
        </div>

        {/* Audience Persona Cards */}
        <div id="meta-ads-personas-wrapper" className="animate-element">
          <div id="meta-ads-personas-container" ref={personasRef} className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md">
            <h3 id="meta-ads-personas-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton mb-6">
              Audience Targeting Personas
            </h3>
            
            <div id="meta-ads-personas-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.personaCards.map((persona) => (
                <div
                  key={persona.id}
                  id={persona.id}
                  className="persona-card bg-[var(--bg-100)] rounded-lg overflow-hidden border border-[var(--bg-300)] shadow-sm transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: persona.backgroundColor }}
                >
                  {/* Persona Header */}
                  <div id={`${persona.id}-header`} className="relative h-32 bg-gradient-to-b from-[var(--accent-green-base)] to-[var(--bg-200)] opacity-20">
                    <div className="absolute bottom-0 right-0 transform translate-y-1/2">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--bg-100)]">
                        <Image
                          id={`${persona.id}-avatar`}
                          src={persona.avatar}
                          alt={persona.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Persona Content */}
                  <div id={`${persona.id}-content`} className="p-6 pt-12">
                    <h4 id={`${persona.id}-name`} className="text-lg font-bold text-[var(--text-100)] mb-1 font-anton">
                      {persona.name}
                    </h4>
                    
                    <div id={`${persona.id}-demographics`} className="flex gap-4 text-sm text-[var(--text-200)] mb-4">
                      <span id={`${persona.id}-age`}>{persona.age}</span>
                      <span id={`${persona.id}-location`}>{persona.location}</span>
                    </div>
                    
                    {/* Interests */}
                    <div id={`${persona.id}-interests-container`} className="mb-4">
                      <h5 id={`${persona.id}-interests-title`} className="text-xs uppercase tracking-wide text-[var(--text-200)] mb-2">
                        Interests
                      </h5>
                      <div id={`${persona.id}-interests`} className="flex flex-wrap gap-2">
                        {persona.interests.map((interest, index) => (
                          <span
                            key={`${persona.id}-interest-${index}`}
                            id={`${persona.id}-interest-${index}`}
                            className="text-xs bg-[var(--bg-200)] text-[var(--text-100)] px-2 py-1 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Behaviors */}
                    <div id={`${persona.id}-behaviors-container`}>
                      <h5 id={`${persona.id}-behaviors-title`} className="text-xs uppercase tracking-wide text-[var(--text-200)] mb-2">
                        Behaviors
                      </h5>
                      <div id={`${persona.id}-behaviors`} className="flex flex-wrap gap-2">
                        {persona.behaviors.map((behavior, index) => (
                          <span
                            key={`${persona.id}-behavior-${index}`}
                            id={`${persona.id}-behavior-${index}`}
                            className="text-xs bg-[var(--accent-green-base)] bg-opacity-10 text-[var(--text-100)] px-2 py-1 rounded-full"
                          >
                            {behavior}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="meta-ads-features-wrapper" className="animate-element">
          <FeatureGrid id="meta-ads-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="meta-ads-links-wrapper" className="animate-element text-center">
          <div id="meta-ads-links" className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
            <Link 
              href="/contact" 
              id="meta-ads-contact-link"
              className="text-[var(--accent-green)] hover:underline font-medium"
            >
              Contact us about Meta advertising management
            </Link>
            <Link 
              href="/case-studies" 
              id="meta-ads-case-studies-link"
              className="text-[var(--accent-green)] hover:underline font-medium"
            >
              View our Meta advertising case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="meta-ads-cta-wrapper" className="animate-element text-center mt-8">
          <ServiceCTA
            id="meta-ads-cta-section"
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
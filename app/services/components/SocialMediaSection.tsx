"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import StatBar from "./StatBar";
import ServiceCTA from "./ServiceCTA";
import Link from "next/link";
import Image from "next/image";
import { SocialMediaContent, commonCtaContent } from "../data/services-content";
import { useTheme } from "../../context/ThemeContext";
import { useErrorHandler } from "../../components/ErrorBoundary";
import { useComponentPerformance, monitorLCP } from "../../utils/performance-monitoring";

gsap.registerPlugin(ScrollTrigger);

interface SocialMediaSectionProps {
  content: SocialMediaContent;
}

export default function SocialMediaSection({ content }: SocialMediaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentBoardRef = useRef<HTMLDivElement>(null);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const { prefersReducedMotion } = useTheme();
  const handleError = useErrorHandler();

  // Performance monitoring
  useEffect(() => {
    // Monitor LCP for the hero section
    monitorLCP('social-media-content-board');
    
    // Return cleanup function that measures component render time
    return useComponentPerformance('SocialMediaSection');
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    try {
      // Animation configuration based on motion preference
      const animationConfig = {
        opacity: prefersReducedMotion ? { from: 0.8, to: 1 } : { from: 0, to: 1 },
        y: prefersReducedMotion ? { from: 0, to: 0 } : { from: 30, to: 0 },
        scale: prefersReducedMotion ? { from: 0.98, to: 1 } : { from: 0.95, to: 1 },
        duration: prefersReducedMotion ? 0.3 : 0.6,
        stagger: prefersReducedMotion ? 0.05 : 0.1,
      };

      // Animate section elements with reduced motion preference
      const elements = sectionRef.current.querySelectorAll(".animate-element");
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          {
            opacity: animationConfig.opacity.from,
            y: animationConfig.y.from
          },
          {
            opacity: animationConfig.opacity.to,
            y: animationConfig.y.to,
            duration: animationConfig.duration,
            stagger: animationConfig.stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Animate content board with reduced motion preference
      if (contentBoardRef.current) {
        gsap.fromTo(
          contentBoardRef.current,
          {
            opacity: animationConfig.opacity.from,
            scale: animationConfig.scale.from
          },
          {
            opacity: animationConfig.opacity.to,
            scale: animationConfig.scale.to,
            duration: animationConfig.duration,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentBoardRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [prefersReducedMotion, handleError]);

  return (
    <section
      id="services-social-root"
      ref={sectionRef}
      className="bg-[var(--bg-100)] py-20 md:py-32"
      aria-labelledby="social-media-section-title"
    >
      <div id="social-media-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div id="social-media-header-wrapper" className="animate-element">
          <SectionHeader
            id="social-media-section-header"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          {/* Hidden for screen readers but used for ARIA labeling */}
          <span id="social-media-section-title" className="sr-only">{content.title}</span>
        </div>

        {/* KPI Stats Bar */}
        <div id="social-media-stats-wrapper" className="animate-element">
          <StatBar
            id="social-media-stats"
            stats={content.stats}
            className="max-w-5xl mx-auto"
          />
        </div>

        {/* Content Planning Board Visual */}
        <div id="social-media-content-board-wrapper" className="animate-element">
          <div
            id="social-media-content-board"
            ref={contentBoardRef}
            className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
            aria-labelledby="content-board-title"
          >
            <div id="content-board-header" className="mb-6 flex justify-between items-center">
              <h3 id="content-board-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton">
                Content Planning Board
              </h3>
              <div id="content-board-legend" className="flex gap-3" aria-label="Post status legend">
                <span className="text-sm text-[var(--text-200)] font-inter">
                  <span
                    className="inline-block w-3 h-3 rounded-full bg-[var(--accent-green)] mr-1"
                    aria-hidden="true"
                  ></span>
                  Published
                </span>
                <span className="text-sm text-[var(--text-200)] font-inter">
                  <span
                    className="inline-block w-3 h-3 rounded-full bg-[var(--bg-300)] mr-1"
                    aria-hidden="true"
                  ></span>
                  Scheduled
                </span>
              </div>
            </div>

            {/* Mock Social Media Posts Grid */}
            <div
              id="social-media-posts-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              aria-label="Example social media posts"
            >
              {content.mockPosts.map((post) => (
                <div
                  id={`social-post-${post.id}`}
                  key={post.id}
                  className="relative bg-[var(--bg-100)] rounded-lg overflow-hidden border border-[var(--bg-300)] shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--accent-green)]"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  tabIndex={0} // Make focusable for keyboard navigation
                  role="article"
                  aria-labelledby={`social-post-${post.id}-platform social-post-${post.id}-text`}
                >
                  <div id={`social-post-${post.id}-platform`} className="absolute top-2 left-2 z-10">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-[var(--bg-200)] text-[var(--text-100)] rounded-full">
                      {post.platform}
                    </span>
                  </div>
                  
                  <div id={`social-post-${post.id}-image-container`} className="relative h-48 w-full">
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[1]"
                      aria-hidden="true"
                    ></div>
                    <Image
                      id={`social-post-${post.id}-image`}
                      src={post.image}
                      alt={`${post.platform} post example`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  
                  <div id={`social-post-${post.id}-content`} className="p-4">
                    <p id={`social-post-${post.id}-text`} className="text-sm text-[var(--text-100)] line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    
                    {/* Post Metadata (visible on hover or focus) */}
                    <div
                      id={`social-post-${post.id}-metadata`}
                      className={`text-xs text-[var(--text-200)] transition-opacity duration-300 ${
                        hoveredPost === post.id ? 'opacity-100' : 'opacity-0 focus-within:opacity-100'
                      }`}
                      aria-label="Post details"
                    >
                      <div id={`social-post-${post.id}-author`} className="font-medium mb-1">
                        {post.author}
                      </div>
                      <div id={`social-post-${post.id}-engagement`}>
                        {post.engagement}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="social-media-features-wrapper" className="animate-element">
          <FeatureGrid id="social-media-features-grid" features={content.features} />
        </div>

        {/* Internal Links */}
        <div id="social-media-links-wrapper" className="animate-element text-center">
          <div id="social-media-links" className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
            <Link
              href="/contact"
              id="social-media-contact-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-md px-2 py-1 font-medium"
              aria-label="Contact us about social media management services"
            >
              Contact us about social media management
            </Link>
            <Link
              href="/case-studies"
              id="social-media-case-studies-link"
              className="text-[var(--accent-green)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] rounded-md px-2 py-1 font-medium"
              aria-label="View our social media case studies and success stories"
            >
              View our social media case studies
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div id="social-media-cta-wrapper" className="animate-element text-center mt-8">
          <ServiceCTA
            id="social-media-cta-section"
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
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const technologiesData = [
  // Row 1 (Desktop)
  { name: "Adobe Illustrator", imgSrc: "/images/brands/Adobe_Illustrator_CC_icon.svg", alt: "Adobe Illustrator Logo", widthClass: "w-[38%]", gridClasses: "md:col-start-5", borderClasses: "md:border-b-0", corners: ['tl', 'tr'] },
  { name: "Adobe Photoshop", imgSrc: "/images/brands/Adobe_Photoshop_CC_icon.svg", alt: "Adobe Photoshop Logo", widthClass: "w-[28%]", gridClasses: "md:col-start-6", borderClasses: "border-l-0 md:border-b-0", corners: ['tr'] },

  // Row 2 (Desktop)
  { name: "Adobe Premiere Pro", imgSrc: "/images/brands/Adobe_Premiere_Pro_CC_icon.svg", alt: "Adobe Premiere Pro Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-2 md:col-start-1", borderClasses: "border-l-0 md:border-l", corners: ['tl', 'tr'] },
  { name: "Adobe XD", imgSrc: "/images/brands/Adobe_XD_CC_icon.svg", alt: "Adobe XD Logo", widthClass: "w-[28%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t md:border-l-0", corners: ['tr', 'tl-mobile'] },
  { name: "Amazon Web Services", imgSrc: "/images/brands/Amazon_Web_Services_Logo.svg", alt: "Amazon Web Services Logo", widthClass: "w-[28%] icon-white-in-dark", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },
  { name: "Logomark", imgSrc: "/images/brands/Logomark_Full Color.svg", alt: "Logomark Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr', 'tl-mobile'] },
  { name: "Cloudflare", imgSrc: "/images/brands/NET_BIG.svg", alt: "Cloudflare Logo", widthClass: "w-[38%] icon-white-in-dark", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t md:border-l-0", corners: ['tr', 'br'] },
  { name: "Tailwind CSS", imgSrc: "/images/brands/Tailwind_CSS_Logo.svg", alt: "Tailwind CSS Logo", widthClass: "w-[32%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },

  // Row 3 (Desktop)
  { name: "Figma", imgSrc: "/images/brands/figma-1-logo-svgrepo-com.svg", alt: "Figma Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-3 md:col-start-1", borderClasses: "border-t-0 border-l-0 md:border-l", corners: ['tl', 'tr', 'bl', 'br'] },
  { name: "Google Cloud", imgSrc: "/images/brands/google-cloud.svg", alt: "Google Cloud Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
  { name: "Cursor AI", imgSrc: "/images/brands/icons8-cursor-ai.svg", alt: "Cursor AI Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },
  { name: "Express.js", imgSrc: "/images/brands/icons8-express-js.svg", alt: "Express.js Logo", widthClass: "w-[32%] icon-black-white", gridClasses: "md:row-start-3", borderClasses: "border-t-0 border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
  { name: "Next.js", imgSrc: "/images/brands/nextjs-icon-svgrepo-com.svg", alt: "Next.js Logo", widthClass: "w-[28%] icon-black-white", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br'] },
  { name: "Node.js", imgSrc: "/images/brands/nodejs-icon.svg", alt: "Node.js Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 border-l-0", corners: ['tr', 'br'] },

  // Row 4 (Desktop)
  { name: "OpenAI", imgSrc: "/images/brands/openai-svgrepo-com.svg", alt: "OpenAI Logo", widthClass: "w-[32%] icon-black-white", gridClasses: "md:row-start-4 md:col-start-1", borderClasses: "border-t-0 border-l-0 md:border-l", corners: ['tr', 'br'] },
  { name: "PostgreSQL", imgSrc: "/images/brands/postgresql-logo-svgrepo-com.svg", alt: "PostgreSQL Logo", widthClass: "w-[28%]", gridClasses: "md:row-start-4", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
  { name: "Python", imgSrc: "/images/brands/python-svgrepo-com.svg", alt: "Python Logo", widthClass: "w-[38%]", gridClasses: "md:row-start-4", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },
  { name: "WordPress", imgSrc: "/images/brands/wordpress-color-svgrepo-com.svg", alt: "WordPress Logo", widthClass: "w-[32%]", gridClasses: "md:row-start-4", borderClasses: "border-t-0 border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
];

const CornerDot = ({ position }: { position: string }) => {
  let posClasses = "";
  if (position.includes('t')) posClasses += " top-0";
  if (position.includes('b')) posClasses += " bottom-0";
  if (position.includes('l')) posClasses += " left-0";
  if (position.includes('r')) posClasses += " right-0";

  if (position === 'tl') posClasses += " -translate-x-1/2 -translate-y-1/2";
  if (position === 'tr') posClasses += " translate-x-1/2 -translate-y-1/2";
  if (position === 'bl') posClasses += " -translate-x-1/2 translate-y-1/2";
  if (position === 'br') posClasses += " translate-x-1/2 translate-y-1/2";
  
  return (
    <div 
      className={`corner-dot aspect-square border border-[#5C5C5C] absolute w-[2vw] md:w-[.45vw] bg-white dark:bg-[#151515] z-[2] ${posClasses}`}
    ></div>
  );
};


export default function TechGridSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".tech-grid-item");
    if (!items || !sectionRef.current) return;

    // Smoother scroll animation with improved easing
    const scrollAnimation = gsap.fromTo(
      items,
      { 
        opacity: 0, 
        y: 30, // Reduced from 50 for smoother effect
        scale: 0.95 // Added subtle scale for more polished feel
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2, // Slightly longer for smoother motion
        stagger: {
          amount: 0.6, // Total stagger duration
          from: "start",
          ease: "power2.out"
        },
        ease: "power2.out", // Smoother, more standard easing
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%", // Slightly earlier trigger
          once: true, // Animation plays only once
        },
      }
    );

    // Store hover animations for cleanup
    const hoverAnimations: (() => void)[] = [];

    // Add smoother hover animations for tech logos
    items.forEach((item) => {
      const logo = item.querySelector("img");
      if (!logo) return;

      // Set initial state with better performance
      gsap.set(logo, { 
        scale: 1, 
        rotation: 0,
        transformOrigin: "center center"
      });
      
      // Create reusable animations
      let hoverTween: gsap.core.Tween | null = null;
      
      // Hover in animation with extremely smooth easing
      const handleMouseEnter = () => {
        if (hoverTween) hoverTween.kill();

        // Logo animation only
        hoverTween = gsap.to(logo, {
          scale: 1.08,
          rotation: 1,
          duration: 0.8,
          ease: "power1.out",
        });
      };
      
      // Hover out animation with extremely smooth spring-like effect
      const handleMouseLeave = () => {
        if (hoverTween) hoverTween.kill();

        // Logo animation only
        hoverTween = gsap.to(logo, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "power1.inOut",
        });
      };

      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
      
      // Store cleanup function
      hoverAnimations.push(() => {
        item.removeEventListener("mouseenter", handleMouseEnter);
        item.removeEventListener("mouseleave", handleMouseLeave);
        if (hoverTween) hoverTween.kill();
      });
    });

    // Cleanup function
    return () => {
      scrollAnimation.kill();
      hoverAnimations.forEach(cleanup => cleanup());
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === gridRef.current) {
          trigger.kill();
        }
      });
    };  }, []);

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="bg-[var(--background)] text-[var(--foreground)] py-20 md:py-32"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
      {/* Heading Section */}
      <div className="text-center">
        <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Our Technology</span>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
          Tools of Our Trade
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
          We leverage cutting-edge technologies and industry-leading tools to deliver exceptional digital solutions.
        </p>
      </div>

      {/* Grid Section */}
      <div ref={gridRef} className="mt-12 md:mt-16">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {technologiesData.map((tech, index) => (
            <div
              key={tech.name + index}
              className={`tech-grid-item aspect-square border border-[#5C5C5C] flex items-center justify-center relative group ${tech.gridClasses || ''} ${tech.borderClasses || ''}`}
            >
              <div className="absolute inset-0 z-0"></div>
              {tech.corners?.map(cornerPos => {
                if (cornerPos === 'tl-mobile' && index % 3 !== 0) return null; // only for first item in mobile row
                const isMobileOnlyDot = cornerPos.endsWith('-mobile');
                const basePos = isMobileOnlyDot ? cornerPos.replace('-mobile', '') : cornerPos;
                return <CornerDot key={cornerPos} position={`${basePos} ${isMobileOnlyDot ? 'md:hidden' : ''}`} />;
              })}
              <Image
                src={tech.imgSrc}
                alt={tech.alt}
                width={index === 14 ? 134 : (index === 15 ? 134 : 200)}
                height={index === 14 ? 136 : (index === 15 ? 136 : 100)}
                className={`${tech.widthClass} relative z-[2] h-auto will-change-transform`}
              />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

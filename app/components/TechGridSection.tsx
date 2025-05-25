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
  { name: "Figma", imgSrc: "/images/home/figma.webp", alt: "Figma Logo", widthClass: "w-[60%]", gridClasses: "md:col-start-5", borderClasses: "md:border-b-0", corners: ['tl', 'tr'] },
  { name: "Adobe XD", imgSrc: "/images/home/xd.webp", alt: "Adobe XD Logo", widthClass: "w-[35%]", gridClasses: "md:col-start-6", borderClasses: "border-l-0 md:border-b-0", corners: ['tr'] },
  
  // Row 2 (Desktop)
  { name: "Procreate", imgSrc: "/images/home/apsara.webp", alt: "Procreate Logo", widthClass: "w-[60%]", gridClasses: "md:row-start-2 md:col-start-1", borderClasses: "border-l-0 md:border-l", corners: ['tl', 'tr'] },
  { name: "Photoshop", imgSrc: "/images/home/ps.webp", alt: "Photoshop Logo", widthClass: "w-[35%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t md:border-l-0", corners: ['tr', 'tl-mobile'] },
  { name: "Illustrator", imgSrc: "/images/home/ai.webp", alt: "Illustrator Logo", widthClass: "w-[35%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },
  { name: "Tailwind CSS", imgSrc: "/images/home/tailwind.webp", alt: "Tailwind CSS Logo", widthClass: "w-[65%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr', 'tl-mobile'] },
  { name: "Next.js", imgSrc: "/images/home/nuxt.webp", alt: "Next.js Logo", widthClass: "w-[60%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t md:border-l-0", corners: ['tr', 'br'] },
  { name: "GSAP", imgSrc: "/images/home/gsap.webp", alt: "GSAP Logo", widthClass: "w-[50%]", gridClasses: "md:row-start-2", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },

  // Row 3 (Desktop)
  { name: "Alpine.js", imgSrc: "/images/home/alpinejs.webp", alt: "Alpine.js Logo", widthClass: "w-[60%]", gridClasses: "md:row-start-3 md:col-start-1", borderClasses: "border-t-0 border-l-0 md:border-l", corners: ['tl', 'tr', 'bl', 'br'] },
  { name: "Laravel", imgSrc: "/images/home/laravel.webp", alt: "Laravel Logo", widthClass: "w-[65%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
  { name: "Filament", imgSrc: "/images/home/filament.webp", alt: "Filament Logo", widthClass: "w-[60%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-t border-l-0", corners: ['tr'] },
  { name: "MySQL", imgSrc: "/images/home/mysql.webp", alt: "MySQL Logo", widthClass: "w-[50%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
  { name: "PostgreSQL", imgSrc: "/images/home/postgres.webp", alt: "PostgreSQL Logo", widthClass: "w-[35%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br'] },
  { name: "Cloudflare", imgSrc: "/images/home/cloudflare.webp", alt: "Cloudflare Logo", widthClass: "w-[60%]", gridClasses: "md:row-start-3", borderClasses: "border-t-0 border-l-0", corners: ['tr', 'br'] },
  
  // Row 4 (Desktop)
  { name: "Ploi", imgSrc: "/images/home/ploi.png", alt: "Ploi Logo", widthClass: "w-[90%]", gridClasses: "md:row-start-4 md:col-start-1", borderClasses: "border-t-0 border-l-0 md:border-l", corners: ['tr', 'br'] }, // Note: .png
  { name: "After Effects", imgSrc: "/images/home/ae.webp", alt: "After Effects Logo", widthClass: "w-[35%]", gridClasses: "md:row-start-4", borderClasses: "border-t-0 md:border-l-0", corners: ['tr', 'br', 'tl-mobile'] },
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
  
  return <div className={`aspect-square border border-[#5C5C5C] absolute w-[2vw] md:w-[.45vw] bg-[var(--background)] z-[2] ${posClasses}`}></div>;
};


export default function TechGridSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".tech-grid-item");
    if (items && sectionRef.current) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  // Helper to render char/word spans for text animation (structure only for now)
  const AnimatedText = ({ text, isMobile }: { text: string, isMobile?: boolean }) => {
    const words = text.split(" ");
    return (
      <>
        {words.map((word, i) => (
          <span key={i} className={`word-container ${isMobile && i > 1 ? 'block' : 'inline-block'}`}>
            <span className="word inline-block">
              {word.split("").map((char, j) => (
                <span key={j} className="char inline-block">{char}</span>
              ))}
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </>
    );
  };
  
  const AnimatedTextMobile = ({ line1, line2 }: { line1: string, line2: string }) => {
    return (
      <>
        <span className="overflow-hidden inline-block relative">
           <AnimatedText text={line1} isMobile />
        </span>
        <span className="overflow-hidden inline-block relative">
           <AnimatedText text={line2} isMobile />
           <span className="w-[7vw] inline-block md:hidden"></span> {/* Spacer from ref */}
        </span>
      </>
    )
  }


  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="bg-[var(--background)] text-[var(--foreground)] py-16 md:py-24 px-4"
    >
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-12">
      {/* Heading Section */}
      <div>
        {/* Desktop Heading */}
        <div className="hidden md:block">
          <div className="overflow-hidden">
            <div className="breadcrumbs flex gap-[.5vw] text-[17px] uppercase">
              <span>01</span><span>/</span><span>TECHNOLOGIES</span>
            </div>
          </div>
          <div className="pl-[4.75vw] pt-[2vw] relative w-max">
            <Image
              width={218} height={200} alt="Pencil Image"
              src="/images/home/pencil.webp" // Ensure this image is in public/images/home/
              className="heading-img absolute w-[6vw] bottom-0 translate-y-[20%] right-[8.5%] -translate-x-full z-[1]"
            />
            <h2 className="font-anton text-[105px] -tracking-[.01em] leading-[1.12] flex gap-[3.5vw] relative z-0 overflow-hidden">
              <AnimatedText text="TOOLS OF OUR" />
              <AnimatedText text="TRADE" />
            </h2>
          </div>
        </div>

        {/* Mobile Heading */}
        <div className="md:hidden">
          <div className="overflow-hidden pl-[22vw]">
            <div className="breadcrumbs flex gap-[.5vw] text-[14px] uppercase">
              <span>01</span><span>/</span><span>TECHNOLOGIES</span>
            </div>
          </div>
          <div className="pl-[4.75vw] pt-[4vw] relative w-max">
            <Image
              width={218} height={200} alt="Pencil Image"
              src="/images/home/pencil.webp" // Ensure this image is in public/images/home/
              className="heading-img-mobile absolute w-[16vw] bottom-0 translate-y-[20%] right-[15%] -translate-x-full z-[1]"
            />
            <h2 className="font-anton text-[56px] -tracking-[.01em] leading-[1.12] flex flex-col gap-[0vw] relative z-0 overflow-hidden">
              <AnimatedTextMobile line1="TOOLS OF" line2="OUR TRADE" />
            </h2>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div ref={gridRef} className="mt-12 md:mt-16">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {technologiesData.map((tech, index) => (
            <div
              key={tech.name + index}
              className={`tech-grid-item aspect-square border border-[#5C5C5C] flex items-center justify-center relative ${tech.gridClasses || ''} ${tech.borderClasses || ''}`}
            >
              <div className="absolute inset-0 z-0 bg-[#151515]"></div>
              {tech.corners?.map(cornerPos => {
                if (cornerPos === 'tl-mobile' && index % 3 !== 0) return null; // only for first item in mobile row
                const isMobileOnlyDot = cornerPos.endsWith('-mobile');
                const basePos = isMobileOnlyDot ? cornerPos.replace('-mobile', '') : cornerPos;
                return <CornerDot key={cornerPos} position={`${basePos} ${isMobileOnlyDot ? 'md:hidden' : ''}`} />;
              })}
              <Image
                src={tech.imgSrc}
                alt={tech.alt}
                width={index === 14 ? 134 : (index === 15 ? 134 : 200)} // Ploi and AE have different intrinsic widths in ref, approximate
                height={index === 14 ? 136 : (index === 15 ? 136 : 100)}
                className={`${tech.widthClass} relative z-[2] h-auto`}
              />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

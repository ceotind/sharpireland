"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".animate-element");
    if (elements) {
      gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }
  }, []);

  return (
    <section 
      id="dilshad-hero-section" 
      className="bg-[var(--bg-100)] min-h-screen flex items-center py-20 md:py-32 lg:py-40"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[50px] items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-element">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-100)] leading-tight">
              Dilshad Akhtar
            </h1>
            <p className="mt-6 max-w-lg text-[var(--text-300)] text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
              Transforming complex technical challenges into elegant solutions. Specialized in building scalable, user-centric applications with modern technologies.
            </p>
            <div className="flex flex-row gap-6 mt-10">
              <a
                href="tel:+353851185321"
                className="inline-block bg-[var(--accent-green)] py-3 px-8 rounded-lg font-semibold shadow-md text-[var(--white-color)] hover:bg-[var(--accent-green-base)] transition-colors duration-300"
                aria-label="Call Dilshad Akhtar"
              >
                Call Me
              </a>
              <a
                href="mailto:dilshad@sharpdigital.ie"
                className="inline-block py-3 px-8 rounded-lg font-semibold border-2 border-[var(--accent-green)] bg-transparent text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] transition-colors duration-300"
                aria-label="Email Dilshad Akhtar"
              >
                Email Me
              </a>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center lg:justify-end animate-element">
            <div className="relative w-full max-w-[500px] aspect-[4/3] lg:aspect-square">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[var(--accent-green)]">
                <Image
                  src="/images/dilshad.webp"
                  alt="Dilshad Akhtar"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
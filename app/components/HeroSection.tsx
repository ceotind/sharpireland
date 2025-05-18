"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      gsap.from(el.querySelectorAll("h1, p, a"), {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen flex items-center bg-[--background]">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[--foreground] mb-6 leading-tight">
          WE CRAFT<span className="block">DIGITAL</span><span className="block">EXPERIENCES</span>
        </h1>
        <p className="text-lg md:text-xl text-[--foreground] opacity-75 mb-8 max-w-xl mx-auto">
          A digital agency focused on creating memorable and effective online solutions for brands that want to stand out.
        </p>
        <a
          href="#projects"
          className="inline-block bg-[--accent-green] text-[--white-color] py-3 px-6 rounded-md font-medium hover:bg-[--accent-green-base] transition-colors"
        >
          Our Work
        </a>
      </div>
    </section>
  );
}

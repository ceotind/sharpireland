"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const technologies = [
  { name: "Next.js" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "GSAP" },
  { name: "TailwindCSS" },
  { name: "Node.js" },
];

export default function TechGridSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".tech-card");
    if (items && sectionRef.current) {
      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section id="technologies" ref={sectionRef} className="bg-[--background] py-20">
      <div className="container mx-auto px-4 text-center mb-12">
        <span className="text-sm uppercase tracking-wide text-[--accent-green]">Our Expertise</span>
        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[--foreground]">
          Technologies We Use
        </h2>
      </div>
      <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="tech-card flex items-center justify-center bg-[--background-lighter] rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <span className="text-base md:text-lg font-medium text-[--foreground]">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

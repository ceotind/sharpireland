"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  { id: "01", title: "XYZ Financial App", description: "Banking interface with enhanced UX" },
  { id: "02", title: "Eco Store Redesign", description: "E-commerce platform for sustainable products" },
  { id: "03", title: "Travel Explorer", description: "Interactive travel planning application" },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".project-card");
    if (cards && sectionRef.current) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
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
    <section id="projects" ref={sectionRef} className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Our Work</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Featured Projects
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Discover some of our latest work and see how we help businesses transform their digital presence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card bg-[var(--background-lighter)] p-6 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-green)] transition-all duration-300 hover:shadow-lg flex flex-col h-full"
            >
              <div className="text-sm font-semibold text-[var(--accent-green)]">{project.id}</div>
              <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{project.title}</h3>
              <p className="mt-2 text-[var(--foreground)] opacity-75 flex-grow">{project.description}</p>
              <a
                href="#"
                className="inline-block mt-4 pt-4 text-[var(--accent-green)] font-medium hover:text-[var(--accent-green-base)] transition-colors"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section id="projects" ref={sectionRef} className="bg-[--background] py-16 md:py-24 px-4">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[--accent-green]">Our Work</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[--foreground]">
            Featured Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card bg-[--background-lighter] p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="text-sm font-semibold text-[--accent-green]">{project.id}</div>
              <h3 className="mt-2 text-xl font-semibold text-[--foreground]">{project.title}</h3>
              <p className="mt-2 text-[--foreground] opacity-75">{project.description}</p>
              <a
                href="#"
                className="inline-block mt-auto pt-4 text-[--accent-green] font-medium hover:underline"
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

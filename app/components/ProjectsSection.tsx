"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: "01",
    title: "Sharp Meet",
    description: "Sharp Digital's in-house video call platform with high quality video rendering and face time capabilities. You are also welcome, try it!",
    link: "https://meet.sharpdigital.in"
  },
  {
    id: "02",
    title: "Content Writer Agent",
    description: "Tool to assist with content generation and editing for businesses reducing the expense of hiring professional writers.",
    link: "https://sharpdigital.ie"
  },
  {
    id: "03",
    title: "AI",
    description: "There are several AI projects that we are currently working with in different domains. We have 2 years of deep research in deep usage of AI.",
    link: "https://sharpdigital.ie"
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".project-card");
    if (cards && sectionRef.current) {
      const animation = gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
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
      
      return () => {
        const currentSection = sectionRef.current;
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === currentSection) {
            trigger.kill();
          }
        });
      };
    }
    
    return () => {
      // Cleanup function for when elements are not found
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="bg-[var(--bg-100)] py-12 md:py-32 px-2 sm:px-4" aria-labelledby="projects-heading">
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col gap-8 md:gap-12">
        <header className="text-center">
          <span className="text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Web Development Portfolio Ireland</span>
          <h2 id="projects-heading" className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]">
            Featured Web Development Projects Ireland
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80">
            Explore Sharp Digital Ireland&apos;s portfolio of successful web development projects. From React applications to Next.js platforms, see how we deliver exceptional digital solutions for Irish businesses.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8" role="list">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card bg-[var(--bg-200)] p-5 sm:p-6 rounded-lg border border-[var(--bg-300)] hover:border-[var(--accent-green)] transition-all duration-300 hover:shadow-lg flex flex-col h-full"
              role="listitem"
              itemScope
              itemType="https://schema.org/CreativeWork"
            >
              <div className="text-xs sm:text-sm font-semibold text-[var(--accent-green)]" aria-label={`Project ${project.id}`}>
                {project.id}
              </div>
              <h3 className="mt-2 text-lg sm:text-xl font-semibold text-[var(--text-100)]" itemProp="name">
                {project.title}
              </h3>
              <p className="mt-2 text-[var(--text-100)] opacity-75 flex-grow text-sm sm:text-base" itemProp="description">
                {project.description}
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 pt-4 text-[var(--accent-green)] font-medium hover:text-[var(--accent-green-base)] transition-colors duration-300 text-base sm:text-lg"
                aria-label={`View ${project.title} project - Opens in new tab`}
                itemProp="url"
              >
                View Project →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

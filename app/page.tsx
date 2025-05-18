"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  // References for GSAP animations
  const heroRef = useRef(null);
  const techGridRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Initialize animations
  useEffect(() => {
    // Hero section animations
    const heroElement = heroRef.current;
    if (heroElement) {
      gsap.fromTo(
        heroElement.querySelector('.hero-title'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        heroElement.querySelector('.hero-subtitle'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }

    // Tech grid animations
    const techItems = techGridRef.current?.querySelectorAll('.tech-item');
    if (techItems) {
      gsap.fromTo(
        techItems,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: techGridRef.current,
            start: "top 80%",
            end: "bottom 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Projects animations
    const projects = projectsRef.current?.querySelectorAll('.project-item');
    if (projects) {
      gsap.fromTo(
        projects,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-6 flex justify-between items-center">
        <div className="font-bold text-2xl">SHARP</div>
        <nav className="hidden md:block">
          <ul className="flex gap-8 font-medium text-sm uppercase">
            {['Work', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item} className="hover-link">
                <span>{item}</span>
                <span className="hover-text">{item}</span>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" className="hover-link text-[--accent-green] font-medium text-sm uppercase hidden md:block">
          <span>Let&apos;s Talk</span>
          <span className="hover-text">Let&apos;s Talk</span>
        </a>
        <button className="block md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen pt-40 md:pt-56 px-5 md:px-10 flex flex-col">
        <h1 className="hero-title heading-big text-6xl md:text-9xl mb-6 max-w-5xl">
          WE CRAFT 
          <span className="block">DIGITAL</span>
          <span className="block">EXPERIENCES</span>
        </h1>
        <p className="hero-subtitle text-lg md:text-2xl max-w-xl mt-2 opacity-80">
          A digital agency focused on creating memorable and effective online solutions for brands that want to stand out.
        </p>
        <div className="mt-24 hidden md:block opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      {/* Tech Grid Section */}
      <section ref={techGridRef} className="py-20 px-5 md:px-10">
        <div className="mb-16">
          <span className="text-sm opacity-60 uppercase">Our Expertise</span>
          <h2 className="heading-standard text-4xl md:text-6xl mt-2">TECHNOLOGIES WE USE</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5 border border-[--border-dark]">
          {[
            { name: "Next.js", color: "#fff" },
            { name: "React", color: "#61DAFB" },
            { name: "TypeScript", color: "#3178C6" },
            { name: "GSAP", color: "#88CE02" },
            { name: "TailwindCSS", color: "#38B2AC" },
            { name: "Node.js", color: "#68A063" },
          ].map((tech, index) => (
            <div 
              key={tech.name} 
              className="tech-item aspect-square border border-[--border-dark] flex items-center justify-center relative hover:bg-[--background-lighter] transition-colors duration-500"
            >
              <div className="absolute inset-0 z-0 bg-[--background-black]"></div>
              <div className="text-xl md:text-2xl font-medium z-10 text-center">
                {tech.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 px-5 md:px-10">
        <div className="mb-16">
          <span className="text-sm opacity-60 uppercase">Our Work</span>
          <h2 className="heading-standard text-4xl md:text-6xl mt-2">FEATURED PROJECTS</h2>
        </div>
        
        <div className="space-y-0.5">
          {[
            { id: '01', title: 'XYZ Financial App', description: 'Banking interface with enhanced UX' },
            { id: '02', title: 'Eco Store Redesign', description: 'E-commerce platform for sustainable products' },
            { id: '03', title: 'Travel Explorer', description: 'Interactive travel planning application' },
          ].map((project) => (
            <div key={project.id} className="project-item flex flex-col md:flex-row justify-between py-8 border-t border-[--border-dark] hover:bg-[--background-lighter] duration-500">
              <div className="flex items-start gap-4 md:gap-12">
                <span className="text-xl md:text-2xl font-medium opacity-60">{project.id}</span>
                <div>
                  <h3 className="text-xl md:text-3xl font-medium">{project.title}</h3>
                  <p className="mt-2 opacity-70">{project.description}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="flex items-center gap-2 hover:gap-4 transition-all duration-500">
                  <span>View Project</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 px-5 md:px-10 border-t border-[--border-dark]">
        <div className="mb-16">
          <span className="text-sm opacity-60 uppercase">Get in Touch</span>
          <h2 className="heading-standard text-4xl md:text-6xl mt-2">LET&apos;S COLLABORATE</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6">
              <div className="border-b border-[--border-dark] py-4">
                <label className="block text-sm opacity-70 mb-2">Your Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent focus:outline-none text-lg"
                  placeholder="John Doe"
                />
              </div>
              <div className="border-b border-[--border-dark] py-4">
                <label className="block text-sm opacity-70 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent focus:outline-none text-lg"
                  placeholder="john@example.com"
                />
              </div>
              <div className="border-b border-[--border-dark] py-4">
                <label className="block text-sm opacity-70 mb-2">Your Message</label>
                <textarea 
                  className="w-full bg-transparent focus:outline-none text-lg"
                  rows={4}
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <button className="bg-[--white-color] text-[--background-black] py-3 px-8 flex items-center gap-2 hover:gap-4 transition-all duration-500 mt-8">
                <span className="font-medium">SEND MESSAGE</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-0.5">
            {[
              { name: "Email", icon: "✉️", link: "mailto:hello@sharpireland.com" },
              { name: "LinkedIn", icon: "🔗", link: "#" },
              { name: "Instagram", icon: "📷", link: "#" },
              { name: "WhatsApp", icon: "📱", link: "#" },
            ].map((contact) => (
              <a 
                key={contact.name}
                href={contact.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="aspect-square border border-[--border-dark] flex flex-col items-center justify-center gap-4 hover:bg-[--white-color] hover:text-[--background-black] transition-colors duration-500"
              >
                <div className="text-3xl">{contact.icon}</div>
                <div className="font-medium">{contact.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--border-dark] py-8 px-5 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-bold text-xl">SHARP</div>
        <div className="opacity-70 text-sm">© {new Date().getFullYear()} Sharp Ireland. All rights reserved.</div>
        <div className="flex gap-6">
          {['Work', 'About', 'Services', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

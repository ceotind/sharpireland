"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Contact items
const contacts = [
  { name: "Email", icon: "✉️", link: "mailto:hello@sharpireland.com" },
  { name: "LinkedIn", icon: "🔗", link: "#" },
  { name: "Instagram", icon: "📷", link: "#" },
  { name: "WhatsApp", icon: "📱", link: "#" },
];

export default function ContactSection() {
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = contactRef.current;
    if (el) {
      gsap.from(el.querySelectorAll("label, input, textarea, button, .contact-item"), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  }, []);

  return (
    <section id="contact" ref={contactRef} className="bg-[--background] py-16 md:py-24 px-4">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <span className="text-sm uppercase text-[--accent-green] tracking-wide">Get in Touch</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[--foreground]">Let's Collaborate</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[--foreground]">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 w-full border-b border-[--border-medium] bg-transparent py-2 text-[--foreground] focus:border-[--accent-green] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--foreground]">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-1 w-full border-b border-[--border-medium] bg-transparent py-2 text-[--foreground] focus:border-[--accent-green] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--foreground]">Your Message</label>
              <textarea
                rows={4}
                placeholder="Tell us about your project..."
                className="mt-1 w-full border border-[--border-medium] bg-transparent p-3 text-[--foreground] focus:border-[--accent-green] focus:outline-none transition-colors rounded-md"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-4 bg-[--accent-green] text-[--white-color] px-6 py-3 rounded-md font-medium hover:bg-[--accent-green-base] transition-colors"
            >
              Send Message
            </button>
          </form>
          {/* Contact links */}
          <div className="grid grid-cols-2 gap-6">
            {contacts.map((c) => (
              <a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center space-x-4 p-4 bg-[--background-lighter] rounded-md text-[--foreground] hover:bg-[--background] transition-colors"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="font-medium">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

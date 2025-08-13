"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from "gsap";
import { RedditLogo, InstagramLogo, Globe } from "@phosphor-icons/react";
import { Industry } from '@/app/types/content'; // Import Industry type
import { slugToTitle } from '@/app/utils/text-utils'; // Import slugToTitle utility

interface FooterProps {
  randomIndustries: Industry[];
}

export default function Footer({ randomIndustries }: FooterProps) {
  const socialIconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const icons = socialIconsRef.current?.querySelectorAll(".social-icon-wrapper");
      if (!icons || icons.length === 0) return;

      icons.forEach(icon => {
        const bgCircle = icon.querySelector(".bg-circle");

        if (!bgCircle) return;

        gsap.set(bgCircle, { scale: 0, backgroundColor: "var(--accent-green)", borderRadius: "9999px" });
        gsap.set(icon, { color: "var(--text-100)" });

        const tl = gsap.timeline({ paused: true });

        tl.to(bgCircle, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        }).to(icon, {
            color: "var(--white-color)",
            duration: 0.3,
            ease: "power2.out"
        }, 0);

        const enterFn = () => tl.play();
        const leaveFn = () => tl.reverse();

        icon.addEventListener("mouseenter", enterFn);
        icon.addEventListener("mouseleave", leaveFn);

        return () => {
            icon.removeEventListener("mouseenter", enterFn);
            icon.removeEventListener("mouseleave", leaveFn);
            tl.kill();
        };
      });
    }
  }, []);

  const quickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Technologies', href: '#technologies' },
    { name: 'Projects', href: '#projects' },
    { name: 'Process', href: '#our-process' },
    { name: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    {
      name: 'Reddit',
      href: 'https://reddit.com/r/sharpdigital',
      icon: <RedditLogo size={24} />
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/sharpdigital',
      icon: <InstagramLogo size={24} />
    },
    {
      name: 'Website',
      href: 'https://sharpdigital.ie',
      icon: <Globe size={24} />
    }
  ];

  return (
    <footer className="relative bg-[var(--bg-400)] text-[var(--text-100)]">
      {/* Main Footer Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-100)]">Sharp Digital</h3>
              <p className="mb-6 max-w-md text-[var(--text-200)]">
                Premier web development agency delivering effective digital solutions.
                We craft custom web applications with cutting-edge technologies.
              </p>
              <div ref={socialIconsRef} className="flex space-x-2">
                 {socialLinks.map((social) => (
                   <a
                     key={social.name}
                     href={social.href}
                     className="social-icon-wrapper w-12 h-12 rounded-full flex items-center justify-center relative bg-transparent border border-[var(--bg-300)]"
                     aria-label={social.name}
                     target="_blank"
                     rel="noopener noreferrer"
                   >
                     <div className="bg-circle absolute inset-0"></div>
                     <div className="relative z-10">
                       {social.icon}
                     </div>
                   </a>
                 ))}
               </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--text-100)]">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:opacity-80 transition-opacity duration-300 text-[var(--text-200)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Web Development */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--text-100)]">Web Development</h4>
              <ul className="space-y-2">
                {randomIndustries.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      href={`/${industry.slug}`}
                      className="hover:opacity-80 transition-opacity duration-300 text-[var(--text-200)]"
                    >
                      {slugToTitle(industry.slug)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/industries"
                    className="hover:opacity-80 transition-opacity duration-300 text-[var(--accent-green)] font-medium"
                  >
                    More Industries &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-[var(--bg-300)] pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold mb-2 text-[var(--text-100)]">Email</h5>
                <a
                  href="mailto:dilshad@sharpdigital.in"
                  className="hover:opacity-80 transition-opacity text-[var(--text-200)]"
                >
                  dilshad@sharpdigital.in
                </a>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-[var(--text-100)]">Locations</h5>
                <p className="text-[var(--text-200)]">Ireland & India</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[var(--bg-300)] pt-6 text-center">
            <p className="text-sm text-[var(--text-300)]">
              © {new Date().getFullYear()} Sharp Digital. All rights reserved. |
              <span className="ml-1">Crafting digital experiences with precision.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

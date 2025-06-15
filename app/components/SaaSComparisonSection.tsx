"use client";

import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SaaSComparisonSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".animate-element");
    if (elements && sectionRef.current) {
      const animation = gsap.fromTo(
        elements,
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
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === sectionRef.current) {
            trigger.kill();
          }
        });
      };
    }
  }, []);
  return (
    <section id="saas-comparison" ref={sectionRef} className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div className="animate-element max-w-2xl mx-auto text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Development Efficiency</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Effective vs Fast Development
          </h2>
          <p className="mt-4 text-[var(--foreground)] font-inter font-medium text-base md:text-lg opacity-80">
            Sharp Digital delivers effective web development solutions that prioritize quality, scalability, and long-term success over rushed implementations.
          </p>
        </div>
        <div className="animate-element flex gap-8 items-center justify-center flex-col lg:flex-row">
          {/* Left Card - Fast Development */}
          <div className="relative max-w-[380px] w-full min-h-[400px] pb-8 pt-6 px-6 border rounded-2xl bg-[var(--background-lighter)] scale-1.0 hover:scale-[1.02] transition-all duration-300 border-[var(--text-200)]">
            <div>
              <div className="text-[var(--foreground)] text-xl font-semibold mb-4">
                Fast Development Approach
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Quick fixes without proper planning
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Limited scalability and flexibility
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Poor SEO optimization
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Security vulnerabilities
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  High maintenance costs
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Poor user experience
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[var(--text-200)] min-w-[67px] text-center font-semibold !leading-[1.21] text-sm bg-[var(--bg-300)] whitespace-nowrap px-[6px] py-1 rounded-[5px]">
                  ⚠️ Risk
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  Technical debt accumulation
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 uppercase left-1/2 transform -translate-x-1/2 translate-y-1/2 font-inter w-[250px] text-center font-bold text-base py-2 px-3 rounded-lg bg-[var(--bg-300)] text-[var(--text-200)]">
              = Short-term gains, long-term pain
            </div>
          </div>

            {/* VS Separator Images */}
            <img alt="vs" loading="lazy" width="134" height="350" className="h-[350px] hidden lg:block" style={{color:'transparent'}} src="/vs.svg" />
            <img alt="vs" loading="lazy" width="134" height="350" className="h-[170px] block lg:hidden mt-4" style={{color:'transparent'}} src="/vs.svg" />
          
          {/* Right Card - Sharp Digital Effective Development */}
          <div className="relative max-w-[380px] w-full min-h-[400px] pb-8 pt-6 px-6 border rounded-2xl bg-[var(--background-lighter)] scale-1.0 hover:scale-[1.02] transition-all duration-300 border-[var(--accent-green)]">
            <div>
              <div className="text-[var(--foreground)] text-xl font-semibold mb-4">
                Sharp Digital - Effective Development
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Strategic planning & architecture</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Scalable & maintainable code</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Advanced SEO optimization</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Enterprise-grade security</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Performance optimization</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Comprehensive testing & QA</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="var(--accent-green)" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Long-term support & maintenance</p>
              </div>
            </div>
            <div className="absolute bottom-0 uppercase left-1/2 transform -translate-x-1/2 translate-y-1/2 font-inter w-[250px] text-center font-bold text-base py-2 px-3 rounded-lg bg-[var(--accent-green)] text-[var(--white-color)]">
              = Sustainable Success
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaaSComparisonSection;

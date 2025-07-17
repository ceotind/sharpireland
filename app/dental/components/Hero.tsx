'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-element');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }

    // Floating animation for decorative elements
    gsap.to('.float-element', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Parallax effect for background
    gsap.to('.parallax-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center bg-gradient-to-br from-[var(--bg-100)] via-[var(--bg-50)] to-[var(--accent-green)]/5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="parallax-bg absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-green)]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-green)]/15 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--bg-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--bg-200)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="animate-element inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-xs sm:text-sm font-medium rounded-full border border-[var(--accent-green)]/20">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent-green)] rounded-full animate-pulse"></div>
              Premium Dental Marketing
            </div>

            {/* Main Heading */}
            <h1 className="animate-element text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--text-100)] mt-4 sm:mt-6 leading-tight">
              Transform Your
              <span className="text-[var(--accent-green)] block mt-1 sm:mt-2">Dental Practice</span>
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-200)] block mt-2 sm:mt-3">
                Into a Patient Magnet
              </span>
            </h1>

            {/* Description */}
            <p className="animate-element text-base sm:text-lg md:text-xl text-[var(--text-200)] mt-4 sm:mt-6 max-w-2xl leading-relaxed">
              We create stunning websites and marketing systems that attract high-value patients 
              and turn your practice into the go-to destination in your area.
            </p>

            {/* CTA Buttons */}
            <div className="animate-element flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
              <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-[var(--accent-green)] text-[var(--white-color)] font-semibold rounded-xl hover:bg-[var(--accent-green-base)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                <span className="relative z-10">Book Free Strategy Call</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse"></div>
              </button>
              <button className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-[var(--accent-green)] text-[var(--accent-green)] font-semibold rounded-xl hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] transition-all duration-300 text-sm sm:text-base">
                View Case Studies
              </button>
            </div>

            {/* Stats */}
            <div className="animate-element grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12 max-w-sm mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--accent-green)]">2,500+</div>
                <div className="text-xs sm:text-sm text-[var(--text-200)] mt-1">Practices</div>
              </div>
              <div className="text-center border-x border-[var(--bg-300)]">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--accent-green)]">20+</div>
                <div className="text-xs sm:text-sm text-[var(--text-200)] mt-1">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--accent-green)]">3M+</div>
                <div className="text-xs sm:text-sm text-[var(--text-200)] mt-1">Patients</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="animate-element flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 sm:-space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-300)] border border-[var(--bg-100)]"></div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-[var(--text-200)]">Trusted by 2,500+ dentists</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative mt-8 lg:mt-0">
            {/* Main Image Container */}
            <div className="animate-element relative w-full">
              <div className="relative w-full aspect-[4/5] max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/webdev/dentalclinic.webp"
                  alt="Modern dental clinic interior"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 25%' }}
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 448px, 512px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Floating Cards - Hidden on small screens */}
              <div className="hidden sm:block float-element absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-[var(--bg-100)]/90 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-[var(--bg-200)]">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-[var(--accent-green)] rounded"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-100)]">150% ROI</div>
                    <div className="text-xs text-[var(--text-200)]">Average increase</div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block float-element absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-[var(--bg-100)]/90 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-[var(--bg-200)]">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-[var(--accent-green)] rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-100)]">500+</div>
                    <div className="text-xs text-[var(--text-200)]">New patients/month</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[var(--accent-green)]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 bg-[var(--accent-green)]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Mobile Stats Card */}
            <div className="lg:hidden mt-6 sm:mt-8 bg-[var(--bg-100)]/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 shadow-xl border border-[var(--bg-200)]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--accent-green)]">150%</div>
                  <div className="text-xs sm:text-sm text-[var(--text-200)]">ROI Increase</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--accent-green)]">500+</div>
                  <div className="text-xs sm:text-sm text-[var(--text-200)]">New Patients/Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
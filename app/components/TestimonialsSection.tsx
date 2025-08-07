"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "Sharp Ireland transformed our digital presence completely. Their attention to detail and innovative approach exceeded our expectations.",
    avatar: "SJ"
  },
  {
    id: "2",
    name: "Michael O'Connor",
    role: "CEO",
    company: "StartupXYZ",
    content: "Working with Sharp Ireland was a game-changer for our business. They delivered a stunning website that perfectly captures our brand.",
    avatar: "MO"
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "Product Manager",
    company: "InnovateLabs",
    content: "The team at Sharp Ireland is incredibly talented. They took our vision and made it a reality with exceptional craftsmanship.",
    avatar: "EW"
  },
  {
    id: "4",
    name: "David Murphy",
    role: "Founder",
    company: "GreenTech Solutions",
    content: "Outstanding work! Sharp Ireland delivered on time, on budget, and beyond our expectations. Highly recommended.",
    avatar: "DM"
  }
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const testimonialSwipeRef = useRef<HTMLDivElement>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    if (!section) return;

    // Standardized animation for section entrance
    const animation = gsap.fromTo(section,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        }
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Swipe handlers for mobile
  useEffect(() => {
    const el = testimonialSwipeRef.current;
    if (!el) return;
    let startX: number = 0;
    let endX: number = 0;
    let isTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isTouching = true;
      startX = e.touches[0]?.clientX ?? 0;
      endX = startX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length === 0) return;
      endX = e.touches[0]?.clientX ?? startX;
    };
    const onTouchEnd = () => {
      if (!isTouching) return;
      const diff = endX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          // Swipe left: next
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        } else {
          // Swipe right: prev
          setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        }
      }
      isTouching = false;
      startX = 0;
      endX = 0;
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [testimonials.length]);

  const nextTestimonial = () => {
    // Directly update to next testimonial without any animation
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    if (index === currentTestimonial) return;
    
    // Directly update to selected testimonial without any animation
    setCurrentTestimonial(index);
  };

  // Helper to render char/word spans for text animation (structure only for now)
  // const AnimatedText = ({ text, isMobile }: { text: string, isMobile?: boolean }) => {
  //   const words = text.split(" ");
  //   return (
  //     <>
  //       {words.map((word, i) => (
  //         <span key={i} className={`word-container ${isMobile && i > 1 ? 'block' : 'inline-block'}`}>
  //           <span className="word inline-block">
  //             {word.split("").map((char, j) => (
  //               <span key={j} className="char inline-block">{char}</span>
  //             ))}
  //           </span>
  //           {i < words.length - 1 && ' '}
  //         </span>
  //       ))}
  //     </>
  //   );
  // };
  
  // const AnimatedTextMobile = ({ line1, line2 }: { line1: string, line2: string }) => {
  //   return (
  //     <>
  //       <span className="overflow-hidden inline-block relative">
  //          <AnimatedText text={line1} isMobile />
  //       </span>
  //       <span className="overflow-hidden inline-block relative">
  //          <AnimatedText text={line2} isMobile />
  //          <span className="w-[7vw] inline-block md:hidden"></span>
  //       </span>
  //     </>
  //   )
  // }

  return (
    <section 
      ref={sectionRef}
      className="bg-[var(--bg-100)] text-[var(--text-100)] py-12 md:py-32 px-2 sm:px-4"
      id="testimonials"
    >
      <div id="testimonials-div-1" className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col gap-8 md:gap-12">
        {/* Heading Section */}
        <div id="testimonials-div-2" className="text-center">
          <span className="text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Testimonials</span>
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]">
            What Our Clients Say
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80">
            Don&apos;t just take our word for it - hear from our satisfied clients about their experience working with us.
          </p>
        </div>

        {/* Testimonial Section */}
        <div id="testimonials-div-3" className="mt-6 sm:mt-8 md:mt-12 max-w-4xl mx-auto">
          <div id="testimonials-div-4" className="bg-[var(--bg-200)] p-5 sm:p-8 md:p-12 rounded-2xl border border-[var(--bg-300)]">
            {/* Mobile layout */}
            <div id="testimonials-div-5" ref={testimonialSwipeRef} className="flex flex-col items-center gap-6 sm:hidden touch-pan-x select-none">
              <div id="testimonials-div-6" className="flex flex-col items-center w-full">
                <div id="testimonials-div-7" className="w-16 h-16 bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] rounded-full flex items-center justify-center text-[var(--white-color)] font-semibold text-xl mb-3">
                  {testimonials[currentTestimonial]?.avatar}
                </div>
                <h3 className="font-semibold text-[var(--text-100)] text-lg text-center">
                  {testimonials[currentTestimonial]?.name}
                </h3>
                <p className="text-[var(--text-100)] opacity-75 text-sm text-center mb-2">
                  {testimonials[currentTestimonial]?.role}, {testimonials[currentTestimonial]?.company}
                </p>
                <blockquote className="text-base font-light text-[var(--text-100)] leading-relaxed text-center mt-2 mb-4 px-2">
                  &ldquo;{testimonials[currentTestimonial]?.content}&rdquo;
                </blockquote>
              </div>
            </div>
            {/* Tablet/Desktop layout */}
            <div id="testimonials-div-8" className="hidden sm:flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-0">
              {/* Single Testimonial Display */}
              <div
                id="testimonials-div-9"
                ref={testimonialRef}
                className="flex-1 md:pr-8 overflow-hidden"
              >
                <blockquote className="text-xl md:text-2xl font-light text-[var(--text-100)] leading-relaxed mb-6 sm:mb-8">
                  &ldquo;{testimonials[currentTestimonial]?.content}&rdquo;
                </blockquote>
                <div id="testimonials-div-10" className="flex items-center space-x-4">
                  <div id="testimonials-div-11" className="w-12 h-12 bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] rounded-full flex items-center justify-center text-[var(--white-color)] font-semibold text-sm">
                    {testimonials[currentTestimonial]?.avatar}
                  </div>
                  <div id="testimonials-div-12">
                    <h3 className="font-semibold text-[var(--text-100)] text-lg">
                      {testimonials[currentTestimonial]?.name}
                    </h3>
                    <p className="text-[var(--text-100)] opacity-75 text-sm">
                      {testimonials[currentTestimonial]?.role}, {testimonials[currentTestimonial]?.company}
                    </p>
                  </div>
                </div>
              </div>
              {/* Next Button */}
              <button
                onClick={nextTestimonial}
                className="flex-shrink-0 w-16 h-16 border border-[var(--bg-300)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] hover:border-[var(--accent-green)] transition-all duration-300 group mt-6 md:mt-0"
                aria-label="Next testimonial"
              >
                <svg 
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Testimonial Indicators */}
            <div id="testimonials-div-13" className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-300)] hover:bg-[var(--accent-green)] hover:opacity-60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

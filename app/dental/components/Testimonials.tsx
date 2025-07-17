'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
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
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }, []);

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      practice: 'Bright Smile Dental, London',
      text: 'Our new website increased high-value patient inquiries by 300% within 90 days. The booking system alone saves us 15 hours per week.'
    },
    {
      name: 'Dr. Michael Chen',
      practice: 'Premier Dental Care, Berlin',
      text: 'Finally, a web team that understands dentistry. Our implant cases doubled, and we\'re now #1 for "dental implants Berlin".'
    },
    {
      name: 'Dr. Emma Rodriguez',
      practice: 'Smile Studio, Madrid',
      text: 'The ROI has been incredible. Our website went from a cost center to our most profitable marketing channel.'
    }
  ];

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 md:py-32 bg-[var(--bg-100)]">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-3xl md:text-4xl font-medium text-[var(--text-100)]">
            What our clients say
          </h2>
          <p className="animate-element mt-4 text-[var(--text-200)]">
            Real results from dental practices across Europe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="animate-element">
              <blockquote className="text-lg text-[var(--text-200)] leading-relaxed mb-6">
                "{testimonial.text}"
              </blockquote>
              <div>
                <div className="font-medium text-[var(--text-100)]">{testimonial.name}</div>
                <div className="text-sm text-[var(--text-300)]">{testimonial.practice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
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

  const services = [
    {
      name: 'Foundation',
      price: '€4,999',
      description: 'Professional digital presence that builds immediate trust and credibility.',
      features: [
        'Bespoke mobile-first design',
        'Core SEO & local search setup',
        'Expertly written content',
        'GDPR/GDC compliance audit',
        'Lightning-fast hosting',
        '3 months support'
      ]
    },
    {
      name: 'Growth Engine',
      price: '€8,999',
      description: 'Accelerate patient acquisition and dominate your local market.',
      features: [
        'Everything in Foundation',
        'Advanced local SEO dominance',
        '24/7 online booking system',
        'Automated review generation',
        'Dedicated service pages',
        'Monthly SEO optimization',
        '6 months support'
      ]
    },
    {
      name: 'Enterprise Suite',
      price: '€15,999',
      description: 'Sophisticated integration for dental groups and market leaders.',
      features: [
        'Everything in Growth Engine',
        'Multi-location architecture',
        'Custom PMS/CRM integration',
        'Advanced conversion optimization',
        'ROI dashboard & analytics',
        'Dedicated account manager',
        '12 months support'
      ]
    }
  ];

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32 bg-[var(--bg-200)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            Services
          </h2>
          <p className="animate-element mt-4 max-w-3xl mx-auto text-[var(--text-200)] text-base md:text-lg">
            Choose the package that matches your practice goals and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="animate-element bg-[var(--bg-100)] p-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--text-100)] mb-2">{service.name}</h3>
                <div className="text-3xl font-bold text-[var(--text-100)] mb-4">{service.price}</div>
                <p className="text-[var(--text-200)] text-sm">{service.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[var(--text-200)] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 px-6 bg-[var(--accent-green)] text-white font-medium">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
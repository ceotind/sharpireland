'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import content from '../content.json';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const cardCount = content.services.items.length;
  const cardWidth = typeof window !== 'undefined' ? 0.9 * window.innerWidth : 0;

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

  // Framer Motion drag logic for snapping
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth / 4;
    let newIndex = current;
    if (info.offset.x < -threshold && current < cardCount - 1) {
      newIndex = current + 1;
    } else if (info.offset.x > threshold && current > 0) {
      newIndex = current - 1;
    }
    setCurrent(newIndex);
    controls.start({ x: -newIndex * cardWidth });
  };

  useEffect(() => {
    controls.start({ x: -current * cardWidth });
  }, [current, controls, cardWidth]);

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32">
      {/* Visually hidden heading for accessibility and ARIA */}
      <h2 id="template-services-heading" className="sr-only">Website Services</h2>
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-4xl md:text-5xl font-bold text-[var(--text-100)]">
            {content.services.heading}
          </h2>
          <p className="animate-element mt-4 max-w-3xl mx-auto text-[var(--text-200)] text-base md:text-lg">
            {content.services.subheading}
          </p>
        </div>

        {/* Mobile slider with gesture */}
        <div className="block lg:hidden relative overflow-x-hidden">
          <motion.div
            className="flex gap-4"
            drag="x"
            dragConstraints={{ left: -cardWidth * (cardCount - 1), right: 0 }}
            style={{ x }}
            animate={controls}
            onDragEnd={handleDragEnd}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {content.services.items.map((service, index) => (
              <motion.div
                key={index}
                className={`min-w-[90vw] max-w-[90vw] animate-element bg-[var(--bg-100)] p-8 rounded-2xl shadow-md border border-[var(--bg-200)] flex flex-col mx-auto`}
              >
                <div className="mb-6 flex flex-col items-center">
                  <div className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold ${index === 1 ? 'bg-[var(--accent-green)] text-white' : 'bg-[var(--bg-200)] text-[var(--accent-green)]'}`}>{service.badge}</div>
                  <h3 className="text-2xl font-bold text-[var(--text-100)] mb-1">{service.name}</h3>
                </div>
                <p className="text-[var(--text-200)] text-sm mb-6 text-center">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[var(--text-200)] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.services.items.map((service, index) => (
            <div
              key={index}
              className={`animate-element bg-[var(--bg-100)] p-8 rounded-2xl shadow-md border border-[var(--bg-200)] flex flex-col ${index === 1 ? 'ring-2 ring-[var(--accent-green)] scale-105 z-10' : ''}`}
            >
              <div className="mb-6 flex flex-col items-center">
                <div className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold ${index === 1 ? 'bg-[var(--accent-green)] text-white' : 'bg-[var(--bg-200)] text-[var(--accent-green)]'}`}>{service.badge}</div>
                <h3 className="text-2xl font-bold text-[var(--text-100)] mb-1">{service.name}</h3>
              </div>
              <p className="text-[var(--text-200)] text-sm mb-6 text-center">{service.description}</p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[var(--text-200)] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
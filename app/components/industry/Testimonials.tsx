'use client';

import { useRef, useState, useEffect } from 'react';
import { Quotes } from 'phosphor-react';
import { motion, useAnimation, useMotionValue, PanInfo } from 'framer-motion';
import { useContentSection } from '../../context/ContentContext';

export default function Testimonials() {
  const testimonials = useContentSection('testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // Snap to current on change (in useEffect) - must be called before conditional return
  const cardWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  useEffect(() => {
    if (cardWidth && testimonials) controls.start({ x: -current * cardWidth });
  }, [current, cardWidth, controls, testimonials]);
  
  if (!testimonials) {
    return null; // Don't render if testimonials content is not available
  }









  // Framer Motion drag logic for snapping
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    const threshold = width / 4;
    let newIndex = current;
    // testimonials is guaranteed to be defined here because the null check is after this
    if (info.offset.x < -threshold && current < testimonials!.items.length - 1) {
      newIndex = current + 1;
    } else if (info.offset.x > threshold && current > 0) {
      newIndex = current - 1;
    }
    setCurrent(newIndex);
    controls.start({ x: -newIndex * width });
  };


  return (
    <section ref={sectionRef} id="testimonials" className="py-20 md:py-32">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-100)]">
            {testimonials.heading}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base">
            {testimonials.subheading}
          </p>
        </div>
        {/* Mobile carousel */}
        <div className="block md:hidden relative overflow-x-hidden">
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: -cardWidth * (testimonials.items.length - 1), right: 0 }}
            style={{ x }}
            animate={controls}
            onDragEnd={handleDragEnd}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {testimonials.items.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="min-w-full flex flex-col items-center justify-center px-4 py-12"
              >
                <Quotes size={40} weight="duotone" className="text-[var(--accent-green)] mb-6" />
                <blockquote className="text-lg text-[var(--text-200)] leading-relaxed mb-6 text-center">
                  "{testimonial.text}"
                </blockquote>
                <div className="text-center">
                  <div className="font-medium text-[var(--text-100)]">{testimonial.name}</div>
                  <div className="text-sm text-[var(--text-300)]">{testimonial.practice}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* Slide indicator dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${current === idx ? 'bg-[var(--accent-green)] scale-125' : 'bg-[var(--bg-200)]'}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.items.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 0.7, delay: index * 0.13 }}
              className="flex flex-col items-center bg-[var(--bg-100)]/90 rounded-2xl shadow-md p-8"
            >
              <Quotes size={40} weight="duotone" className="text-[var(--accent-green)] mb-6" />
              <blockquote className="text-lg text-[var(--text-200)] leading-relaxed mb-6 text-center">
                "{testimonial.text}"
              </blockquote>
              <div className="text-center">
                <div className="font-medium text-[var(--text-100)]">{testimonial.name}</div>
                <div className="text-sm text-[var(--text-300)]">{testimonial.practice}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
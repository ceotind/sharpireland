'use client';

import { useRef, useState } from 'react';
import { CaretDown } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import content from '../content.json';

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} id="faq" className="py-16 md:py-24">
      <div className="w-full max-w-screen-md mx-auto px-4 lg:px-0">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-100)]">{content.faq.heading}</h2>
          <p className="mt-3 max-w-2xl mx-auto text-[var(--text-200)] text-base">
            {content.faq.subheading}
          </p>
        </div>
        <div className="flex flex-col divide-y divide-[var(--text-300)/20]">
          {content.faq.items.map((faq, index) => (
            <div key={index}>
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left py-4 cursor-pointer hover:bg-[var(--bg-200)] transition-colors"
                role="button"
                tabIndex={0}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenIndex(openIndex === index ? null : index);
                  }
                }}
              >
                <span className="text-base md:text-lg font-medium text-[var(--text-100)]">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 text-[var(--text-200)]"
                >
                  <CaretDown size={20} weight="regular" />
                </motion.span>
              </div>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pl-0 pr-2 pb-4">
                      <p className="text-[var(--text-200)] text-base leading-relaxed mt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
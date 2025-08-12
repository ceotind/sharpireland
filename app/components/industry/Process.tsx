'use client';

import { useRef } from 'react';
import { Phone, NotePencil, Monitor, RocketLaunch } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useContentSection } from '../../context/ContentContext';

const IconMap = {
  Phone: Phone,
  NotePencil: NotePencil,
  Monitor: Monitor,
  RocketLaunch: RocketLaunch
};

export default function Process() {
  const process = useContentSection('process');
  const sectionRef = useRef<HTMLElement>(null);

  if (!process) {
    return null; // Don't render if process content is not available
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 18,
        mass: 0.7
      }
    }
  };

  return (
    <section ref={sectionRef} id="process" className="py-20 md:py-32">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-100)]">
            {process.heading}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-200)] text-base">
            {process.subheading}
          </p>
        </div>
        <motion.div
          className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row w-full z-10 gap-10 lg:gap-6">
            {process.steps.map((step, idx) => {
              const Icon = IconMap[step.icon as keyof typeof IconMap] || Phone;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="flex flex-col items-center text-center bg-[var(--bg-100)]/90 rounded-2xl shadow-md px-6 py-10 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg lg:w-1/4"
                  style={{zIndex: 2}}
                >
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-green)] text-white text-xs font-bold shadow">
                      Step {idx + 1}
                    </span>
                  </div>
                  {/* Icon in colored circle */}
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-green)] flex items-center justify-center mb-6 mt-4 shadow-md">
                    <Icon size={36} weight="duotone" className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2 mt-2">{step.title}</h3>
                  <p className="text-[var(--text-200)] text-sm leading-relaxed font-light max-w-xs mx-auto">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
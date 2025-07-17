'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const faqs = [
    {
      question: 'How long does it take to build a dental website?',
      answer: 'Typically 4-6 weeks from strategy session to launch. This includes design, development, content creation, and testing. Complex integrations may extend this timeline.'
    },
    {
      question: 'Do you work with practices outside Europe?',
      answer: 'We specialize exclusively in European dental practices to ensure deep understanding of GDPR, GDC, and other regional compliance requirements.'
    },
    {
      question: 'What ROI can I expect?',
      answer: 'Most clients see 180-300% increase in online bookings within 90 days. Our average client recovers their investment within 3-6 months through increased high-value patient acquisition.'
    },
    {
      question: 'Do you offer ongoing support?',
      answer: 'Yes, all packages include ongoing support. We also offer monthly optimization packages to ensure your website continues to perform and adapt to market changes.'
    },
    {
      question: 'Can you integrate with my existing PMS?',
      answer: 'We integrate with most major dental practice management systems including Dentally, Software of Excellence, and others. Custom integrations are available for specialized systems.'
    },
    {
      question: 'What happens after the website launches?',
      answer: 'We provide comprehensive training for your team, ongoing performance monitoring, and continuous optimization. You\'ll have a dedicated account manager for support.'
    }
  ];

  return (
    <section ref={sectionRef} id="faq" className="py-20 md:py-32 bg-[var(--bg-200)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-element text-3xl md:text-4xl font-bold text-[var(--text-100)]">
            Frequently Asked Questions
          </h2>
          <p className="animate-element mt-4 max-w-2xl mx-auto text-[var(--text-200)]">
            Everything you need to know about transforming your practice's digital presence.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="animate-element border-b border-[var(--bg-300)]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <h3 className="text-lg font-medium text-[var(--text-100)] pr-8">
                  {faq.question}
                </h3>
                <span className="text-2xl text-[var(--text-200)] flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-[var(--text-200)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import React, { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSliceProps {
  id: string;
  faqs: FAQItem[];
}

export default function FAQSlice({ id, faqs }: FAQSliceProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id={id} className="w-full">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          id={faq.id}
          className="border-b border-[var(--bg-300)] py-4"
        >
          <button
            id={`${faq.id}-question-button`}
            className="flex justify-between items-center w-full text-left text-lg font-semibold text-[var(--text-100)] font-inter"
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
            aria-controls={`${faq.id}-answer`}
          >
            {faq.question}
            <span id={`${faq.id}-toggle-icon`} className="text-xl">
              {openIndex === index ? "-" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div
              id={`${faq.id}-answer`}
              role="region"
              aria-labelledby={`${faq.id}-question-button`}
              className="mt-2 text-[var(--text-200)] font-inter"
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
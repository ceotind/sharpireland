"use client";

import { Suspense } from 'react';
import ContactSection from './ContactSection';

// Loading component for the contact section
function ContactSectionLoading() {
  return (
    <section id="contact" className="bg-[var(--background)] py-20 md:py-32" aria-labelledby="contact-heading">
      <div className="w-full max-w-screen-md mx-auto px-4 lg:px-8 flex flex-col gap-10">
        <header className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Contact Sharp Digital Ireland</span>
          <h2 id="contact-heading" className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">Get Your Web Development Quote</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Ready to transform your business with expert web development? Contact Sharp Digital Ireland today for a free consultation.
          </p>
        </header>
        
        <div className="space-y-6 bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] shadow-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-[var(--border-medium)] rounded w-1/4 mb-2"></div>
            <div className="h-12 bg-[var(--border-medium)] rounded mb-4"></div>
            
            <div className="h-4 bg-[var(--border-medium)] rounded w-1/3 mb-2"></div>
            <div className="h-12 bg-[var(--border-medium)] rounded mb-4"></div>
            
            <div className="h-4 bg-[var(--border-medium)] rounded w-1/4 mb-2"></div>
            <div className="h-12 bg-[var(--border-medium)] rounded mb-4"></div>
            
            <div className="h-4 bg-[var(--border-medium)] rounded w-1/2 mb-2"></div>
            <div className="h-24 bg-[var(--border-medium)] rounded mb-6"></div>
            
            <div className="h-12 bg-[var(--accent-green)] rounded opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactSectionWrapper() {
  return (
    <Suspense fallback={<ContactSectionLoading />}>
      <ContactSection />
    </Suspense>
  );
}
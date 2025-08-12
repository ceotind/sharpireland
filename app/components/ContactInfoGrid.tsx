"use client";

import { EnvelopeSimple, Phone, MapPin, Globe } from '@phosphor-icons/react';

export default function ContactInfoGrid() {
  return (
    <section className="py-16 px-4 bg-[var(--bg-200)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Email */}
        <div className="bg-[var(--bg-100)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-[var(--accent-green)] mb-4">
            <EnvelopeSimple size={32} weight="duotone" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2">Email Us</h3>
          <p className="text-[var(--text-200)] mb-4">Drop us a line anytime</p>
          <a 
            href="mailto:dilshad@sharpdigital.in"
            className="text-[var(--accent-green)] hover:underline"
          >
            dilshad@sharpdigital.in
          </a>
        </div>

        {/* Phone */}
        <div className="bg-[var(--bg-100)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-[var(--accent-green)] mb-4">
            <Phone size={32} weight="duotone" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2">Call Us</h3>
          <p className="text-[var(--text-200)] mb-4">Mon-Fri from 9am to 6pm</p>
          <a 
            href="tel:+353871234567"
            className="text-[var(--accent-green)] hover:underline"
          >
            +353 87 123 4567
          </a>
        </div>

        {/* Location */}
        <div className="bg-[var(--bg-100)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-[var(--accent-green)] mb-4">
            <MapPin size={32} weight="duotone" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2">Visit Us</h3>
          <p className="text-[var(--text-200)] mb-4">Our Locations</p>
          <p className="text-[var(--text-100)]">Ireland & India</p>
        </div>

        {/* Website */}
        <div className="bg-[var(--bg-100)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-[var(--accent-green)] mb-4">
            <Globe size={32} weight="duotone" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-100)] mb-2">Follow Us</h3>
          <p className="text-[var(--text-200)] mb-4">Stay connected</p>
          <a 
            href="https://sharpdigital.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-green)] hover:underline"
          >
            sharpdigital.ie
          </a>
        </div>
      </div>
    </section>
  );
} 
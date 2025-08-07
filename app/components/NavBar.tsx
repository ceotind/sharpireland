"use client";

import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[var(--text-100)]">Sharp Digital</Link>
        <div className="flex items-center">
          <Link href="/contact" className="px-4 py-2 rounded-md bg-[var(--primary-100)] text-sm font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        {/* Left Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
            Services
          </Link>
        </nav>

        {/* Centered Logo/Brand */}
        <Link href="/" className="text-2xl font-bold text-[var(--text-100)] font-heading absolute left-1/2 transform -translate-x-1/2">
          Sharp Digital
        </Link>

        {/* Right Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link href="/industries" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
            Industries
          </Link>
          <Link href="/contact" className="px-4 py-2 rounded-md bg-[var(--primary-100)] text-sm font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white">
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

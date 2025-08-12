"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          {/* Left Navigation Links */}
          <nav id="desktop-nav-left" className="flex items-center space-x-6">
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
          <nav id="desktop-nav-right" className="flex items-center space-x-6">
            <Link href="/industries" className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors">
              Industries
            </Link>
            <Link href="/contact" className="px-4 py-2 rounded-md bg-[var(--primary-100)] text-sm font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          {/* Mobile Logo */}
          <Link href="/" className="text-xl font-bold text-[var(--text-100)] font-heading" onClick={closeMobileMenu}>
            Sharp Digital
          </Link>

          {/* Hamburger Menu Button */}
          <button
            id="mobile-menu-button"
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-[var(--text-100)] hover:text-[var(--primary-100)] hover:bg-[var(--bg-200)] transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu-overlay"
            className="md:hidden absolute top-full left-0 w-full bg-[var(--bg-100)] bg-opacity-95 backdrop-blur-md border-b border-[var(--bg-300)] shadow-lg"
          >
            <nav id="mobile-nav-menu" className="flex flex-col py-4 px-4 space-y-4">
              <Link
                href="/"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link
                href="/industries"
                className="text-base font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors py-2 px-2 rounded-md hover:bg-[var(--bg-200)]"
                onClick={closeMobileMenu}
              >
                Industries
              </Link>
              <Link
                href="/contact"
                className="mt-2 px-4 py-3 rounded-md bg-[var(--primary-100)] text-base font-medium hover:bg-[var(--primary-200)] transition-colors contact-button-text-white text-center"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[var(--text-100)]">SHARP</div>
        <nav className="hidden md:flex space-x-8">
          {['Work', 'About', 'Services', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-[var(--text-100)] hover:text-[var(--primary-100)] transition-colors"
            >
                {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--bg-200)] hover:bg-[var(--bg-300)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-100)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a6 6 0 000 12 6 6 0 000-12z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-100)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.66 6.34l-1.41-1.41M6.34 6.34L4.93 4.93m12.73 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
            )}
          </button>
          <button className="md:hidden p-2 rounded-md bg-[var(--bg-200)] hover:bg-[var(--bg-300)] transition-colors" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--text-100)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

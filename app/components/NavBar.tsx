"use client";

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-[var(--bg-100)] bg-opacity-90 backdrop-blur-md z-50 border-b border-[var(--bg-300)]">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[var(--text-100)]">Sharp Digital</div>
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
            className="relative w-10 h-10 rounded-full bg-[var(--bg-200)] hover:bg-[var(--bg-300)] transition-colors flex items-center justify-center"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <div className="relative w-5 h-5">
              <div className={`absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-100)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
            </div>
          </button>
          <button className="md:hidden p-2 rounded-md bg-[var(--bg-200)] hover:bg-[var(--bg-300)] transition-colors" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--text-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

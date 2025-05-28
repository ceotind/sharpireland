"use client";

import Link from 'next/link';

export default function Footer() {
  const links = ['Work', 'About', 'Services', 'Contact'];

  return (
    <footer className="bg-[var(--bg-100)] border-t border-[var(--bg-300)] py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="text-xl font-bold text-[var(--text-100)]">SHARP</div>
        <div className="text-sm text-[var(--text-200)]">
          © {new Date().getFullYear()} Sharp Ireland. All rights reserved.
        </div>
        <nav>
          <ul className="flex space-x-6">
            {links.map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-[var(--text-200)] hover:text-[var(--primary-100)] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

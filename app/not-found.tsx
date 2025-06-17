import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Sharp Digital Ireland',
  description: 'The page you are looking for could not be found. Return to Sharp Digital Ireland homepage.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-[var(--accent-green)] opacity-20 select-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-100)] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-[var(--text-200)] mb-6">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--accent-green)] text-white font-medium rounded-lg hover:bg-[var(--accent-green-hover)] transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--bg-300)] text-[var(--text-100)] font-medium rounded-lg hover:bg-[var(--bg-400)] transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-[var(--bg-300)] pt-8">
          <p className="text-sm text-[var(--text-300)] mb-4">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/#services" 
              className="text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors"
            >
              Our Services
            </Link>
            <Link 
              href="/#projects" 
              className="text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors"
            >
              Portfolio
            </Link>
            <Link 
              href="/#contact" 
              className="text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 p-4 bg-[var(--bg-200)] rounded-lg">
          <p className="text-sm text-[var(--text-200)]">
            Need help? Contact us at{' '}
            <a 
              href="mailto:hello@sharpdigital.in" 
              className="text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors"
            >
              hello@sharpdigital.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
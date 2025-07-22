import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-100)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--text-100)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--text-200)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-[var(--accent-green)] text-white rounded-lg hover:bg-[var(--accent-green-hover)] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
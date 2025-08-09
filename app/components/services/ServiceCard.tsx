import Link from 'next/link';

interface ServiceCardProps {
  title?: string;
  description?: string;
  slug?: string;
}

export default function ServiceCard({ title, description, slug }: ServiceCardProps) {
  const CardContent = () => (
    <div className="bg-[var(--bg-100)] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full border border-[var(--bg-300)]">
      <h2 className="text-xl font-bold mb-2 text-[var(--text-100)]">{title || 'Untitled Service'}</h2>
      <p className="text-[var(--text-200)]">{description || 'No description available'}</p>
    </div>
  );

  return slug ? (
    <Link href={`/home-services/${slug}`}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
}
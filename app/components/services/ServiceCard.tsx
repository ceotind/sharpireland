import Link from 'next/link';

interface ServiceCardProps {
  title?: string;
  description?: string;
  slug?: string;
}

export default function ServiceCard({ title, description, slug }: ServiceCardProps) {
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
      <h2 className="text-xl font-bold mb-2">{title || 'Untitled Service'}</h2>
      <p className="text-gray-600">{description || 'No description available'}</p>
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
'use client';

import { useState, useEffect } from 'react';
import ServiceCard from '@/app/components/services/ServiceCard';
import { getAllIndustries } from '@/app/utils/content-loader';
import { Industry } from '@/app/types/content';

export default function ServicesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllIndustries();
        setIndustries(data);
      } catch (error) {
        console.error('Failed to load industries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredIndustries = industries.filter(industry => {
    const title = industry.hero?.title?.toLowerCase() || '';
    const description = industry.hero?.description?.toLowerCase() || '';
    return (
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Web Development Services</h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search services..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredIndustries.length === 0 ? (
        <p className="text-center text-gray-500">No services found matching your search</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map(industry => (
            <ServiceCard 
              key={industry.slug}
              title={industry.hero.title}
              description={industry.hero.description}
              slug={industry.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
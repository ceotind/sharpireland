'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  is_external: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  usage_count: number;
  rating: number;
  features: string[];
  created_at: string;
}

interface ToolsSectionProps {
  userId: string;
  searchQuery: string;
}

export default function ToolsSection({ userId, searchQuery }: ToolsSectionProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock tools data - in a real app, this would come from an API
  const mockTools: Tool[] = [
    {
      id: '1',
      name: 'SEO Analyzer',
      description: 'Comprehensive SEO analysis tool to optimize your website performance and search rankings.',
      category: 'SEO & Marketing',
      icon: '🔍',
      url: '/tools/seo-analyzer',
      is_external: false,
      difficulty: 'beginner',
      tags: ['seo', 'analysis', 'optimization'],
      usage_count: 3420,
      rating: 4.8,
      features: ['Keyword Analysis', 'Page Speed Check', 'Meta Tag Optimization', 'Competitor Analysis'],
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Color Palette Generator',
      description: 'Generate beautiful color palettes for your projects with AI-powered suggestions.',
      category: 'Design',
      icon: '🎨',
      url: '/tools/color-generator',
      is_external: false,
      difficulty: 'beginner',
      tags: ['design', 'colors', 'palette'],
      usage_count: 2156,
      rating: 4.6,
      features: ['AI Color Suggestions', 'Accessibility Check', 'Export Options', 'Brand Colors'],
      created_at: '2024-01-12'
    },
    {
      id: '3',
      name: 'API Testing Suite',
      description: 'Advanced API testing and monitoring tool with automated test generation.',
      category: 'Development',
      icon: '⚡',
      url: '/tools/api-tester',
      is_external: false,
      difficulty: 'advanced',
      tags: ['api', 'testing', 'development'],
      usage_count: 1834,
      rating: 4.9,
      features: ['Automated Testing', 'Performance Monitoring', 'Mock Servers', 'Documentation'],
      created_at: '2024-01-10'
    },
    {
      id: '4',
      name: 'Social Media Scheduler',
      description: 'Schedule and manage your social media posts across multiple platforms.',
      category: 'Social Media',
      icon: '📱',
      url: '/tools/social-scheduler',
      is_external: false,
      difficulty: 'intermediate',
      tags: ['social media', 'scheduling', 'marketing'],
      usage_count: 2987,
      rating: 4.7,
      features: ['Multi-Platform Support', 'Content Calendar', 'Analytics', 'Team Collaboration'],
      created_at: '2024-01-08'
    },
    {
      id: '5',
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable complexity and security options.',
      category: 'Security',
      icon: '🔐',
      url: '/tools/password-generator',
      is_external: false,
      difficulty: 'beginner',
      tags: ['security', 'passwords', 'generator'],
      usage_count: 5432,
      rating: 4.5,
      features: ['Custom Length', 'Character Sets', 'Strength Meter', 'Bulk Generation'],
      created_at: '2024-01-14'
    },
    {
      id: '6',
      name: 'Image Optimizer',
      description: 'Compress and optimize images for web without losing quality.',
      category: 'Optimization',
      icon: '🖼️',
      url: '/tools/image-optimizer',
      is_external: false,
      difficulty: 'beginner',
      tags: ['images', 'optimization', 'compression'],
      usage_count: 4123,
      rating: 4.4,
      features: ['Batch Processing', 'Format Conversion', 'Quality Control', 'Size Reduction'],
      created_at: '2024-01-11'
    },
    {
      id: '7',
      name: 'Code Formatter',
      description: 'Format and beautify code in multiple programming languages with syntax highlighting.',
      category: 'Development',
      icon: '💻',
      url: '/tools/code-formatter',
      is_external: false,
      difficulty: 'intermediate',
      tags: ['code', 'formatting', 'development'],
      usage_count: 2765,
      rating: 4.6,
      features: ['Multi-Language Support', 'Syntax Highlighting', 'Custom Rules', 'Export Options'],
      created_at: '2024-01-09'
    },
    {
      id: '8',
      name: 'QR Code Generator',
      description: 'Create custom QR codes for URLs, text, contact info, and more.',
      category: 'Utilities',
      icon: '📱',
      url: '/tools/qr-generator',
      is_external: false,
      difficulty: 'beginner',
      tags: ['qr code', 'generator', 'utilities'],
      usage_count: 3654,
      rating: 4.3,
      features: ['Multiple Data Types', 'Custom Styling', 'High Resolution', 'Batch Generation'],
      created_at: '2024-01-13'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadTools = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        setTools(mockTools);
        setFilteredTools(mockTools);
      } catch (err) {
        setError('Failed to load tools');
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  useEffect(() => {
    let filtered = tools;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tool => tool.difficulty === selectedDifficulty);
    }

    setFilteredTools(filtered);
  }, [tools, searchQuery, selectedCategory, selectedDifficulty]);

  const handleToolClick = async (tool: Tool) => {
    await logActivity({
      action: 'tool_accessed',
      description: `Used tool: ${tool.name}`,
      metadata: { 
        tool_id: tool.id,
        tool_name: tool.name,
        category: tool.category,
        difficulty: tool.difficulty,
        is_external: tool.is_external
      }
    });

    // Update usage count
    setTools(prev => prev.map(t => 
      t.id === tool.id 
        ? { ...t, usage_count: t.usage_count + 1 }
        : t
    ));

    // Navigate to tool
    if (tool.is_external) {
      window.open(tool.url, '_blank');
    } else {
      window.location.href = tool.url;
    }
  };

  const categories = ['all', ...Array.from(new Set(tools.map(tool => tool.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="p-6" id="tools-section-loading">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" id="tools-section-error">
        <div className="text-center py-8">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" id="tools-section-container">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4" id="tools-filters">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="tools-category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="tools-difficulty-filter"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12" id="no-tools-found">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-600">No tools found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tools-grid">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              id={`tool-card-${tool.id}`}
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{tool.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
                      {tool.difficulty}
                    </span>
                  </div>
                </div>
                {tool.is_external && (
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </div>

              {/* Tool Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>

              {/* Tool Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(tool.rating)}
                  <span className="text-sm text-gray-600 ml-1">({tool.rating})</span>
                </div>
                <span className="text-sm text-gray-500">{tool.usage_count.toLocaleString()} uses</span>
              </div>

              {/* Tool Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {tool.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {tool.features.length > 3 && (
                    <li className="text-gray-500">+{tool.features.length - 3} more features</li>
                  )}
                </ul>
              </div>

              {/* Tool Tags */}
              <div className="flex flex-wrap gap-1">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Tools Section */}
      <div className="mt-12" id="popular-tools-section">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools
            .sort((a, b) => b.usage_count - a.usage_count)
            .slice(0, 3)
            .map((tool) => (
              <div
                key={`popular-${tool.id}`}
                onClick={() => handleToolClick(tool)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                id={`popular-tool-${tool.id}`}
              >
                <div className="text-xl">{tool.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.usage_count.toLocaleString()} uses</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">{tool.rating}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
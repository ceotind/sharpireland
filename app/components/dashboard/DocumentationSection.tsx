'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_read_time: number;
  last_updated: string;
  views: number;
  helpful_votes: number;
}

interface DocumentationSectionProps {
  userId: string;
  searchQuery: string;
}

export default function DocumentationSection({ userId, searchQuery }: DocumentationSectionProps) {
  const [docs, setDocs] = useState<DocumentationItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocumentationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock documentation data - in a real app, this would come from an API
  const mockDocs: DocumentationItem[] = [
    {
      id: '1',
      title: 'Getting Started with Dashboard',
      description: 'Learn the basics of navigating and using your dashboard effectively.',
      category: 'Getting Started',
      content: 'This comprehensive guide will walk you through the essential features of your dashboard...',
      tags: ['dashboard', 'basics', 'navigation'],
      difficulty: 'beginner',
      estimated_read_time: 5,
      last_updated: '2024-01-15',
      views: 1250,
      helpful_votes: 98
    },
    {
      id: '2',
      title: 'Advanced Analytics Setup',
      description: 'Configure advanced analytics tracking and custom metrics for your projects.',
      category: 'Analytics',
      content: 'Advanced analytics provide deeper insights into your project performance...',
      tags: ['analytics', 'metrics', 'tracking'],
      difficulty: 'advanced',
      estimated_read_time: 12,
      last_updated: '2024-01-10',
      views: 856,
      helpful_votes: 74
    },
    {
      id: '3',
      title: 'Team Collaboration Features',
      description: 'Learn how to invite team members and manage permissions effectively.',
      category: 'Team Management',
      content: 'Effective team collaboration is key to project success...',
      tags: ['teams', 'collaboration', 'permissions'],
      difficulty: 'intermediate',
      estimated_read_time: 8,
      last_updated: '2024-01-12',
      views: 642,
      helpful_votes: 52
    },
    {
      id: '4',
      title: 'API Integration Guide',
      description: 'Connect external services and automate workflows using our API.',
      category: 'Integration',
      content: 'Our API allows you to integrate with hundreds of external services...',
      tags: ['api', 'integration', 'automation'],
      difficulty: 'advanced',
      estimated_read_time: 15,
      last_updated: '2024-01-08',
      views: 423,
      helpful_votes: 38
    },
    {
      id: '5',
      title: 'Customizing Your Workspace',
      description: 'Personalize your dashboard layout and preferences for optimal productivity.',
      category: 'Customization',
      content: 'A well-organized workspace can significantly improve your productivity...',
      tags: ['customization', 'workspace', 'productivity'],
      difficulty: 'beginner',
      estimated_read_time: 6,
      last_updated: '2024-01-14',
      views: 789,
      helpful_votes: 65
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadDocs = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocs(mockDocs);
        setFilteredDocs(mockDocs);
      } catch (err) {
        setError('Failed to load documentation');
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  useEffect(() => {
    let filtered = docs;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(doc => doc.difficulty === selectedDifficulty);
    }

    setFilteredDocs(filtered);
  }, [docs, searchQuery, selectedCategory, selectedDifficulty]);

  const handleDocClick = async (doc: DocumentationItem) => {
    setSelectedDoc(doc);
    
    await logActivity({
      action: 'documentation_viewed',
      description: `Viewed documentation: ${doc.title}`,
      metadata: { 
        doc_id: doc.id,
        doc_title: doc.title,
        category: doc.category,
        difficulty: doc.difficulty
      }
    }, { userId });
  };

  const handleHelpfulVote = async (docId: string) => {
    await logActivity({
      action: 'documentation_helpful_vote',
      description: 'Voted documentation as helpful',
      metadata: { doc_id: docId }
    });

    // Update the helpful votes count
    setDocs(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, helpful_votes: doc.helpful_votes + 1 }
        : doc
    ));
  };

  const categories = ['all', ...Array.from(new Set(docs.map(doc => doc.category)))];
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

  if (loading) {
    return (
      <div className="p-6" id="documentation-loading">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" id="documentation-error">
        <div className="text-center py-8">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (selectedDoc) {
    return (
      <div className="p-6" id="documentation-detail-view">
        <div className="mb-4">
          <button
            onClick={() => setSelectedDoc(null)}
            className="flex items-center text-blue-600 hover:text-blue-800"
            id="back-to-docs-button"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Documentation
          </button>
        </div>

        <article className="max-w-4xl" id="documentation-article">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedDoc.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{selectedDoc.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedDoc.difficulty)}`}>
                {selectedDoc.difficulty.toUpperCase()}
              </span>
              <span>{selectedDoc.estimated_read_time} min read</span>
              <span>{selectedDoc.views} views</span>
              <span>Updated {new Date(selectedDoc.last_updated).toLocaleDateString()}</span>
            </div>
          </header>

          <div className="prose max-w-none mb-8" id="documentation-content">
            <p>{selectedDoc.content}</p>
            {/* In a real app, this would render rich content/markdown */}
          </div>

          <footer className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Was this helpful?</span>
                <button
                  onClick={() => handleHelpfulVote(selectedDoc.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  id="helpful-vote-button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Yes ({selectedDoc.helpful_votes})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tags:</span>
                {selectedDoc.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="p-6" id="documentation-list-view">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4" id="documentation-filters">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="category-filter"
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
            id="difficulty-filter"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documentation List */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-12" id="no-docs-found">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600">No documentation found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="documentation-grid">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocClick(doc)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              id={`doc-card-${doc.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{doc.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(doc.difficulty)}`}>
                  {doc.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{doc.estimated_read_time} min read</span>
                <span>{doc.views} views</span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {doc.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{doc.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
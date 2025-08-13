'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
  FunnelIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'user' | 'document' | 'analytics' | 'setting' | 'page';
  url: string;
  metadata?: Record<string, any>;
  score?: number;
  highlighted?: {
    title?: string;
    description?: string;
  };
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'project' | 'user' | 'document' | 'analytics' | 'setting' | 'page' | 'all';
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  maxResults?: number;
  showRecentSearches?: boolean;
  showFilters?: boolean;
}

const searchFilters: SearchFilter[] = [
  { id: 'all', label: 'All', type: 'all', icon: MagnifyingGlassIcon },
  { id: 'projects', label: 'Projects', type: 'project', icon: DocumentTextIcon },
  { id: 'users', label: 'Users', type: 'user', icon: UserIcon },
  { id: 'analytics', label: 'Analytics', type: 'analytics', icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', type: 'setting', icon: CogIcon },
  { id: 'pages', label: 'Pages', type: 'page', icon: DocumentTextIcon }
];

/**
 * Global Search Component with fuzzy search and advanced filtering
 */
export default function GlobalSearch({
  isOpen,
  onClose,
  placeholder = 'Search everything...',
  maxResults = 10,
  showRecentSearches = true,
  showFilters = true
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Load recent searches from localStorage
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse recent searches:', error);
        }
      }
    }
  }, []);

  /**
   * Save recent searches to localStorage
   */
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10);

    setRecentSearches(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  /**
   * Perform search API call
   */
  const performSearch = useCallback(async (searchQuery: string, filter: string = 'all') => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: filter !== 'all' ? filter : '',
        limit: maxResults.toString()
      });

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [maxResults]);

  /**
   * Handle search query changes
   */
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, selectedFilter);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, selectedFilter, performSearch]);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            saveRecentSearch(query);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose, saveRecentSearch]);

  /**
   * Focus input when opened
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Reset state when closed
   */
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setShowFiltersPanel(false);
    }
  }, [isOpen]);

  /**
   * Handle result click
   */
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    router.push(result.url);
    onClose();
  };

  /**
   * Handle recent search click
   */
  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery, selectedFilter);
  };

  /**
   * Clear recent searches
   */
  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard-recent-searches');
    }
  };

  /**
   * Get icon for result type
   */
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return DocumentTextIcon;
      case 'user':
        return UserIcon;
      case 'analytics':
        return ChartBarIcon;
      case 'setting':
        return CogIcon;
      default:
        return DocumentTextIcon;
    }
  };

  /**
   * Highlight search terms in text
   */
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8">
          
          {/* Search Header */}
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center">
              <div className="flex-1 flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 border-none outline-none text-lg placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {showFilters && (
                  <button
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    className={`p-2 rounded-md transition-colors ${
                      showFiltersPanel 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <FunnelIcon className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && showFiltersPanel && (
              <div className="mt-3 flex flex-wrap gap-2">
                {searchFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedFilter === filter.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {filter.label}
                      {filter.count && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-gray-200 text-xs rounded-full">
                          {filter.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Results */}
          <div ref={resultsRef} className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="text-center py-8">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No results found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => {
                  const Icon = getResultIcon(result.type);
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <Icon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.highlighted?.title 
                              ? <span dangerouslySetInnerHTML={{ __html: result.highlighted.title }} />
                              : highlightText(result.title, query)
                            }
                          </div>
                          <div className="text-sm text-gray-500 truncate mt-1">
                            {result.highlighted?.description
                              ? <span dangerouslySetInnerHTML={{ __html: result.highlighted.description }} />
                              : highlightText(result.description, query)
                            }
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {result.type}
                            </span>
                            {result.score && (
                              <span className="ml-2 text-xs text-gray-400">
                                {Math.round(result.score * 100)}% match
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Recent Searches */}
            {!query && showRecentSearches && recentSearches.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </div>
                {recentSearches.map((recentQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(recentQuery)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{recentQuery}</span>
                  </button>
                ))}
                <button
                  onClick={clearRecentSearches}
                  className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear recent searches
                </button>
              </div>
            )}

            {/* Empty State */}
            {!query && (!showRecentSearches || recentSearches.length === 0) && (
              <div className="text-center py-8">
                <CommandLineIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Start typing to search</p>
                <p className="text-sm text-gray-400 mt-1">
                  Search projects, users, analytics, and more
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                  <span className="ml-1">Navigate</span>
                </span>
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>
                  <span className="ml-1">Select</span>
                </span>
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">esc</kbd>
                  <span className="ml-1">Close</span>
                </span>
              </div>
              {results.length > 0 && (
                <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Search hook for managing global search state
 */
export function useGlobalSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch
  };
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

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

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  type: SearchResult['type'];
  url: string;
  metadata?: Record<string, any>;
  searchableText: string;
}

/**
 * Fuzzy search implementation
 */
class FuzzySearch {
  /**
   * Calculate Levenshtein distance between two strings
   */
  static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0]![i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j]![0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j]![i] = Math.min(
          matrix[j]![i - 1]! + 1, // deletion
          matrix[j - 1]![i]! + 1, // insertion
          matrix[j - 1]![i - 1]! + indicator // substitution
        );
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  /**
   * Calculate similarity score (0-1, where 1 is perfect match)
   */
  static similarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Search items with fuzzy matching
   */
  static search(items: SearchableItem[], query: string, threshold: number = 0.3): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    const results: (SearchResult & { score: number })[] = [];

    for (const item of items) {
      const searchText = item.searchableText.toLowerCase();
      let totalScore = 0;
      let matchCount = 0;

      // Exact match bonus
      if (searchText.includes(normalizedQuery)) {
        totalScore += 1.0;
        matchCount++;
      }

      // Word-by-word fuzzy matching
      for (const word of queryWords) {
        const words = searchText.split(/\s+/);
        let bestWordScore = 0;

        for (const searchWord of words) {
          const score = this.similarity(word, searchWord);
          if (score > bestWordScore) {
            bestWordScore = score;
          }
        }

        if (bestWordScore > threshold) {
          totalScore += bestWordScore;
          matchCount++;
        }
      }

      // Calculate final score
      const finalScore = matchCount > 0 ? totalScore / Math.max(queryWords.length, 1) : 0;

      if (finalScore > threshold) {
        results.push({
          ...item,
          score: finalScore,
          highlighted: this.highlightMatches(item, normalizedQuery)
        });
      }
    }

    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Highlight matching text
   */
  static highlightMatches(item: SearchableItem, query: string): { title?: string; description?: string } {
    const highlightText = (text: string, searchQuery: string): string => {
      const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-0.5 rounded">$1</mark>');
    };

    return {
      title: highlightText(item.title, query),
      description: highlightText(item.description, query)
    };
  }
}

/**
 * Get searchable items from database and static content
 */
async function getSearchableItems(userId?: string): Promise<SearchableItem[]> {
  const items: SearchableItem[] = [];

  try {
    const supabase = await createClient();

    // Get user's projects
    if (userId) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description, created_at')
        .eq('user_id', userId)
        .limit(50);

      if (projects) {
        projects.forEach((project: any) => {
          items.push({
            id: `project-${project.id}`,
            title: project.name,
            description: project.description || 'No description available',
            type: 'project',
            url: `/dashboard/projects/${project.id}`,
            metadata: { created_at: project.created_at },
            searchableText: `${project.name} ${project.description || ''}`
          });
        });
      }

      // Get user's team members (if applicable)
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          profiles:user_id (
            id,
            full_name,
            email
          )
        `)
        .limit(20);

      if (teamMembers) {
        teamMembers.forEach((member: any) => {
          const profile = member.profiles as any;
          if (profile) {
            items.push({
              id: `user-${profile.id}`,
              title: profile.full_name || profile.email,
              description: `Team member - ${member.role}`,
              type: 'user',
              url: `/dashboard/team/${profile.id}`,
              metadata: { role: member.role },
              searchableText: `${profile.full_name || ''} ${profile.email} ${member.role}`
            });
          }
        });
      }
    }

    // Add static dashboard pages
    const staticPages = [
      {
        id: 'dashboard-home',
        title: 'Dashboard',
        description: 'Main dashboard overview with key metrics and insights',
        type: 'page' as const,
        url: '/dashboard',
        searchableText: 'dashboard home overview metrics insights'
      },
      {
        id: 'analytics-overview',
        title: 'Analytics Overview',
        description: 'Comprehensive analytics and reporting dashboard',
        type: 'analytics' as const,
        url: '/dashboard/analytics',
        searchableText: 'analytics reports metrics data insights charts graphs'
      },
      {
        id: 'projects-list',
        title: 'All Projects',
        description: 'View and manage all your projects',
        type: 'page' as const,
        url: '/dashboard/projects',
        searchableText: 'projects list manage view all'
      },
      {
        id: 'billing-subscription',
        title: 'Billing & Subscription',
        description: 'Manage your subscription and billing information',
        type: 'setting' as const,
        url: '/dashboard/billing',
        searchableText: 'billing subscription payment invoice plan upgrade'
      },
      {
        id: 'support-tickets',
        title: 'Support Center',
        description: 'Get help and manage support tickets',
        type: 'page' as const,
        url: '/dashboard/support',
        searchableText: 'support help tickets assistance contact'
      },
      {
        id: 'account-settings',
        title: 'Account Settings',
        description: 'Manage your account preferences and profile',
        type: 'setting' as const,
        url: '/dashboard/settings',
        searchableText: 'settings account profile preferences configuration'
      },
      {
        id: 'team-management',
        title: 'Team Management',
        description: 'Manage team members and permissions',
        type: 'page' as const,
        url: '/dashboard/team',
        searchableText: 'team members users permissions roles management'
      },
      {
        id: 'api-documentation',
        title: 'API Documentation',
        description: 'Developer resources and API documentation',
        type: 'document' as const,
        url: '/dashboard/docs/api',
        searchableText: 'api documentation developer resources endpoints'
      },
      {
        id: 'integrations',
        title: 'Integrations',
        description: 'Connect with third-party services and tools',
        type: 'setting' as const,
        url: '/dashboard/integrations',
        searchableText: 'integrations third-party services tools connect webhooks'
      },
      {
        id: 'notifications-settings',
        title: 'Notification Settings',
        description: 'Configure your notification preferences',
        type: 'setting' as const,
        url: '/dashboard/notifications/settings',
        searchableText: 'notifications settings preferences alerts email push'
      }
    ];

    items.push(...staticPages);

  } catch (error) {
    console.error('Error fetching searchable items:', error);
  }

  return items;
}

/**
 * GET /api/search
 * 
 * Search across dashboard content with fuzzy matching and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        filters: { type: type || 'all' }
      });
    }

    // Get user ID from session (simplified - implement proper auth)
    const userId = request.headers.get('x-user-id'); // This should come from your auth system

    // Get all searchable items
    const items = await getSearchableItems(userId || undefined);

    // Filter by type if specified
    const filteredItems = type && type !== 'all' 
      ? items.filter(item => item.type === type)
      : items;

    // Perform fuzzy search
    const results = FuzzySearch.search(filteredItems, query, 0.2);

    // Limit results
    const limitedResults = results.slice(0, limit);

    // Add search analytics (optional)
    if (userId && query.trim().length > 2) {
      // Log search query for analytics
      console.log(`Search: "${query}" by user ${userId}, ${results.length} results`);
    }

    return NextResponse.json({
      results: limitedResults,
      total: results.length,
      query: query.trim(),
      filters: { type: type || 'all' },
      suggestions: generateSearchSuggestions(query, items)
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

/**
 * Generate search suggestions based on query and available items
 */
function generateSearchSuggestions(query: string, items: SearchableItem[]): string[] {
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();

  // Find items that start with the query
  const startsWith = items
    .filter(item => item.title.toLowerCase().startsWith(queryLower))
    .map(item => item.title)
    .slice(0, 3);

  suggestions.push(...startsWith);

  // Find items that contain the query
  const contains = items
    .filter(item => 
      item.title.toLowerCase().includes(queryLower) && 
      !item.title.toLowerCase().startsWith(queryLower)
    )
    .map(item => item.title)
    .slice(0, 2);

  suggestions.push(...contains);

  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 5);
}

/**
 * POST /api/search
 * 
 * Advanced search with custom filters and sorting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      sort = 'relevance', 
      limit = 10,
      offset = 0 
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        filters
      });
    }

    const userId = request.headers.get('x-user-id');
    const items = await getSearchableItems(userId || undefined);

    // Apply filters
    let filteredItems = items;

    if (filters.type && filters.type !== 'all') {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }

    if (filters.dateRange) {
      // Filter by date range if metadata contains dates
      filteredItems = filteredItems.filter(item => {
        if (!item.metadata?.created_at) return true;
        const itemDate = new Date(item.metadata.created_at);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Perform search
    let results = FuzzySearch.search(filteredItems, query, 0.2);

    // Apply sorting
    if (sort === 'date') {
      results.sort((a, b) => {
        const dateA = a.metadata?.created_at ? new Date(a.metadata.created_at).getTime() : 0;
        const dateB = b.metadata?.created_at ? new Date(b.metadata.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    // Default is relevance (already sorted by score)

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    return NextResponse.json({
      results: paginatedResults,
      total: results.length,
      query: query.trim(),
      filters,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < results.length
      }
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    return NextResponse.json(
      { 
        error: 'Advanced search failed',
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
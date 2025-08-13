'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  video_url: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  views: number;
  likes: number;
  created_at: string;
  instructor: {
    name: string;
    avatar_url: string;
    title: string;
  };
}

interface VideoTutorialsProps {
  userId: string;
  searchQuery: string;
}

export default function VideoTutorials({ userId, searchQuery }: VideoTutorialsProps) {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoTutorial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock video data - in a real app, this would come from an API
  const mockVideos: VideoTutorial[] = [
    {
      id: '1',
      title: 'Dashboard Overview - Getting Started',
      description: 'A comprehensive walkthrough of your dashboard interface and key features.',
      category: 'Getting Started',
      thumbnail_url: '/images/video-thumbnails/dashboard-overview.jpg',
      video_url: 'https://example.com/videos/dashboard-overview.mp4',
      duration: 480, // 8 minutes
      difficulty: 'beginner',
      tags: ['dashboard', 'overview', 'basics'],
      views: 2340,
      likes: 187,
      created_at: '2024-01-15',
      instructor: {
        name: 'Sarah Johnson',
        avatar_url: '/images/instructors/sarah.jpg',
        title: 'Product Manager'
      }
    },
    {
      id: '2',
      title: 'Advanced Analytics Configuration',
      description: 'Learn how to set up custom metrics, goals, and advanced tracking features.',
      category: 'Analytics',
      thumbnail_url: '/images/video-thumbnails/analytics-config.jpg',
      video_url: 'https://example.com/videos/analytics-config.mp4',
      duration: 720, // 12 minutes
      difficulty: 'advanced',
      tags: ['analytics', 'configuration', 'metrics'],
      views: 1456,
      likes: 124,
      created_at: '2024-01-10',
      instructor: {
        name: 'Mike Chen',
        avatar_url: '/images/instructors/mike.jpg',
        title: 'Data Analyst'
      }
    },
    {
      id: '3',
      title: 'Team Collaboration Best Practices',
      description: 'Discover effective strategies for team collaboration and project management.',
      category: 'Team Management',
      thumbnail_url: '/images/video-thumbnails/team-collaboration.jpg',
      video_url: 'https://example.com/videos/team-collaboration.mp4',
      duration: 600, // 10 minutes
      difficulty: 'intermediate',
      tags: ['teams', 'collaboration', 'management'],
      views: 1823,
      likes: 156,
      created_at: '2024-01-12',
      instructor: {
        name: 'Emily Rodriguez',
        avatar_url: '/images/instructors/emily.jpg',
        title: 'Team Lead'
      }
    },
    {
      id: '4',
      title: 'API Integration Masterclass',
      description: 'Master API integrations with step-by-step examples and best practices.',
      category: 'Integration',
      thumbnail_url: '/images/video-thumbnails/api-integration.jpg',
      video_url: 'https://example.com/videos/api-integration.mp4',
      duration: 900, // 15 minutes
      difficulty: 'advanced',
      tags: ['api', 'integration', 'development'],
      views: 987,
      likes: 89,
      created_at: '2024-01-08',
      instructor: {
        name: 'David Kim',
        avatar_url: '/images/instructors/david.jpg',
        title: 'Senior Developer'
      }
    },
    {
      id: '5',
      title: 'Customizing Your Workspace',
      description: 'Personalize your dashboard layout, themes, and preferences for maximum productivity.',
      category: 'Customization',
      thumbnail_url: '/images/video-thumbnails/workspace-customization.jpg',
      video_url: 'https://example.com/videos/workspace-customization.mp4',
      duration: 360, // 6 minutes
      difficulty: 'beginner',
      tags: ['customization', 'workspace', 'productivity'],
      views: 1654,
      likes: 142,
      created_at: '2024-01-14',
      instructor: {
        name: 'Lisa Wang',
        avatar_url: '/images/instructors/lisa.jpg',
        title: 'UX Designer'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadVideos = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        setVideos(mockVideos);
        setFilteredVideos(mockVideos);
      } catch (err) {
        setError('Failed to load video tutorials');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(video => video.difficulty === selectedDifficulty);
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedCategory, selectedDifficulty]);

  const handleVideoClick = async (video: VideoTutorial) => {
    setSelectedVideo(video);
    
    await logActivity({
      action: 'video_tutorial_viewed',
      description: `Watched video tutorial: ${video.title}`,
      metadata: { 
        video_id: video.id,
        video_title: video.title,
        category: video.category,
        difficulty: video.difficulty,
        duration: video.duration
      }
    });

    // Update view count
    setVideos(prev => prev.map(v => 
      v.id === video.id 
        ? { ...v, views: v.views + 1 }
        : v
    ));
  };

  const handleLike = async (videoId: string) => {
    await logActivity({
      action: 'video_tutorial_liked',
      description: 'Liked video tutorial',
      metadata: { video_id: videoId }
    });

    // Update like count
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, likes: video.likes + 1 }
        : video
    ));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const categories = ['all', ...Array.from(new Set(videos.map(video => video.category)))];
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
      <div className="p-6" id="video-tutorials-loading">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" id="video-tutorials-error">
        <div className="text-center py-8">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="p-6" id="video-player-view">
        <div className="mb-4">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center text-blue-600 hover:text-blue-800"
            id="back-to-videos-button"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Videos
          </button>
        </div>

        <div className="max-w-4xl" id="video-player-container">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="h-16 w-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p>Video Player</p>
              <p className="text-sm opacity-75">({selectedVideo.video_url})</p>
            </div>
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h1>
            <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {selectedVideo.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedVideo.instructor.name}</p>
                    <p className="text-sm text-gray-600">{selectedVideo.instructor.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(selectedVideo.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  id="like-video-button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {selectedVideo.likes}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                {selectedVideo.difficulty.toUpperCase()}
              </span>
              <span>{formatDuration(selectedVideo.duration)}</span>
              <span>{selectedVideo.views} views</span>
              <span>Published {new Date(selectedVideo.created_at).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {selectedVideo.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" id="video-tutorials-list">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4" id="video-filters">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="video-category-filter"
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
            id="video-difficulty-filter"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video List */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12" id="no-videos-found">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">No video tutorials found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4" id="video-list">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              id={`video-card-${video.id}`}
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-20 bg-gray-300 rounded-lg flex items-center justify-center relative">
                    <svg className="h-8 w-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span>{video.instructor.name}</span>
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
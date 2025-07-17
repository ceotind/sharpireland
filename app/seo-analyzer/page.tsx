"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SEOPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/seo-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }
      
      const data = await response.json();
      
      // Store report in localStorage
      localStorage.setItem('seoReport', JSON.stringify(data));
      
      // Redirect to report page
      router.push('/seo-analyzer/report');
      
    } catch (err) {
      setError('Error analyzing URL. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="min-h-screen flex items-center justify-center pt-16" role="main" style={{ background: 'var(--bg-100)' }}>
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-100)' }}>SEO Analyzer</h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-2" style={{ color: 'var(--text-200)' }}>
              Analyze your website's SEO performance and get actionable recommendations
            </p>
          </div>
          
          <div className="rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8" style={{
            background: 'var(--bg-200)', 
            border: '1px solid var(--border-100)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-grow min-w-0">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., https://example.com)"
                    className="w-full px-6 py-3 sm:py-4 rounded-xl focus:outline-none text-base sm:text-lg transition-all"
                    style={{
                      background: 'var(--bg-300)',
                      border: '1px solid var(--border-100)',
                      color: 'var(--text-100)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    required
                  />
                </div>
                <div className="sm:w-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-full px-4 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                    style={{
                      background: 'var(--accent-green)',
                      color: 'var(--white-color)',
                      boxShadow: '0 4px 14px var(--accent-green-shadow)',
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : 'Analyze SEO'}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="p-4 mb-4 rounded" style={{ 
                background: 'var(--error-bg)', 
                borderLeft: '4px solid var(--error-border)'
              }}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" style={{ color: 'var(--error-icon)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm" style={{ color: 'var(--error-text)' }}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 mx-auto" style={{ 
                    borderTop: '4px solid var(--accent-green)', 
                    borderBottom: '4px solid var(--bg-300)' 
                  }}></div>
                  <p className="mt-4 text-lg font-medium" style={{ color: 'var(--text-100)' }}>Analyzing your website...</p>
                  <p className="mt-2" style={{ color: 'var(--text-200)' }}>This may take a few moments</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Comprehensive Analysis",
                description: "Get detailed insights on all key SEO factors affecting your website's performance",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--accent-blue)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Actionable Recommendations",
                description: "Receive clear, practical steps to improve your search engine rankings",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--accent-green)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Competitive Metrics",
                description: "See how your site compares to competitors and industry standards",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--accent-purple)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
                style={{
                  background: 'var(--bg-200)',
                  border: '1px solid var(--border-100)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div className="rounded-full p-3 inline-block mb-4" style={{ background: 'var(--bg-300)' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-100)' }}>{feature.title}</h3>
                <p className="" style={{ color: 'var(--text-200)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to console and external service
    console.error('Global error occurred:', error);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      const errorData = {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      };

      fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(err => {
        console.error('Failed to log global error:', err);
      });
    }
  }, [error]);

  return (
    <html lang="en-IE">
      <head>
        <title>Something went wrong | Sharp Digital Ireland</title>
        <meta name="robots" content="noindex,nofollow" />
        <style>{`
          :root {
            --background: #ffffff;
            --text-100: #1f2937;
            --text-200: #6b7280;
            --text-300: #9ca3af;
            --bg-200: #f9fafb;
            --bg-300: #e5e7eb;
            --bg-400: #d1d5db;
            --accent-green: #10b981;
            --accent-green-hover: #059669;
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #0f172a;
              --text-100: #f1f5f9;
              --text-200: #cbd5e1;
              --text-300: #94a3b8;
              --bg-200: #1e293b;
              --bg-300: #334155;
              --bg-400: #475569;
              --accent-green: #10b981;
              --accent-green-hover: #34d399;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background);
            color: var(--text-100);
            line-height: 1.6;
          }
        `}</style>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-200)',
              border: '1px solid var(--bg-300)',
              borderRadius: '0.5rem',
              padding: '2rem'
            }}>
              {/* Error Icon */}
              <div style={{ marginBottom: '1.5rem' }}>
                <svg 
                  style={{
                    margin: '0 auto',
                    height: '3rem',
                    width: '3rem',
                    color: '#ef4444'
                  }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--text-100)',
                marginBottom: '1rem'
              }}>
                Something went wrong
              </h1>
              
              <p style={{
                color: 'var(--text-200)',
                marginBottom: '1.5rem'
              }}>
                We&apos;re sorry, but a critical error occurred. Our team has been notified and is working to fix this issue.
              </p>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && (
                <details style={{
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  <summary style={{
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-200)',
                    marginBottom: '0.5rem'
                  }}>
                    Error Details (Development)
                  </summary>
                  <pre style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--bg-300)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    maxHeight: '8rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                    {error.digest && `\n\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={reset}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--accent-green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-green-hover)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-green)';
                  }}
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--bg-300)',
                    color: 'var(--text-100)',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-400)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-300)';
                  }}
                >
                  Go to Homepage
                </button>
              </div>

              <p style={{
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-300)'
              }}>
                If this problem persists, please contact us at{' '}
                <a 
                  href="mailto:hello@sharpdigital.in"
                  style={{
                    color: 'var(--accent-green)',
                    textDecoration: 'none'
                  }}
                >
                  hello@sharpdigital.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
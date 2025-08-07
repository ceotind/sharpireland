"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function SEOPage() {
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Add listener for changes
    const handleMotionPreferenceChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);
  
  // Safe transition that respects reduced motion preference
  
  // Page container variants
  const pageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  // Title section variants
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "easeOut"
      }
    }
  };

  // Form container variants
  const formContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  // Input field variants
  const inputVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeOut"
      }
    }
  };

  // Button variants
  const buttonVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 6px 20px var(--accent-green-shadow)",
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.1,
        ease: "easeIn"
      }
    }
  };

  // Error message variants
  const errorVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 16,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeIn"
      }
    }
  };

  // Loading indicator variants
  const loadingVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeIn"
      }
    }
  };

  // Feature card variants
  const featureCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : i * 0.1
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeInOut"
      }
    }
  };
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <main className="min-h-screen flex items-center justify-center pt-16" role="main" style={{ background: 'var(--bg-100)' }}>
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          <motion.div className="text-center mb-8 sm:mb-12" variants={titleVariants}>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
              style={{ color: 'var(--text-100)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
              variants={titleVariants}
            >
              SEO Analyzer
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto px-2"
              style={{ color: 'var(--text-200)', fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
              variants={titleVariants}
            >
              Analyze your website's SEO performance and get actionable recommendations
            </motion.p>
          </motion.div>
          
          <motion.div
            className="rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8"
            style={{
              background: 'var(--bg-200)',
              border: '1px solid var(--border-100)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}
            variants={formContainerVariants}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.div className="flex-grow min-w-0" variants={inputVariants}>
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
                </motion.div>
                <motion.div
                  className="sm:w-auto"
                  variants={buttonVariants}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-full px-6 py-3 sm:py-3 rounded-md font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2"
                    style={{
                      color: 'var(--white-color)',
                      boxShadow: '0 4px 14px var(--accent-green-shadow)',
                    }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
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
                  </motion.button>
                </motion.div>
              </div>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-4 mb-4 rounded"
                  style={{
                    background: 'var(--error-bg)',
                    borderLeft: '4px solid var(--error-border)'
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={errorVariants}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5" style={{ color: 'var(--error-icon)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm" style={{ color: 'var(--error-text)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {loading && (
                <motion.div
                  className="mt-10"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={loadingVariants}
                >
                  <div className="text-center">
                    <motion.div
                      className="rounded-full h-16 w-16 mx-auto"
                      style={{
                        borderTop: '4px solid var(--accent-green)',
                        borderBottom: '4px solid var(--bg-300)'
                      }}
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 1,
                        ease: "linear",
                        repeat: Infinity
                      }}
                    ></motion.div>
                    <motion.p
                      className="mt-4 text-lg font-medium"
                      style={{ color: 'var(--text-100)', fontSize: 'clamp(1.125rem, 2vw, 1.25rem)' }}
                      variants={titleVariants}
                    >
                      Analyzing your website...
                    </motion.p>
                    <motion.p
                      className="mt-2"
                      style={{ color: 'var(--text-200)', fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}
                      variants={titleVariants}
                    >
                      This may take a few moments
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
              <motion.div
                key={index}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'var(--bg-200)',
                  border: '1px solid var(--border-100)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.03)'
                }}
                custom={index}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover="hover"
              >
                <div className="rounded-full p-3 inline-block mb-4" style={{ background: 'var(--bg-300)' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-100)', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>{feature.title}</h3>
                <p className="" style={{ color: 'var(--text-200)', fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
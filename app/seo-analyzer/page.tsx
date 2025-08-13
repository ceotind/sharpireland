"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { useAnalytics } from '../components/Analytics';
import { pageVariants as createPageVariants, titleVariants as createTitleVariants, formContainerVariants as createFormContainerVariants, heroGroupVariants as createHeroGroupVariants } from '../utils/seo-variants';
import TrustNote from '../components/seo-analyzer/TrustNote';
import RecentHistory from '../components/seo-analyzer/RecentHistory';
import SEOForm from '../components/seo-analyzer/SEOForm';
import FeatureCards from '../components/seo-analyzer/FeatureCards';

export default function SEOPage() {
  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Easing approximating power2.out for Framer Motion
  const easePower2Out = useMemo(() => [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], []);

  // Create motion variants from utility
  const pageVariants = createPageVariants(prefersReducedMotion, easePower2Out);
  const titleVariants = createTitleVariants(prefersReducedMotion, easePower2Out);
  const formContainerVariants = createFormContainerVariants(prefersReducedMotion, easePower2Out);
  const heroGroupVariants = createHeroGroupVariants(prefersReducedMotion, easePower2Out);








// Analytics tracking (provider-agnostic via Analytics hook)
  const { trackEvent } = useAnalytics();
  const urlEnterStartedRef = useRef(false);
  const submitStartRef = useRef<number | null>(null);
  const router = useRouter();

  // Form state and a11y
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const errorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Recent history
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('seoHistory:v1');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setRecent(arr.slice(0, 3));
        }
      }
    } catch {}
  }, []);

  // Focus error region when error appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // Cleanup any in-flight on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  // URL helpers
  function normalizeUrl(input: string): string {
    const v = input.trim();
    if (!v) return v;
    if (!/^https?:\/\//i.test(v)) {
      return `https://${v}`;
    }
    return v;
  }

  function quickDomainCheck(host: string): boolean {
    if (host === 'localhost') return true;
    return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
  }

  function validateUrl(input: string): { valid: boolean; message?: string } {
    const trimmed = input.trim();
    if (!trimmed) return { valid: false, message: 'Enter a URL to analyze' };
    try {
      const testUrl = new URL(normalizeUrl(trimmed));
      if (!quickDomainCheck(testUrl.hostname)) {
        return { valid: false, message: 'Enter a valid domain (e.g., example.com)' };
      }
      return { valid: true };
    } catch {
      return { valid: false, message: 'Enter a valid URL (e.g., https://example.com)' };
    }
  }

  function applyValidation(nextVal: string) {
    const res = validateUrl(nextVal);
    setIsValid(res.valid);
    setValidationMsg(res.valid ? null : (res.message || null));
    setError(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!urlEnterStartedRef.current) {
      urlEnterStartedRef.current = true;
      trackEvent('seo url enter start');
    }
    const next = e.target.value;
    setUrl(next);
    applyValidation(next);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!urlEnterStartedRef.current) {
      urlEnterStartedRef.current = true;
      trackEvent('seo url enter start');
    }
    const pasted = e.clipboardData.getData('text') || '';
    if (pasted) {
      e.preventDefault();
      setUrl(pasted);
      applyValidation(pasted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && loading) {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      setLoading(false);
      setStatusMessage('Request cancelled');
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, message } = validateUrl(url);
    if (!valid) {
      setIsValid(false);
      setValidationMsg(message || 'Enter a valid URL');
      setError('Enter a valid URL');
      return;
    }

    // Analytics: submit start
    trackEvent('seo analyze submit');
    submitStartRef.current = Date.now();

    // Abort any existing
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setStatusMessage('Submitting URL for analysis…');

    const finalUrl = normalizeUrl(url);

    try {
      const response = await fetch('/api/seo-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          setError('Rate limit reached. Please retry in a moment.');
        } else if (response.status === 400 || response.status === 422) {
          try {
            const j = await response.json();
            setError(j?.error || 'Invalid URL. Please check the format and try again.');
          } catch {
            setError('Invalid URL. Please check the format and try again.');
          }
        } else if (response.status >= 500) {
          setError('We hit a snag analyzing that URL. Please try again, or contact us if this persists.');
        } else if (response.status === 408) {
          setError('The website took too long to respond. Please try again later.');
        } else {
          setError('Failed to analyze the URL. Please try again.');
        }

        const reason =
          response.status === 429 ? 'http_429' :
          response.status === 400 ? 'http_400' :
          response.status === 422 ? 'http_422' :
          response.status === 408 ? 'timeout' :
          response.status >= 500 ? 'http_500' :
          'http_400';
        trackEvent('seo analyze error', { reason });

        setLoading(false);
        setStatusMessage('Analysis failed');
        return;
      }

      const data = await response.json();

      // Save report and history with versioned keys (+ legacy for current report page)
      try {
        localStorage.setItem('seoReport:v1', JSON.stringify(data));
        localStorage.setItem('seoReport', JSON.stringify(data));
      } catch {}

      try {
        const existingRaw = localStorage.getItem('seoHistory:v1');
        const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
        const next = [finalUrl, ...existing.filter(u => u !== finalUrl)].slice(0, 3);
        localStorage.setItem('seoHistory:v1', JSON.stringify(next));
        setRecent(next);
      } catch {}

      const timeToResultMs = submitStartRef.current != null ? Date.now() - submitStartRef.current : undefined;
      trackEvent('seo analyze success', timeToResultMs != null ? { timeToResultMs } : undefined);

      setStatusMessage('Analysis complete. Redirecting to report.');
      setTimeout(() => {
        router.push('/seo-analyzer/report');
      }, 150);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setStatusMessage('Request cancelled');
        trackEvent('seo analyze error', { reason: 'aborted' });
      } else {
        setError('Network error occurred. Please try again.');
        setStatusMessage('Analysis failed due to network error');
        trackEvent('seo analyze error', { reason: 'network' });
      }
      setLoading(false);
    }
  };


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SEO Analyzer",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    url: typeof window !== 'undefined' ? window.location.href : undefined
  };

  return (
    <motion.div
      id="seo-root"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <main
        id="seo-main"
        className="min-h-screen flex items-center justify-center pt-16 bg-[var(--bg-100)]"
        role="main"
      >
        <div id="seo-container" className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          <motion.div id="seo-hero" className="text-center mb-8 sm:mb-12" variants={heroGroupVariants}>
            <motion.h1
              id="seo-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
              style={{ color: 'var(--text-100)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', willChange: 'transform, opacity' }}
              variants={titleVariants}
            >
              SEO Analyzer — Free Website SEO Analysis Tool
            </motion.h1>
            <motion.p
              id="seo-hero-subhead"
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto px-2"
              style={{ color: 'var(--text-200)', fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', willChange: 'transform, opacity' }}
              variants={titleVariants}
            >
              Instantly evaluate key SEO elements, detect issues, and get actionable recommendations to improve visibility. Privacy-first: analysis runs on-demand.
            </motion.p>
            <motion.div id="seo-hero-trust-wrap" variants={titleVariants} style={{ willChange: 'transform, opacity' }}>
              <TrustNote className="mt-3" />
            </motion.div>
          </motion.div>

          <motion.div
            id="seo-form-card"
            className="rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 bg-white border border-blue-500"
            variants={formContainerVariants}
            style={{ willChange: 'transform, opacity' }}
          >
            <SEOForm
              url={url}
              isValid={isValid}
              validationMsg={validationMsg}
              loading={loading}
              error={error}
              statusMessage={statusMessage}
              inputRef={inputRef}
              submitRef={submitRef}
              errorRef={errorRef}
              onChange={handleChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
              onExampleSelect={(ex) => {
                trackEvent('click sample url');
                setUrl(ex);
                applyValidation(ex);
                inputRef.current?.focus();
              }}
              prefersReducedMotion={prefersReducedMotion}
              ease={easePower2Out}
            />

            {recent.length > 0 && (
              <RecentHistory
                history={recent}
                onSelect={(u) => {
                  setUrl(u);
                  applyValidation(u);
                  inputRef.current?.focus();
                }}
                className="mt-8"
              />
            )}
          </motion.div>

          <FeatureCards prefersReducedMotion={prefersReducedMotion} ease={easePower2Out} />
          <Script
            id="seo-webapp-schema"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </div>
      </main>
    </motion.div>
  );
}
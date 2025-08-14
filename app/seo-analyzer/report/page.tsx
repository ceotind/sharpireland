"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedSEOReport } from '@/app/api/seo-analyzer/route';
import NavBar from '@/app/components/NavBar';
import Link from 'next/link';
import DetailedSEOReportPopup from '@/app/components/seo-analyzer/DetailedSEOReportPopup';

export default function SEOReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<EnhancedSEOReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Retrieve report from localStorage
    const storedReport = localStorage.getItem('seoReport');
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    } else {
      // Redirect back if no report data
      router.push('/seo-analyzer');
    }
    setLoading(false);
  }, [router]);

  // Popup trigger with 5-second delay
  useEffect(() => {
    if (!report || loading) return;

    // Set 5-second delay before showing popup
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [report, loading]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const ScoreMeter = ({ score, label }: { score: number; label?: string }) => {
    let color = 'bg-[var(--accent-red)]';
    if (score >= 80) color = 'bg-[var(--accent-green)]';
    else if (score >= 60) color = 'bg-[var(--primary-300)]';
    
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-lg font-semibold text-[var(--text-100)]">{label || 'SEO Score'}</span>
          <span className="text-xl font-bold text-[var(--text-100)]">{score}/100</span>
        </div>
        <div className="w-full bg-[var(--bg-300)] rounded-full h-4">
          <div
            className={`${color} h-4 rounded-full`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, description, status }: {
    title: string;
    value: string | number;
    description?: string;
    status?: 'good' | 'needs-improvement' | 'poor';
  }) => {
    let statusColor = '';
    if (status === 'good') statusColor = 'text-[var(--accent-green)]';
    else if (status === 'needs-improvement') statusColor = 'text-[var(--primary-300)]';
    else if (status === 'poor') statusColor = 'text-[var(--accent-red)]';
    
    return (
      <div className="bg-[var(--bg-100)] p-4 rounded-lg shadow-sm border border-[var(--bg-300)]">
        <h3 className="text-sm font-medium text-[var(--text-300)]" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>{title}</h3>
        <p className={`text-xl font-semibold mt-1 text-[var(--text-100)] ${statusColor}`} style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>{value}</p>
        {description && <p className="text-sm text-[var(--text-300)] mt-1" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>{description}</p>}
      </div>
    );
  };

  const WebVitalCard = ({ title, value, status, recommendation }: {
    title: string;
    value: number;
    status: 'good' | 'needs-improvement' | 'poor';
    recommendation: string;
  }) => {
    let statusColor = '';
    let statusText = '';
    if (status === 'good') {
      statusColor = 'text-[var(--accent-green)]';
      statusText = 'Good';
    } else if (status === 'needs-improvement') {
      statusColor = 'text-[var(--primary-300)]';
      statusText = 'Needs Improvement';
    } else {
      statusColor = 'text-[var(--accent-red)]';
      statusText = 'Poor';
    }
    
    return (
      <div className="bg-[var(--bg-100)] p-4 rounded-lg shadow-sm border border-[var(--bg-300)]">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-[var(--text-300)]">{title}</h3>
          <span className={`text-xs font-semibold ${statusColor}`}>{statusText}</span>
        </div>
        <p className="text-2xl font-bold mt-1 text-[var(--text-100)]">{value}</p>
        <p className="text-sm text-[var(--text-300)] mt-2">{recommendation}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-100)] mb-4"></div>
        <p className="text-center" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>Loading SEO report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">No SEO report found</h2>
        <p className="mb-6 text-center" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>Please analyze a URL first</p>
        <Link href="/seo-analyzer" className="bg-[var(--primary-100)] hover:bg-[var(--primary-200)] text-[var(--white-color)] px-6 py-3 rounded-lg">
          Analyze a URL
        </Link>
      </div>
    );
  }

  return (
    <div>
      <NavBar user={null} />
      <main className={`min-h-screen bg-[var(--background)] pt-16 transition-all duration-300 ${showPopup ? 'blur-sm' : ''}`} role="main">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-100)]" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)' }}>SEO Report</h1>
            <Link href="/seo-analyzer" className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)]">
              Analyze Another URL
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-[var(--bg-200)] to-[var(--bg-300)] rounded-xl p-6 mb-8 border border-[var(--border-100)]">
            <h2 className="text-2xl font-bold mb-2 text-[var(--text-100)]">
              Analysis for <span className="text-[var(--accent-blue)] break-all">{report.url}</span>
            </h2>
            <p className="text-[var(--text-300)]" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
              Analyzed on {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-[var(--bg-100)] rounded-xl shadow-lg p-6 mb-8 border border-[var(--border-100)]">
            <ScoreMeter score={report.score} label="Overall SEO Score" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <MetricCard
                title="Title"
                value={report.title}
                description={`${report.titleLength} characters`}
              />
              <MetricCard
                title="Meta Description"
                value={report.metaDescription || 'Not found'}
                description={`${report.metaDescriptionLength} characters`}
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Headings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="H1 Tags"
                  value={report.headings.h1.length}
                  description={report.headings.h1.join(', ') || 'None'}
                />
                <MetricCard
                  title="H2 Tags"
                  value={report.headings.h2.length}
                  description={report.headings.h2.join(', ') || 'None'}
                />
                <MetricCard
                  title="H3 Tags"
                  value={report.headings.h3.length}
                  description={report.headings.h3.join(', ') || 'None'}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Total Images" value={report.images.total} />
                <MetricCard title="With Alt Text" value={report.images.withAlt} />
                <MetricCard title="Without Alt Text" value={report.images.withoutAlt} />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Internal Links" value={report.links.internal} />
                <MetricCard title="External Links" value={report.links.external} />
              </div>
            </div>
            
            {/* Core Web Vitals Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Core Web Vitals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WebVitalCard
                  title="Largest Contentful Paint (LCP)"
                  value={Math.round(report.coreWebVitals.lcp.value)}
                  status={report.coreWebVitals.lcp.status}
                  recommendation={report.coreWebVitals.lcp.recommendation}
                />
                <WebVitalCard
                  title="First Input Delay (FID)"
                  value={Math.round(report.coreWebVitals.fid.value)}
                  status={report.coreWebVitals.fid.status}
                  recommendation={report.coreWebVitals.fid.recommendation}
                />
                <WebVitalCard
                  title="Cumulative Layout Shift (CLS)"
                  value={Math.round(report.coreWebVitals.cls.value)}
                  status={report.coreWebVitals.cls.status}
                  recommendation={report.coreWebVitals.cls.recommendation}
                />
              </div>
            </div>
            
            {/* Content Quality Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Content Quality</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Word Count"
                  value={report.contentQuality.wordCount}
                  description="Total words in content"
                />
                <MetricCard
                  title="Readability Score"
                  value={Math.round(report.contentQuality.readabilityScore)}
                  description="Flesch-Kincaid Grade Level"
                />
                <MetricCard
                  title="Primary Keyword"
                  value={report.contentQuality.keywordAnalysis.primaryKeyword || 'None detected'}
                  description={`Density: ${report.contentQuality.keywordAnalysis.density.toFixed(2)}%`}
                />
              </div>
            </div>
            
            {/* Security Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="HTTPS"
                  value={report.security.https ? 'Enabled' : 'Not Enabled'}
                  status={report.security.https ? 'good' : 'poor'}
                />
                <MetricCard
                  title="Security Headers"
                  value={report.security.securityHeaders.length}
                  description={report.security.securityHeaders.join(', ') || 'None detected'}
                />
                <MetricCard
                  title="Mixed Content"
                  value={report.security.mixedContent ? 'Detected' : 'None'}
                  status={report.security.mixedContent ? 'poor' : 'good'}
                />
              </div>
            </div>
            
            {/* Structured Data Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Structured Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Schema Types"
                  value={report.structuredData.schemaTypes.length}
                  description={report.structuredData.schemaTypes.join(', ') || 'None detected'}
                />
                <MetricCard
                  title="Quality Score"
                  value={report.structuredData.qualityScore}
                  description="Based on schema completeness"
                />
              </div>
            </div>
            
            {/* Competitor Insights Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Competitor Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="SERP Features"
                  value={report.competitors.serpFeatures.length}
                  description={report.competitors.serpFeatures.join(', ') || 'None detected'}
                />
                <MetricCard
                  title="Estimated Backlinks"
                  value={report.competitors.estimatedBacklinks}
                  description="Relative to top competitors"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {report.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-[var(--text-200)]">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section for Detailed SEO Report */}
          <div id="detailed-seo-cta" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 sm:p-8 mt-8 text-white">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                Want a More Comprehensive Analysis?
              </h3>
              <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
                This free report gives you a great overview, but there's so much more we can uncover! Get a detailed,
                professional SEO audit with competitor analysis, keyword opportunities, and a custom action plan.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h4 className="font-semibold" style={{ color: '#1f2937' }}>Deep Analysis</h4>
                  </div>
                  <p className="text-sm" style={{ color: '#374151' }}>Complete technical audit, content analysis, and performance review</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h4 className="font-semibold" style={{ color: '#1f2937' }}>Competitor Insights</h4>
                  </div>
                  <p className="text-sm" style={{ color: '#374151' }}>See what your competitors are doing right and find opportunities</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h4 className="font-semibold" style={{ color: '#1f2937' }}>Action Plan</h4>
                  </div>
                  <p className="text-sm" style={{ color: '#374151' }}>Step-by-step roadmap to improve your search rankings</p>
                </div>
              </div>

              <button
                id="detailed-seo-cta-button"
                onClick={handleOpenPopup}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                Get Your Detailed SEO Report
              </button>
              
              <p className="text-sm text-blue-200 mt-4">
                ✨ Free consultation included • 📧 Delivered within 24 hours • 🚀 No obligations
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Detailed SEO Report Popup */}
      <DetailedSEOReportPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        websiteUrl={report?.url}
      />
    </div>
  );
}
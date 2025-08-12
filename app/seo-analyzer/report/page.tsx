"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SEOReport } from '@/app/api/seo-analyzer/route';
import NavBar from '@/app/components/NavBar';
import Link from 'next/link';

export default function SEOReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<SEOReport | null>(null);
  const [loading, setLoading] = useState(true);

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

  const ScoreMeter = ({ score }: { score: number }) => {
    let color = 'bg-[var(--accent-red)]';
    if (score >= 80) color = 'bg-[var(--accent-green)]';
    else if (score >= 60) color = 'bg-[var(--primary-300)]';
    
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-lg font-semibold text-[var(--text-100)]">SEO Score</span>
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

  const MetricCard = ({ title, value, description }: {
    title: string;
    value: string | number;
    description?: string
  }) => (
    <div className="bg-[var(--bg-100)] p-4 rounded-lg shadow-sm border border-[var(--bg-300)]">
      <h3 className="text-sm font-medium text-[var(--text-300)]" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>{title}</h3>
      <p className="text-xl font-semibold mt-1 text-[var(--text-100)]" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>{value}</p>
      {description && <p className="text-sm text-[var(--text-300)] mt-1" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>{description}</p>}
    </div>
  );

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
      <NavBar />
      <main className="min-h-screen bg-[var(--background)] pt-16" role="main">
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
            <ScoreMeter score={report.score} />
            
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
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-100)]">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {report.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-[var(--text-200)]">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
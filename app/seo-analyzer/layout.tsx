import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Analyzer - Free Website SEO Analysis Tool | Sharp Digital Ireland',
  description: 'Analyze your website\'s SEO performance with our free SEO analyzer tool. Check title tags, meta descriptions, headings, images, and get actionable recommendations to improve your search rankings.',
  keywords: 'SEO analyzer, website analysis, SEO audit, meta tags, search engine optimization, SEO tools, website checker',
  openGraph: {
    title: 'SEO Analyzer - Free Website SEO Analysis Tool',
    description: 'Get a comprehensive SEO analysis of any website. Check title tags, meta descriptions, headings, images, and receive actionable recommendations.',
    type: 'website',
    url: 'https://sharpdigital.ie/seo-analyzer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Analyzer - Free Website SEO Analysis Tool',
    description: 'Get a comprehensive SEO analysis of any website with actionable recommendations.',
  },
  alternates: {
    canonical: 'https://sharpdigital.ie/seo-analyzer',
  },
};

export default function SEOAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
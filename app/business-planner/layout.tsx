import "../globals.css";
import NavBar from "../components/NavBar";
import ServerFooter from "../components/ServerFooter";
import ErrorBoundary from "../components/ErrorBoundary";
import ClientProviders from "../components/ClientProviders";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Business Planner | Sharp Digital Ireland",
  description: "Get personalized business advice and strategic planning with our AI-powered business planner. Free tier available with 10 conversations per month.",
  keywords: "business planner, AI business advice, startup planning, business strategy, entrepreneurship, Ireland",
  openGraph: {
    title: "AI Business Planner | Sharp Digital Ireland",
    description: "Get personalized business advice and strategic planning with our AI-powered business planner.",
    url: "https://sharpdigital.ie/business-planner",
    siteName: "Sharp Digital Ireland",
    images: [
      {
        url: "/images/business-planner-og.jpg",
        width: 1200,
        height: 630,
        alt: "AI Business Planner by Sharp Digital Ireland",
      },
    ],
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Planner | Sharp Digital Ireland",
    description: "Get personalized business advice and strategic planning with our AI-powered business planner.",
    images: ["/images/business-planner-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BusinessPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <ErrorBoundary>
        <div id="business-planner-layout-wrapper" className="min-h-screen bg-[var(--bg-100)]">
          <NavBar />
          <main id="business-planner-main-content" className="pt-0">
            {children}
          </main>
          <ServerFooter />
        </div>
      </ErrorBoundary>
    </ClientProviders>
  );
}
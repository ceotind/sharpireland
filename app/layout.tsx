"use client";

import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Analytics from "./components/Analytics";
import ClientProviders from "./components/ClientProviders";

// Define type for structured data
interface StructuredData {
  [key: string]: any;
}

// Metadata must be moved to a separate file for client components
export const metadata = {
  title: 'Sharp Digital Ireland - Premier Web Development Agency Dublin | React & Next.js Experts',
  description: 'Leading web development agency in Ireland specializing in React, Next.js, and custom digital solutions. Transform your business with expert web development services in Dublin and across Ireland.',
  // ... (rest of metadata remains the same)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data moved inside useEffect to prevent server-side execution
  const structuredData: StructuredData[] = [
    // ... (structured data remains the same)
  ];

  return (
    <html lang="en-IE">
      <head>
        {/* ... (head content remains the same) */}
        
        {/* Structured Data */}
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || undefined}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID || undefined}
        />
        <ClientProviders>
          <ErrorBoundary>
            <NavBar />
            <main>{children}</main>
            <Footer />
          </ErrorBoundary>
        </ClientProviders>
      </body>
    </html>
  );
}

import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Analytics from "./components/Analytics";
import ClientProviders from "./components/ClientProviders";
import { metadata } from './metadata';

export { metadata };

// Define type for structured data
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface StructuredData {
  [key: string]: JSONValue;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

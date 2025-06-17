import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Analytics from "./components/Analytics";
import type { Metadata } from 'next';
import ClientProviders from "./components/ClientProviders"; // Import the new ClientProviders

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sharp Digital Ireland - Premier Web Development Agency Dublin | React & Next.js Experts',
  description: 'Leading web development agency in Ireland specializing in React, Next.js, and custom digital solutions. Transform your business with expert web development services in Dublin and across Ireland.',
  keywords: 'web development Ireland, React development Dublin, Next.js developers Ireland, custom software development, digital agency Ireland, web design Dublin, full-stack development Ireland, JavaScript development, TypeScript development, UI/UX design Ireland, e-commerce development, mobile app development Ireland, digital transformation services, professional website design Dublin, responsive web design, SEO optimization Ireland, web application development, startup web development Ireland, enterprise web solutions',
  authors: [{ name: 'Sharp Digital Ireland', url: 'https://sharpdigital.in' }],
  creator: 'Sharp Digital Ireland',
  publisher: 'Sharp Digital Ireland',
  category: 'Technology',
  classification: 'Web Development Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sharpdigital.in'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IE': '/',
      'en-GB': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    title: 'Sharp Digital Ireland - Premier Web Development Agency Dublin',
    description: 'Leading web development agency in Ireland specializing in React, Next.js, and custom digital solutions. Expert developers serving Dublin and all of Ireland.',
    url: 'https://sharpdigital.in',
    siteName: 'Sharp Digital Ireland',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sharp Digital Ireland - Web Development Agency Dublin',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Sharp Digital Ireland Logo',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_IE',
    type: 'website',
    countryName: 'Ireland',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sharpdigitalin',
    creator: '@sharpdigitalin',
    title: 'Sharp Digital Ireland - Premier Web Development Agency Dublin',
    description: 'Leading web development agency in Ireland. Expert React, Next.js & custom digital solutions.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  other: {
    'geo.region': 'IE-D',
    'geo.placename': 'Dublin, Ireland',
    'geo.position': '53.3498;-6.2603',
    'ICBM': '53.3498, -6.2603',
    'DC.title': 'Sharp Digital Ireland - Web Development Agency',
    'DC.creator': 'Sharp Digital Ireland',
    'DC.subject': 'Web Development, React, Next.js, Digital Solutions',
    'DC.description': 'Premier web development agency in Ireland specializing in modern web technologies',
    'DC.publisher': 'Sharp Digital Ireland',
    'DC.contributor': 'Sharp Digital Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Service',
    'DC.format': 'text/html',
    'DC.identifier': 'https://sharpdigital.in',
    'DC.language': 'en-IE',
    'DC.coverage': 'Ireland',
    'DC.rights': 'Copyright Sharp Digital Ireland',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://sharpdigital.in/#organization",
      "name": "Sharp Digital Ireland",
      "alternateName": "Sharp Digital",
      "description": "Premier web development agency in Ireland specializing in React, Next.js, and custom digital solutions. Serving Dublin and all of Ireland with expert web development services.",
      "url": "https://sharpdigital.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sharpdigital.in/icon.png",
        "width": 512,
        "height": 512
      },
      "image": [
        "https://sharpdigital.in/sharp.webp",
        "https://sharpdigital.in/sharp_dark.webp"
      ],
      "telephone": "+353-1-XXX-XXXX",
      "email": "hello@sharpdigital.in",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+353-1-XXX-XXXX",
          "contactType": "customer service",
          "areaServed": ["IE", "GB"],
          "availableLanguage": ["English", "Irish"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        },
        {
          "@type": "ContactPoint",
          "email": "hello@sharpdigital.in",
          "contactType": "customer support",
          "areaServed": "IE"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IE",
        "addressRegion": "Leinster",
        "addressLocality": "Dublin",
        "postalCode": "D02",
        "streetAddress": "Dublin, Ireland"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 53.3498,
        "longitude": -6.2603
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Ireland"
        },
        {
          "@type": "City",
          "name": "Dublin"
        },
        {
          "@type": "City",
          "name": "Cork"
        },
        {
          "@type": "City",
          "name": "Galway"
        }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 53.3498,
          "longitude": -6.2603
        },
        "geoRadius": "500000"
      },
      "foundingDate": "2023",
      "numberOfEmployees": "2-10",
      "slogan": "We Craft Digital Experiences",
      "knowsAbout": [
        "Web Development",
        "React Development",
        "Next.js Development",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Full-Stack Development",
        "UI/UX Design",
        "Digital Transformation",
        "E-commerce Development",
        "Mobile App Development",
        "SEO Optimization",
        "Database Design",
        "API Development",
        "Cloud Solutions"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Web Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Web Development",
              "description": "Bespoke web applications built with modern technologies"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "React Development",
              "description": "Expert React.js development for dynamic user interfaces"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Next.js Development",
              "description": "High-performance Next.js applications with SSR and SSG"
            }
          }
        ]
      },
      "sameAs": [
        "https://meet.sharpdigital.in",
        "https://linkedin.com/company/sharp-digital-ireland",
        "https://twitter.com/sharpdigitalin",
        "https://instagram.com/sharpdigitalireland"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "15",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Sarah O'Connor"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Sharp Digital transformed our online presence completely. Their React expertise is unmatched in Ireland."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://sharpdigital.in/#website",
      "url": "https://sharpdigital.in",
      "name": "Sharp Digital Ireland",
      "description": "Premier web development agency in Ireland",
      "publisher": {
        "@id": "https://sharpdigital.in/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://sharpdigital.in/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-IE"
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Web Development Services Ireland",
      "description": "Professional web development services including React, Next.js, and full-stack development for Irish businesses.",
      "provider": {
        "@id": "https://sharpdigital.in/#organization"
      },
      "areaServed": "Ireland",
      "serviceType": "Web Development",
      "category": "Technology Services",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Web Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "React Development",
              "description": "Expert React.js development for modern web applications",
              "category": "Web Development"
            },
            "priceRange": "€€€"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Next.js Development",
              "description": "High-performance Next.js applications with server-side rendering",
              "category": "Web Development"
            },
            "priceRange": "€€€"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Full-Stack Development",
              "description": "Complete web application development from frontend to backend",
              "category": "Web Development"
            },
            "priceRange": "€€€€"
          }
        ]
      }
    }
  ];

  return (
    <html lang="en-IE">
      <head>
        {/* Manifest and PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f51dd" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sharp Digital Ireland" />
        <link rel="apple-touch-icon" href="/icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icon.png" as="image" type="image/png" />
        <link rel="preload" href="/sharp.webp" as="image" type="image/webp" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="Sharp Digital Ireland" />
        <meta name="msapplication-TileColor" content="#0f51dd" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
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
        <ClientProviders> {/* Use ClientProviders to wrap theme and main content */}
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

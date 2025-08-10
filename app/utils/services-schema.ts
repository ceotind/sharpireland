import { WebDevelopmentContent, AppDevelopmentContent, AppMaintenanceContent, SocialMediaContent, GoogleAdsContent, MetaAdsContent, AutomationContent } from "../services/data/services-content";

/**
 * Generates JSON-LD schema for the services page
 */

// Organization schema for Sharp Ireland
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sharp Ireland",
    "url": "https://sharpireland.com",
    "logo": "https://sharpireland.com/logo.webp",
    "sameAs": [
      "https://www.linkedin.com/company/sharp-ireland",
      "https://www.instagram.com/sharpireland",
      "https://twitter.com/SharpIreland"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Digital Avenue",
      "addressLocality": "Dublin",
      "addressRegion": "Dublin",
      "postalCode": "D01 AB12",
      "addressCountry": "IE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+353-1-234-5678",
      "contactType": "customer service",
      "email": "hello@sharpireland.com"
    }
  };
};

// LocalBusiness schema for Dublin, Ireland
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sharp Ireland",
    "image": "https://sharpireland.com/logo.webp",
    "url": "https://sharpireland.com",
    "telephone": "+353-1-234-5678",
    "email": "hello@sharpireland.com",
    "priceRange": "€€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Digital Avenue",
      "addressLocality": "Dublin",
      "addressRegion": "Dublin",
      "postalCode": "D01 AB12",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "53.349805",
      "longitude": "-6.26031"
    },
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "53.349805",
          "longitude": "-6.26031"
        },
        "geoRadius": "50000"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };
};

// WebPage schema for the services page
export const generateWebPageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://sharpireland.com/services",
    "name": "Services by Sharp Ireland",
    "description": "Growth focused services across web, app, marketing and automation",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".services-description"]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sharpireland.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": "https://sharpireland.com/services"
        }
      ]
    }
  };
};

// Service schema for Web Development
export const generateWebDevelopmentSchema = (content: WebDevelopmentContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Web Development",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Professional, responsive, and high-performance websites and web applications",
    "category": "Digital Services"
  };
};

// Service schema for App Development
export const generateAppDevelopmentSchema = (content: AppDevelopmentContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Mobile App Development",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Native and cross-platform mobile applications for iOS and Android",
    "category": "Digital Services"
  };
};

// Service schema for App Maintenance
export const generateAppMaintenanceSchema = (content: AppMaintenanceContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "App Maintenance",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Reliable, secure, and up-to-date web and mobile applications",
    "category": "Digital Services"
  };
};

// FAQ schema for App Maintenance
export const generateAppMaintenanceFAQSchema = (content: AppMaintenanceContent) => {
  const mainEntity = content.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity
  };
};

// Service schema for Social Media Management
export const generateSocialMediaSchema = (content: SocialMediaContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Social Media Management",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Engaging social media presence and community growth across platforms",
    "category": "Digital Marketing"
  };
};

// Service schema for Google Ads Management
export const generateGoogleAdsSchema = (content: GoogleAdsContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Google Ads Management",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "High-performing Google Ads campaigns with measurable ROI",
    "category": "Digital Marketing"
  };
};

// Service schema for Meta Ads Management
export const generateMetaAdsSchema = (content: MetaAdsContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Meta Ads Management",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Targeted Facebook and Instagram ad campaigns that drive engagement and conversions",
    "category": "Digital Marketing"
  };
};

// Service schema for Business Automation
export const generateAutomationSchema = (content: AutomationContent) => {
  const offers = content.features.map(feature => ({
    "@type": "Offer",
    "name": feature.title,
    "description": feature.description
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Business Automation",
    "name": content.title,
    "description": content.description,
    "provider": {
      "@type": "Organization",
      "name": "Sharp Ireland",
      "url": "https://sharpireland.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ireland"
    },
    "offers": offers,
    "termsOfService": "https://sharpireland.com/terms",
    "serviceOutput": "Streamlined business operations and improved efficiency through automation",
    "category": "Business Services"
  };
};

// Generate all schemas for the services page
export const generateAllServicesSchemas = (
  webDevelopmentContent: WebDevelopmentContent,
  appDevelopmentContent: AppDevelopmentContent,
  appMaintenanceContent: AppMaintenanceContent,
  socialMediaContent: SocialMediaContent,
  googleAdsContent: GoogleAdsContent,
  metaAdsContent: MetaAdsContent,
  automationContent: AutomationContent
) => {
  return [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(),
    generateWebPageSchema(),
    generateWebDevelopmentSchema(webDevelopmentContent),
    generateAppDevelopmentSchema(appDevelopmentContent),
    generateAppMaintenanceSchema(appMaintenanceContent),
    generateAppMaintenanceFAQSchema(appMaintenanceContent),
    generateSocialMediaSchema(socialMediaContent),
    generateGoogleAdsSchema(googleAdsContent),
    generateMetaAdsSchema(metaAdsContent),
    generateAutomationSchema(automationContent)
  ];
};
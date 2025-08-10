import React from "react";

// Interfaces for shared components
export interface SectionHeaderData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface FeatureItemData {
  id: string;
  icon: React.ReactNode; // Or string for image path
  title: string;
  description: string;
}

export interface StatItemData {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
}

export interface ProcessStepData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceCTAData {
  id: string;
  primaryText: string;
  secondaryText: string;
  primaryLink: string;
  secondaryLink: string;
}

// Content for ServiceHero
export interface ServiceHeroContent {
  id: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export const serviceHeroContent: ServiceHeroContent = {
  id: "services-hero-section",
  title: "AI powered services for growth",
  subtitle: "Business outcomes driven by modern engineering and marketing",
  primaryCtaText: "Get a Free Consultation",
  primaryCtaLink: "/contact",
  secondaryCtaText: "Explore Our Services",
  secondaryCtaLink: "/services#explore",
};

// Shared CTA content (example)
export const commonCtaContent: ServiceCTAData = {
  id: "common-cta-section",
  primaryText: "Book a Call",
  secondaryText: "Request Proposal",
  primaryLink: "/contact",
  secondaryLink: "/contact#proposal",
};

// --- Phase 2: Core Service Sections Content ---

// Web Development Section
export interface WebDevelopmentContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  brandLogos: string[]; // Array of image paths for the collage
}

export const webDevelopmentContent: WebDevelopmentContent = {
  id: "services-web-dev-section",
  eyebrow: "Engineering excellence",
  title: "Web development services",
  description: "Next.js, React, WordPress, Wix and major frameworks",
  features: [
    {
      id: "web-dev-feature-nextjs",
      icon: "🚀", // Placeholder
      title: "Next.js Apps",
      description: "SSR, SSG, SEO, and performance-optimized applications.",
    },
    {
      id: "web-dev-feature-react",
      icon: "⚛️", // Placeholder
      title: "React SPAs",
      description: "Scalable UIs and interactive single-page applications.",
    },
    {
      id: "web-dev-feature-wordpress",
      icon: "⚙️", // Placeholder
      title: "WordPress",
      description: "Custom themes, Gutenberg, and WooCommerce solutions.",
    },
    {
      id: "web-dev-feature-wix",
      icon: "✨", // Placeholder
      title: "Wix",
      description: "Rapid build and custom section development.",
    },
    {
      id: "web-dev-feature-headless-cms",
      icon: "🔗", // Placeholder
      title: "Headless CMS",
      description: "Contentful, Sanity, and other headless CMS integrations.",
    },
    {
      id: "web-dev-feature-e2e-quality",
      icon: "✅", // Placeholder
      title: "E2E Quality",
      description: "Comprehensive testing, CI/CD, and analytics integration.",
    },
  ],
  brandLogos: [
    "/images/brands/nextjs-icon-svgrepo-com.svg",
    "/images/brands/Logomark_Full Color.svg", // React
    "/images/brands/wordpress-color-svgrepo-com.svg",
    // Add more brand logos as needed from public/images/brands/
  ],
};

// App Development Section
export interface AppDevelopmentContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  // Add properties for device mockups/tabs if needed
}

export const appDevelopmentContent: AppDevelopmentContent = {
  id: "services-app-dev-section",
  eyebrow: "Mobile experience",
  title: "Android and iOS app development",
  description: "Native and cross-platform mobile solutions",
  features: [
    {
      id: "app-dev-feature-android",
      icon: "🤖", // Placeholder
      title: "Native Android",
      description: "High-performance apps using Kotlin.",
    },
    {
      id: "app-dev-feature-ios",
      icon: "🍎", // Placeholder
      title: "Native iOS",
      description: "Seamless experiences with Swift.",
    },
    {
      id: "app-dev-feature-cross-platform",
      icon: "📱", // Placeholder
      title: "Cross-Platform",
      description: "React Native or Flutter for multi-OS reach.",
    },
    {
      id: "app-dev-feature-pwa",
      icon: "🌐", // Placeholder
      title: "Progressive Web Apps",
      description: "Installable web apps with native-like feel.",
    },
  ],
};

// App Maintenance Section
export interface AppMaintenanceContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  processSteps: ProcessStepData[]; // For timeline
  faqs: FAQItemData[];
}

export const appMaintenanceContent: AppMaintenanceContent = {
  id: "services-maintenance-section",
  eyebrow: "Reliability first",
  title: "App maintenance and lifecycle",
  description: "Comprehensive maintenance and support services",
  features: [
    {
      id: "app-maint-feature-performance",
      icon: "⚡", // Placeholder
      title: "Performance Optimization",
      description: "Speed improvements and bug fixes.",
    },
    {
      id: "app-maint-feature-security",
      icon: "🔒", // Placeholder
      title: "Security Patches",
      description: "Regular security updates and vulnerability assessments.",
    },
    {
      id: "app-maint-feature-updates",
      icon: "✨", // Placeholder
      title: "Feature Updates",
      description: "New functionality and user experience improvements.",
    },
    {
      id: "app-maint-feature-monitoring",
      icon: "👁️", // Placeholder
      title: "24x7 Monitoring",
      description: "Continuous monitoring and issue resolution.",
    },
    {
      id: "app-maint-feature-db-backup",
      icon: "💾", // Placeholder
      title: "DB Backups & Restoration",
      description: "Optimization and reliable backup solutions.",
    },
  ],
  processSteps: [
    {
      id: "maint-step-1",
      icon: "🗓️",
      title: "Monthly Checks",
      description: "Routine performance and security audits.",
    },
    {
      id: "maint-step-2",
      icon: "🗓️",
      title: "Quarterly Reviews",
      description: "Feature roadmap and strategic planning.",
    },
    {
      id: "maint-step-3",
      icon: "🛠️",
      title: "On-Demand Support",
      description: "Immediate assistance for critical issues.",
    },
  ],
  faqs: [
    {
      id: "maint-faq-1",
      question: "What does app maintenance include?",
      answer: "Our app maintenance services cover performance optimization, security updates, feature enhancements, 24/7 monitoring, and database management.",
    },
    {
      id: "maint-faq-2",
      question: "How often are updates provided?",
      answer: "We provide regular security patches and feature updates as needed, alongside scheduled monthly and quarterly reviews.",
    },
  ],
};

// --- Phase 3: Marketing Service Sections Content ---

// Social Media Section
export interface SocialMediaContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  stats: {
    id: string;
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
  }[];
  mockPosts: {
    id: string;
    platform: string;
    image: string;
    content: string;
    engagement: string;
    author: string;
  }[];
}

export const socialMediaContent: SocialMediaContent = {
  id: "services-social-section",
  eyebrow: "Brand presence",
  title: "Social media management",
  description: "Strategic content planning and community engagement across all major platforms",
  features: [
    {
      id: "social-feature-strategy",
      icon: "📅", // Placeholder
      title: "Strategy & Calendar",
      description: "Brand-aligned content planning and creation with strategic posting schedules.",
    },
    {
      id: "social-feature-community",
      icon: "💬", // Placeholder
      title: "Community Management",
      description: "Active engagement and customer interaction to build loyal communities.",
    },
    {
      id: "social-feature-platforms",
      icon: "📱", // Placeholder
      title: "Multi-Platform Operations",
      description: "Coordinated presence across Facebook, Instagram, LinkedIn, Twitter, and TikTok.",
    },
    {
      id: "social-feature-analytics",
      icon: "📊", // Placeholder
      title: "Analytics & Reporting",
      description: "Comprehensive performance tracking and actionable insights.",
    },
    {
      id: "social-feature-influencer",
      icon: "🌟", // Placeholder
      title: "Influencer Collaboration",
      description: "Strategic partnerships and campaign management with relevant influencers.",
    },
  ],
  stats: [
    {
      id: "reach",
      label: "Monthly Reach",
      value: 125000,
      prefix: "",
      suffix: "+"
    },
    {
      id: "engagement",
      label: "Engagement Rate",
      value: 8,
      prefix: "",
      suffix: "%"
    },
    {
      id: "growth",
      label: "Follower Growth",
      value: 27,
      prefix: "+",
      suffix: "%"
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: 3.5,
      prefix: "",
      suffix: "%"
    }
  ],
  mockPosts: [
    {
      id: "post-1",
      platform: "Instagram",
      image: "/images/social/instagram-post-1.jpg",
      content: "Elevate your brand with our latest design techniques. #DigitalMarketing #BrandDesign",
      engagement: "1.2k likes • 45 comments",
      author: "Sharp Digital"
    },
    {
      id: "post-2",
      platform: "LinkedIn",
      image: "/images/social/linkedin-post-1.jpg",
      content: "How our clients achieved 43% growth in Q2 through strategic social campaigns.",
      engagement: "89 reactions • 12 comments",
      author: "Sharp Digital"
    },
    {
      id: "post-3",
      platform: "Twitter",
      image: "/images/social/twitter-post-1.jpg",
      content: "Just launched: Our comprehensive guide to social media success in 2025. Download now!",
      engagement: "56 retweets • 112 likes",
      author: "Sharp Digital"
    },
    {
      id: "post-4",
      platform: "Facebook",
      image: "/images/social/facebook-post-1.jpg",
      content: "Join our webinar next Tuesday to learn the secrets of viral content creation.",
      engagement: "78 likes • 23 shares",
      author: "Sharp Digital"
    }
  ]
};

// Google Ads Section
export interface GoogleAdsContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  campaignTypes: {
    id: string;
    name: string;
    description: string;
    metrics: {
      id: string;
      label: string;
      value: number;
      prefix?: string;
      suffix?: string;
      color?: string;
    }[];
  }[];
}

export const googleAdsContent: GoogleAdsContent = {
  id: "services-google-ads-section",
  eyebrow: "Performance marketing",
  title: "Google Ads management",
  description: "Data-driven campaigns that maximize ROI across Search, Display, and Performance Max",
  features: [
    {
      id: "google-ads-feature-keyword",
      icon: "🔍", // Placeholder
      title: "Keyword Research",
      description: "Strategic keyword targeting based on search intent and competition analysis.",
    },
    {
      id: "google-ads-feature-ad-creation",
      icon: "✏️", // Placeholder
      title: "Ad Creation",
      description: "Compelling ad copy and extensions that drive clicks and conversions.",
    },
    {
      id: "google-ads-feature-bid",
      icon: "📊", // Placeholder
      title: "Bid Strategy",
      description: "Automated and manual bidding optimized for your campaign goals.",
    },
    {
      id: "google-ads-feature-conversion",
      icon: "🎯", // Placeholder
      title: "Conversion Tracking",
      description: "Comprehensive tracking setup to measure campaign performance.",
    },
    {
      id: "google-ads-feature-landing",
      icon: "📱", // Placeholder
      title: "Landing Page Optimization",
      description: "Conversion-focused landing pages that turn clicks into customers.",
    },
  ],
  campaignTypes: [
    {
      id: "search",
      name: "Search Campaigns",
      description: "Target users actively searching for your products or services with text ads on Google Search.",
      metrics: [
        {
          id: "impressions",
          label: "Impressions",
          value: 125000,
          suffix: "+",
          color: "var(--bg-300)"
        },
        {
          id: "clicks",
          label: "Clicks",
          value: 7500,
          suffix: "+",
          color: "var(--accent-green-base)"
        },
        {
          id: "ctr",
          label: "CTR",
          value: 6,
          suffix: "%",
          color: "var(--accent-green)"
        },
        {
          id: "cpc",
          label: "Avg. CPC",
          value: 1.85,
          prefix: "$",
          color: "var(--bg-300)"
        },
        {
          id: "conversions",
          label: "Conversions",
          value: 450,
          suffix: "+",
          color: "var(--accent-green)"
        },
        {
          id: "roas",
          label: "ROAS",
          value: 4.2,
          prefix: "",
          suffix: "x",
          color: "var(--accent-green)"
        }
      ]
    },
    {
      id: "display",
      name: "Display Campaigns",
      description: "Reach potential customers with visual ads across millions of websites in the Google Display Network.",
      metrics: [
        {
          id: "impressions",
          label: "Impressions",
          value: 450000,
          suffix: "+",
          color: "var(--bg-300)"
        },
        {
          id: "clicks",
          label: "Clicks",
          value: 9000,
          suffix: "+",
          color: "var(--accent-green-base)"
        },
        {
          id: "ctr",
          label: "CTR",
          value: 2,
          suffix: "%",
          color: "var(--accent-green)"
        },
        {
          id: "cpc",
          label: "Avg. CPC",
          value: 0.75,
          prefix: "$",
          color: "var(--bg-300)"
        },
        {
          id: "conversions",
          label: "Conversions",
          value: 270,
          suffix: "+",
          color: "var(--accent-green)"
        },
        {
          id: "roas",
          label: "ROAS",
          value: 3.8,
          prefix: "",
          suffix: "x",
          color: "var(--accent-green)"
        }
      ]
    },
    {
      id: "pmax",
      name: "Performance Max",
      description: "AI-powered campaigns that show your ads across all Google channels for maximum performance.",
      metrics: [
        {
          id: "impressions",
          label: "Impressions",
          value: 275000,
          suffix: "+",
          color: "var(--bg-300)"
        },
        {
          id: "clicks",
          label: "Clicks",
          value: 8200,
          suffix: "+",
          color: "var(--accent-green-base)"
        },
        {
          id: "ctr",
          label: "CTR",
          value: 3,
          suffix: "%",
          color: "var(--accent-green)"
        },
        {
          id: "cpc",
          label: "Avg. CPC",
          value: 1.25,
          prefix: "$",
          color: "var(--bg-300)"
        },
        {
          id: "conversions",
          label: "Conversions",
          value: 520,
          suffix: "+",
          color: "var(--accent-green)"
        },
        {
          id: "roas",
          label: "ROAS",
          value: 5.1,
          prefix: "",
          suffix: "x",
          color: "var(--accent-green)"
        }
      ]
    }
  ]
};

// Meta Ads Section
export interface MetaAdsContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  creativeCarousel: {
    id: string;
    type: string; // "image", "video", "carousel"
    title: string;
    description: string;
    mediaUrl: string;
    thumbnailUrl?: string;
  }[];
  personaCards: {
    id: string;
    name: string;
    age: string;
    location: string;
    interests: string[];
    behaviors: string[];
    avatar: string;
    backgroundColor: string;
  }[];
}

export const metaAdsContent: MetaAdsContent = {
  id: "services-meta-ads-section",
  eyebrow: "Social ads at scale",
  title: "Meta advertising management",
  description: "Strategic Facebook and Instagram ad campaigns that drive engagement, leads, and sales",
  features: [
    {
      id: "meta-ads-feature-campaigns",
      icon: "📱", // Placeholder
      title: "Facebook & Instagram Campaigns",
      description: "Targeted campaigns across Facebook, Instagram, Messenger, and Audience Network.",
    },
    {
      id: "meta-ads-feature-lookalikes",
      icon: "👥", // Placeholder
      title: "Lookalikes & Retargeting",
      description: "Advanced audience targeting using custom and lookalike audiences.",
    },
    {
      id: "meta-ads-feature-testing",
      icon: "🧪", // Placeholder
      title: "Creative Testing",
      description: "A/B testing of ad creative, copy, and audience segments for optimal performance.",
    },
    {
      id: "meta-ads-feature-budget",
      icon: "💰", // Placeholder
      title: "Budget Pacing",
      description: "Strategic budget allocation and pacing to maximize campaign ROI.",
    },
    {
      id: "meta-ads-feature-pixel",
      icon: "📊", // Placeholder
      title: "Pixel Implementation",
      description: "Proper tracking setup for accurate conversion measurement and optimization.",
    },
    {
      id: "meta-ads-feature-reporting",
      icon: "📈", // Placeholder
      title: "Performance Reporting",
      description: "Comprehensive reporting with actionable insights and recommendations.",
    },
  ],
  creativeCarousel: [
    {
      id: "meta-creative-1",
      type: "image",
      title: "Single Image Ad",
      description: "High-impact visual ads that capture attention in feeds",
      mediaUrl: "/images/ads/meta-image-ad.jpg",
    },
    {
      id: "meta-creative-2",
      type: "video",
      title: "Video Ad",
      description: "Engaging video content that tells your brand story",
      mediaUrl: "/images/ads/meta-video-ad.mp4",
      thumbnailUrl: "/images/ads/meta-video-thumbnail.jpg",
    },
    {
      id: "meta-creative-3",
      type: "carousel",
      title: "Carousel Ad",
      description: "Multiple images or videos in a single ad unit",
      mediaUrl: "/images/ads/meta-carousel-ad.jpg",
    },
    {
      id: "meta-creative-4",
      type: "image",
      title: "Collection Ad",
      description: "Showcase products from your catalog with a main image",
      mediaUrl: "/images/ads/meta-collection-ad.jpg",
    }
  ],
  personaCards: [
    {
      id: "persona-1",
      name: "Urban Professional",
      age: "28-42",
      location: "Major cities",
      interests: ["Technology", "Career growth", "Premium brands", "Fitness"],
      behaviors: ["Mobile shoppers", "Early adopters", "Frequent travelers"],
      avatar: "/images/personas/professional.jpg",
      backgroundColor: "var(--bg-200)"
    },
    {
      id: "persona-2",
      name: "Young Parent",
      age: "25-38",
      location: "Suburban areas",
      interests: ["Parenting", "Home improvement", "Education", "Family activities"],
      behaviors: ["Value seekers", "Research-driven", "Community focused"],
      avatar: "/images/personas/parent.jpg",
      backgroundColor: "var(--bg-200)"
    },
    {
      id: "persona-3",
      name: "Digital Native",
      age: "18-27",
      location: "Mixed urban/suburban",
      interests: ["Social media", "Entertainment", "Fashion", "Gaming"],
      behaviors: ["Trend followers", "Content creators", "Impulse buyers"],
      avatar: "/images/personas/digital-native.jpg",
      backgroundColor: "var(--bg-200)"
    }
  ]
};

// Automation Section
export interface AutomationContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureItemData[];
  workflowNodes: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    position: 'start' | 'middle' | 'end';
    connections: string[]; // IDs of nodes this connects to
  }[];
  industryUseCases: {
    id: string;
    industry: string;
    description: string;
    benefits: string[];
  }[];
}

export const automationContent: AutomationContent = {
  id: "services-automation-section",
  eyebrow: "Scale operations",
  title: "Business and workflow automation",
  description: "Streamline operations and boost efficiency with custom automation solutions",
  features: [
    {
      id: "automation-feature-process",
      icon: "⚙️", // Placeholder
      title: "Process Automation",
      description: "Streamline repetitive tasks and workflows for increased efficiency.",
    },
    {
      id: "automation-feature-crm",
      icon: "👥", // Placeholder
      title: "CRM Integration",
      description: "Seamless customer data flow between systems and touchpoints.",
    },
    {
      id: "automation-feature-email",
      icon: "📧", // Placeholder
      title: "Email & Lead Flows",
      description: "Automated lead nurturing and personalized communication sequences.",
    },
    {
      id: "automation-feature-inventory",
      icon: "📦", // Placeholder
      title: "Inventory Operations",
      description: "Automated stock tracking, ordering, and management systems.",
    },
    {
      id: "automation-feature-finance",
      icon: "💰", // Placeholder
      title: "Finance Automation",
      description: "Streamlined invoicing, payments, and financial reporting.",
    },
    {
      id: "automation-feature-api",
      icon: "🔄", // Placeholder
      title: "API Integrations",
      description: "Connect different business tools and platforms for seamless data flow.",
    },
  ],
  workflowNodes: [
    {
      id: "trigger-customer-action",
      title: "Customer Action",
      description: "Website visit, form submission, or purchase",
      icon: "👤", // Placeholder
      position: "start",
      connections: ["process-data-collection"]
    },
    {
      id: "process-data-collection",
      title: "Data Collection",
      description: "Gather and validate customer information",
      icon: "📊", // Placeholder
      position: "middle",
      connections: ["process-crm-update", "process-segmentation"]
    },
    {
      id: "process-crm-update",
      title: "CRM Update",
      description: "Store customer data and update records",
      icon: "💾", // Placeholder
      position: "middle",
      connections: ["process-segmentation"]
    },
    {
      id: "process-segmentation",
      title: "Segmentation",
      description: "Categorize based on behavior and attributes",
      icon: "🔍", // Placeholder
      position: "middle",
      connections: ["action-email-sequence", "action-notification"]
    },
    {
      id: "action-email-sequence",
      title: "Email Sequence",
      description: "Trigger personalized email campaign",
      icon: "✉️", // Placeholder
      position: "end",
      connections: []
    },
    {
      id: "action-notification",
      title: "Team Notification",
      description: "Alert sales team for follow-up",
      icon: "🔔", // Placeholder
      position: "end",
      connections: []
    }
  ],
  industryUseCases: [
    {
      id: "ecommerce-automation",
      industry: "E-commerce",
      description: "Streamline order processing, inventory management, and customer communications",
      benefits: [
        "Automated order confirmation and shipping updates",
        "Inventory level monitoring and reordering",
        "Abandoned cart recovery sequences",
        "Customer segmentation and personalized recommendations"
      ]
    },
    {
      id: "healthcare-automation",
      industry: "Healthcare",
      description: "Improve patient experience and administrative efficiency",
      benefits: [
        "Automated appointment reminders and scheduling",
        "Patient intake form processing",
        "Insurance verification workflows",
        "Follow-up care coordination"
      ]
    },
    {
      id: "finance-automation",
      industry: "Financial Services",
      description: "Enhance compliance and client service operations",
      benefits: [
        "Automated document collection and verification",
        "Regulatory compliance reporting",
        "Client onboarding workflows",
        "Personalized financial update notifications"
      ]
    },
    {
      id: "manufacturing-automation",
      industry: "Manufacturing",
      description: "Optimize supply chain and production processes",
      benefits: [
        "Automated inventory and materials management",
        "Production scheduling and resource allocation",
        "Quality control alert systems",
        "Supplier communication and order processing"
      ]
    }
  ]
};
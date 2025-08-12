// Icon type definition for components to use
export interface IconConfig {
  name: string;
  size: number;
}

// Interfaces for shared components
export interface SectionHeaderData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface FeatureItemData {
  id: string;
  icon: IconConfig; // Changed from React.ReactNode to IconConfig
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
  icon: IconConfig; // Changed from React.ReactNode to IconConfig
  title: string;
  description: string;
}

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

// New interfaces for enhanced data types
export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  suffix?: string;
  prefix?: string;
  period?: string;
  icon?: string;
}

export interface PlatformData {
  platform: string;
  engagement: number;
  reach: number;
  color: string;
}

export interface RecentPost {
  id: string;
  platform: string;
  content: string;
  engagement: string;
  time: string;
  status: 'published' | 'scheduled' | 'draft';
}

export interface ConversionFunnelStage {
  stage: string;
  value: number;
  percentage: number;
}

export interface PerformanceChartData {
  date: string;
  conversions: number;
  spend: number;
  roas: number;
}

export interface CreativeTest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  variants: CreativeVariant[];
}

export interface CreativeVariant {
  id: string;
  name: string;
  type: 'video' | 'image' | 'carousel';
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
  winning: boolean;
}

export interface AudienceInsight {
  id: string;
  name: string;
  size: string;
  reach: number;
  engagement: number;
  conversions: number;
  performance: 'high' | 'medium' | 'low';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: number;
  conversions: string;
  timesSaved: string;
  active: boolean;
}

export interface Integration {
  name: string;
  category: string;
  connected: boolean;
}

export interface CTAVariant {
  id: string;
  text: string;
  link: string;
  style: 'primary' | 'secondary';
  icon: string;
  description: string;
}

export interface TrustIndicator {
  id: string;
  value: string;
  label: string;
}

export interface SocialProof {
  rating: number;
  reviewCount: number;
  platform: string;
}

export interface ServiceCTAData {
  id: string;
  primaryText: string;
  secondaryText: string;
  primaryLink: string;
  secondaryLink: string;
  ctaVariants?: CTAVariant[];
  trustIndicators?: TrustIndicator[];
  socialProof?: SocialProof;
}

// Enhanced Content for ServiceHero
export interface ServiceHeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  trustIndicators: TrustIndicator[];
  keyHighlights: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
  heroMetrics: DashboardMetric[];
  socialProof: SocialProof;
}

export const serviceHeroContent: ServiceHeroContent = {
  id: "services-hero-section",
  title: "Transform Your Business with Results-Driven Digital Solutions",
  subtitle: "From concept to conversion, we deliver comprehensive digital experiences that drive measurable growth",
  description: "Partner with Sharp Ireland's expert team to accelerate your business growth through cutting-edge web development, strategic marketing, and intelligent automation solutions.",
  primaryCtaText: "Start Your Growth Journey",
  primaryCtaLink: "/contact",
  secondaryCtaText: "View Our Case Studies",
  secondaryCtaLink: "/case-studies",
  
  // Trust indicators for credibility
  trustIndicators: [
    {
      id: "clients-served",
      value: "500+",
      label: "Clients Served"
    },
    {
      id: "projects-delivered",
      value: "1,200+",
      label: "Projects Delivered"
    },
    {
      id: "avg-roi-increase",
      value: "340%",
      label: "Average ROI Increase"
    },
    {
      id: "client-retention",
      value: "95%",
      label: "Client Retention Rate"
    }
  ],
  
  // Key service highlights
  keyHighlights: [
    {
      id: "web-development",
      icon: "Code",
      title: "Web Development",
      description: "Next.js, React, and modern frameworks for high-performance applications"
    },
    {
      id: "digital-marketing",
      icon: "TrendUp",
      title: "Digital Marketing",
      description: "Google Ads, Meta Ads, and social media campaigns that convert"
    },
    {
      id: "automation",
      icon: "Robot",
      title: "Business Automation",
      description: "Streamline operations and boost efficiency with custom workflows"
    },
    {
      id: "app-development",
      icon: "DeviceMobile",
      title: "App Development",
      description: "Native iOS, Android, and cross-platform mobile solutions"
    }
  ],
  
  // Hero dashboard metrics
  heroMetrics: [
    {
      id: "active-projects",
      label: "Active Projects",
      value: 47,
      change: "+12",
      changeType: "positive",
      icon: "Briefcase"
    },
    {
      id: "client-satisfaction",
      label: "Client Satisfaction",
      value: 98,
      suffix: "%",
      change: "+2%",
      changeType: "positive",
      icon: "Smiley"
    },
    {
      id: "avg-project-roi",
      label: "Avg Project ROI",
      value: 285,
      suffix: "%",
      change: "+45%",
      changeType: "positive",
      icon: "ChartLineUp"
    },
    {
      id: "response-time",
      label: "Response Time",
      value: 2,
      suffix: "h",
      change: "-30min",
      changeType: "positive",
      icon: "Clock"
    }
  ],
  
  // Social proof
  socialProof: {
    rating: 4.9,
    reviewCount: 127,
    platform: "Google Reviews"
  }
};

// Enhanced CTA content
export const commonCtaContent: ServiceCTAData = {
  id: "enhanced-cta-section",
  primaryText: "Start Your Growth Journey",
  secondaryText: "Get Free Consultation",
  primaryLink: "/contact",
  secondaryLink: "/contact#consultation",
  
  // Enhanced CTA data
  ctaVariants: [
    {
      id: "primary-cta",
      text: "Start Your Growth Journey",
      link: "/contact",
      style: "primary",
      icon: "ArrowRight",
      description: "Book a strategy call with our experts"
    },
    {
      id: "secondary-cta",
      text: "Get Free Consultation",
      link: "/contact#consultation",
      style: "secondary",
      icon: "Calendar",
      description: "30-minute free consultation call"
    }
  ],
  
  // Trust indicators
  trustIndicators: [
    {
      id: "clients-served",
      value: "500+",
      label: "Clients Served"
    },
    {
      id: "projects-completed",
      value: "1,200+",
      label: "Projects Completed"
    },
    {
      id: "avg-roi",
      value: "340%",
      label: "Average ROI"
    }
  ],
  
  // Social proof
  socialProof: {
    rating: 4.9,
    reviewCount: 127,
    platform: "Google Reviews"
  }
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
      icon: { name: "Rocket", size: 32 },
      title: "Next.js Apps",
      description: "SSR, SSG, SEO, and performance-optimized applications.",
    },
    {
      id: "web-dev-feature-react",
      icon: { name: "Atom", size: 32 },
      title: "React SPAs",
      description: "Scalable UIs and interactive single-page applications.",
    },
    {
      id: "web-dev-feature-wordpress",
      icon: { name: "Gear", size: 32 },
      title: "WordPress",
      description: "Custom themes, Gutenberg, and WooCommerce solutions.",
    },
    {
      id: "web-dev-feature-wix",
      icon: { name: "Sparkle", size: 32 },
      title: "Wix",
      description: "Rapid build and custom section development.",
    },
    {
      id: "web-dev-feature-headless-cms",
      icon: { name: "Link", size: 32 },
      title: "Headless CMS",
      description: "Contentful, Sanity, and other headless CMS integrations.",
    },
    {
      id: "web-dev-feature-e2e-quality",
      icon: { name: "CheckCircle", size: 32 },
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
      icon: { name: "AndroidLogo", size: 32 },
      title: "Native Android",
      description: "High-performance apps using Kotlin.",
    },
    {
      id: "app-dev-feature-ios",
      icon: { name: "AppleLogo", size: 32 },
      title: "Native iOS",
      description: "Seamless experiences with Swift.",
    },
    {
      id: "app-dev-feature-cross-platform",
      icon: { name: "DeviceMobile", size: 32 },
      title: "Cross-Platform",
      description: "React Native or Flutter for multi-OS reach.",
    },
    {
      id: "app-dev-feature-pwa",
      icon: { name: "Globe", size: 32 },
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
      icon: { name: "Lightning", size: 32 },
      title: "Performance Optimization",
      description: "Speed improvements and bug fixes.",
    },
    {
      id: "app-maint-feature-security",
      icon: { name: "Lock", size: 32 },
      title: "Security Patches",
      description: "Regular security updates and vulnerability assessments.",
    },
    {
      id: "app-maint-feature-updates",
      icon: { name: "Sparkle", size: 32 },
      title: "Feature Updates",
      description: "New functionality and user experience improvements.",
    },
    {
      id: "app-maint-feature-monitoring",
      icon: { name: "Eye", size: 32 },
      title: "24x7 Monitoring",
      description: "Continuous monitoring and issue resolution.",
    },
    {
      id: "app-maint-feature-db-backup",
      icon: { name: "FloppyDisk", size: 32 },
      title: "DB Backups & Restoration",
      description: "Optimization and reliable backup solutions.",
    },
  ],
  processSteps: [
    {
      id: "maint-step-1",
      icon: { name: "Calendar", size: 32 },
      title: "Monthly Checks",
      description: "Routine performance and security audits.",
    },
    {
      id: "maint-step-2",
      icon: { name: "Calendar", size: 32 },
      title: "Quarterly Reviews",
      description: "Feature roadmap and strategic planning.",
    },
    {
      id: "maint-step-3",
      icon: { name: "Gear", size: 32 },
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
  dashboardMetrics: DashboardMetric[];
  platformData: PlatformData[];
  recentPosts: RecentPost[];
  features: FeatureItemData[];
}

export const socialMediaContent: SocialMediaContent = {
  id: "services-social-section",
  eyebrow: "Brand presence",
  title: "Social media management that drives engagement",
  description: "Strategic content planning and community engagement across all major platforms with data-driven insights",
  
  // Dashboard mockup data
  dashboardMetrics: [
    {
      id: "total-reach",
      label: "Total Reach",
      value: 125000,
      change: "+23%",
      changeType: "positive",
      icon: "Users"
    },
    {
      id: "engagement-rate",
      label: "Engagement Rate",
      value: 8.4,
      suffix: "%",
      change: "+1.2%",
      changeType: "positive",
      icon: "Heart"
    },
    {
      id: "follower-growth",
      label: "Follower Growth",
      value: 2847,
      change: "+15%",
      changeType: "positive",
      icon: "TrendUp"
    },
    {
      id: "content-published",
      label: "Content Published",
      value: 156,
      change: "+8",
      changeType: "positive",
      icon: "FileText"
    }
  ],
  
  // Platform performance chart data
  platformData: [
    { platform: "Instagram", engagement: 85, reach: 45000, color: "#E4405F" },
    { platform: "Facebook", engagement: 72, reach: 38000, color: "#1877F2" },
    { platform: "LinkedIn", engagement: 91, reach: 28000, color: "#0A66C2" },
    { platform: "Twitter", engagement: 68, reach: 14000, color: "#1DA1F2" }
  ],
  
  // Recent posts for dashboard
  recentPosts: [
    {
      id: "post-1",
      platform: "Instagram",
      content: "New product launch campaign",
      engagement: "1.2k likes",
      time: "2h ago",
      status: "published"
    },
    {
      id: "post-2",
      platform: "LinkedIn",
      content: "Industry insights article",
      engagement: "89 reactions",
      time: "4h ago",
      status: "published"
    },
    {
      id: "post-3",
      platform: "Facebook",
      content: "Behind the scenes video",
      engagement: "456 views",
      time: "6h ago",
      status: "scheduled"
    }
  ],
  
  features: [
    {
      id: "social-feature-strategy",
      icon: { name: "Calendar", size: 32 },
      title: "Content Strategy & Planning",
      description: "Data-driven content calendars with optimal posting schedules and audience insights."
    },
    {
      id: "social-feature-community",
      icon: { name: "ChatCircle", size: 32 },
      title: "Community Management",
      description: "Active engagement and customer interaction to build loyal brand communities."
    },
    {
      id: "social-feature-analytics",
      icon: { name: "ChartBar", size: 32 },
      title: "Performance Analytics",
      description: "Comprehensive tracking and reporting with actionable growth insights."
    },
    {
      id: "social-feature-automation",
      icon: { name: "Robot", size: 32 },
      title: "Smart Automation",
      description: "Automated posting, response management, and lead qualification systems."
    }
  ]
};

// Google Ads Section
export interface GoogleAdsContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  dashboardMetrics: DashboardMetric[];
  conversionFunnel: ConversionFunnelStage[];
  performanceChart: PerformanceChartData[];
  campaignTypes: {
    id: string;
    name: string;
    description: string;
    active: boolean;
  }[];
  features: FeatureItemData[];
}

export const googleAdsContent: GoogleAdsContent = {
  id: "services-google-ads-section",
  eyebrow: "Performance marketing",
  title: "Google Ads that deliver measurable ROI",
  description: "Data-driven campaigns optimized for conversions across Search, Display, and Performance Max",
  
  // Dashboard metrics for current campaign
  dashboardMetrics: [
    {
      id: "total-conversions",
      label: "Total Conversions",
      value: 1247,
      change: "+18%",
      changeType: "positive",
      period: "This month"
    },
    {
      id: "roas",
      label: "Return on Ad Spend",
      value: 4.2,
      suffix: "x",
      change: "+0.8x",
      changeType: "positive",
      period: "This month"
    },
    {
      id: "cpc",
      label: "Avg. Cost Per Click",
      value: 1.85,
      prefix: "$",
      change: "-$0.23",
      changeType: "positive",
      period: "This month"
    },
    {
      id: "ctr",
      label: "Click-Through Rate",
      value: 6.8,
      suffix: "%",
      change: "+1.2%",
      changeType: "positive",
      period: "This month"
    }
  ],
  
  // Conversion funnel data
  conversionFunnel: [
    { stage: "Impressions", value: 125000, percentage: 100 },
    { stage: "Clicks", value: 8500, percentage: 6.8 },
    { stage: "Landing Page Views", value: 7650, percentage: 90 },
    { stage: "Conversions", value: 1247, percentage: 16.3 }
  ],
  
  // Campaign performance over time
  performanceChart: [
    { date: "Week 1", conversions: 280, spend: 2400, roas: 3.8 },
    { date: "Week 2", conversions: 320, spend: 2600, roas: 4.1 },
    { date: "Week 3", conversions: 295, spend: 2300, roas: 4.3 },
    { date: "Week 4", conversions: 352, spend: 2700, roas: 4.5 }
  ],
  
  campaignTypes: [
    {
      id: "search",
      name: "Search Campaigns",
      description: "Target high-intent users actively searching for your products or services",
      active: true
    },
    {
      id: "display",
      name: "Display Network",
      description: "Reach potential customers across millions of websites with visual ads",
      active: false
    },
    {
      id: "pmax",
      name: "Performance Max",
      description: "AI-powered campaigns across all Google channels for maximum reach",
      active: false
    }
  ],
  
  features: [
    {
      id: "google-ads-feature-keyword",
      icon: { name: "MagnifyingGlass", size: 32 },
      title: "Strategic Keyword Research",
      description: "Advanced keyword targeting based on search intent and competitive analysis."
    },
    {
      id: "google-ads-feature-optimization",
      icon: { name: "ChartLineUp", size: 32 },
      title: "Continuous Optimization",
      description: "AI-driven bid management and ad optimization for maximum ROI performance."
    },
    {
      id: "google-ads-feature-tracking",
      icon: { name: "Target", size: 32 },
      title: "Advanced Conversion Tracking",
      description: "Comprehensive tracking setup to measure every aspect of campaign performance."
    },
    {
      id: "google-ads-feature-reporting",
      icon: { name: "PresentationChart", size: 32 },
      title: "Detailed Performance Reports",
      description: "Clear, actionable reports with insights and recommendations for growth."
    }
  ]
};

// Meta Ads Section
export interface MetaAdsContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  creativeTests: CreativeTest[];
  audienceInsights: AudienceInsight[];
  platformBreakdown: {
    platform: string;
    impressions: number;
    conversions: number;
    cpa: number;
  }[];
  features: FeatureItemData[];
}

export const metaAdsContent: MetaAdsContent = {
  id: "services-meta-ads-section",
  eyebrow: "Social advertising",
  title: "Meta ads that convert audiences into customers",
  description: "Strategic Facebook and Instagram campaigns with advanced targeting and creative optimization",
  
  // A/B testing dashboard data
  creativeTests: [
    {
      id: "test-1",
      name: "Product Launch Campaign",
      status: "active",
      variants: [
        {
          id: "variant-a",
          name: "Variant A - Video",
          type: "video",
          impressions: 45000,
          clicks: 1800,
          ctr: 4.0,
          conversions: 72,
          cpa: 25.50,
          winning: true
        },
        {
          id: "variant-b",
          name: "Variant B - Carousel",
          type: "carousel",
          impressions: 43000,
          clicks: 1550,
          ctr: 3.6,
          conversions: 58,
          cpa: 31.20,
          winning: false
        }
      ]
    }
  ],
  
  // Audience insights data
  audienceInsights: [
    {
      id: "audience-1",
      name: "Lookalike Audience",
      size: "2.1M",
      reach: 450000,
      engagement: 8.2,
      conversions: 156,
      performance: "high"
    },
    {
      id: "audience-2",
      name: "Interest-Based",
      size: "1.8M",
      reach: 380000,
      engagement: 6.8,
      conversions: 124,
      performance: "medium"
    },
    {
      id: "audience-3",
      name: "Retargeting",
      size: "85K",
      reach: 65000,
      engagement: 12.4,
      conversions: 89,
      performance: "high"
    }
  ],
  
  // Platform performance breakdown
  platformBreakdown: [
    { platform: "Facebook Feed", impressions: 125000, conversions: 245, cpa: 28.50 },
    { platform: "Instagram Feed", impressions: 98000, conversions: 198, cpa: 31.20 },
    { platform: "Instagram Stories", impressions: 67000, conversions: 134, cpa: 26.80 },
    { platform: "Facebook Stories", impressions: 45000, conversions: 78, cpa: 35.60 }
  ],
  
  features: [
    {
      id: "meta-ads-feature-targeting",
      icon: { name: "Crosshair", size: 32 },
      title: "Advanced Audience Targeting",
      description: "Precision targeting using custom audiences, lookalikes, and behavioral data."
    },
    {
      id: "meta-ads-feature-creative",
      icon: { name: "Palette", size: 32 },
      title: "Creative Optimization",
      description: "A/B testing of ad formats, copy, and visuals for maximum engagement."
    },
    {
      id: "meta-ads-feature-automation",
      icon: { name: "Robot", size: 32 },
      title: "Smart Campaign Automation",
      description: "Automated bid optimization and budget allocation across campaigns."
    },
    {
      id: "meta-ads-feature-insights",
      icon: { name: "ChartPie", size: 32 },
      title: "Audience Insights",
      description: "Deep audience analysis and behavioral insights for better targeting."
    }
  ]
};

// Automation Section
export interface AutomationContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  workflowTemplates: WorkflowTemplate[];
  automationMetrics: DashboardMetric[];
  integrations: Integration[];
  features: FeatureItemData[];
}

export const automationContent: AutomationContent = {
  id: "services-automation-section",
  eyebrow: "Process optimization",
  title: "Business automation that scales with you",
  description: "Custom workflow automation solutions that streamline operations and boost efficiency",
  
  // Workflow builder interface data
  workflowTemplates: [
    {
      id: "lead-nurturing",
      name: "Lead Nurturing Workflow",
      description: "Automated lead qualification and nurturing sequence",
      steps: 6,
      conversions: "23% increase",
      timesSaved: "15 hours/week",
      active: true
    },
    {
      id: "customer-onboarding",
      name: "Customer Onboarding",
      description: "Streamlined new customer welcome and setup process",
      steps: 8,
      conversions: "45% faster onboarding",
      timesSaved: "8 hours/week",
      active: false
    },
    {
      id: "inventory-management",
      name: "Inventory Management",
      description: "Automated stock tracking and reorder notifications",
      steps: 5,
      conversions: "Zero stockouts",
      timesSaved: "12 hours/week",
      active: false
    }
  ],
  
  // Automation metrics
  automationMetrics: [
    {
      id: "time-saved",
      label: "Time Saved Weekly",
      value: 35,
      suffix: " hours",
      change: "+8 hours",
      changeType: "positive"
    },
    {
      id: "processes-automated",
      label: "Processes Automated",
      value: 24,
      change: "+6",
      changeType: "positive"
    },
    {
      id: "error-reduction",
      label: "Error Reduction",
      value: 89,
      suffix: "%",
      change: "+12%",
      changeType: "positive"
    },
    {
      id: "cost-savings",
      label: "Monthly Cost Savings",
      value: 4500,
      prefix: "$",
      change: "+$800",
      changeType: "positive"
    }
  ],
  
  // Integration ecosystem
  integrations: [
    { name: "Salesforce", category: "CRM", connected: true },
    { name: "HubSpot", category: "Marketing", connected: true },
    { name: "Slack", category: "Communication", connected: true },
    { name: "Zapier", category: "Automation", connected: true },
    { name: "Google Workspace", category: "Productivity", connected: false },
    { name: "Microsoft 365", category: "Productivity", connected: false }
  ],
  
  features: [
    {
      id: "automation-feature-workflows",
      icon: { name: "FlowArrow", size: 32 },
      title: "Custom Workflow Design",
      description: "Tailored automation workflows designed specifically for your business processes."
    },
    {
      id: "automation-feature-integrations",
      icon: { name: "Plugs", size: 32 },
      title: "Seamless Integrations",
      description: "Connect all your business tools and platforms for unified data flow."
    },
    {
      id: "automation-feature-monitoring",
      icon: { name: "Monitor", size: 32 },
      title: "Real-time Monitoring",
      description: "24/7 monitoring with instant alerts and performance optimization."
    },
    {
      id: "automation-feature-scaling",
      icon: { name: "TrendUp", size: 32 },
      title: "Scalable Solutions",
      description: "Automation systems that grow and adapt with your business needs."
    }
  ]
};
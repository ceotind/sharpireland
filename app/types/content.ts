export interface Industry {
  slug: string;
  description: string;
  keyPoints: string[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
    openGraph: {
      title: string;
      description: string;
      locale: string;
    };
  };
  hero: {
    heading: string;
    subheading: string;
    ctaButton: string;
    trustedText: string;
    trustedLogos: Array<{
      src: string;
      alt: string;
    }>;
  };
  problems: {
    tagline: string;
    heading: string;
    ctaButton: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  solution: {
    heading: string;
    subheading: string;
    ctaButton: string;
    benefits: {
      title: string;
      items: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    steps: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
  };
  services: {
    heading: string;
    subheading: string;
    items: Array<{
      name: string;
      badge: string;
      description: string;
      features: string[];
    }>;
  };
  whyUs: {
    tagline: string;
    heading: string;
    headingHighlight: string;
    subheading: string;
    reasons: Array<{
      icon: string;
      title: string;
      stat: string;
      description: string;
    }>;
  };
  process: {
    heading: string;
    subheading: string;
    steps: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  testimonials: {
    heading: string;
    subheading: string;
    items: Array<{
      name: string;
      practice: string;
      text: string;
    }>;
  };
  faq: {
    heading: string;
    subheading: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    heading: string;
    subheading: string;
    buttons: {
      primary: {
        text: string;
        action: string;
      };
      secondary: {
        text: string;
        action: string;
      };
    };
    footer: {
      text: string;
    };
  };
}

export type IndustryContent = Industry;
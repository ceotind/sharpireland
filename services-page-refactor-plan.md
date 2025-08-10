# Sharp Ireland Services Page Refactor Plan

## Project Overview

Complete refactor of the services page (`app/services/page.tsx`) to showcase Sharp Ireland's comprehensive digital services with modern design, SEO optimization, and separate components for each service category.

## Service Categories to Implement

### 1. Web Development Services
- **Next.js Development**: Modern React framework for production-ready applications
- **React Development**: Interactive user interfaces and single-page applications
- **WordPress Development**: Custom themes, plugins, and CMS solutions
- **Wix Development**: Professional website design and customization
- **Other Major Frameworks**: Vue.js, Angular, Svelte, and emerging technologies

### 2. Mobile App Development Services
- **Android Development**: Native Android apps using Kotlin/Java
- **iOS Development**: Native iOS apps using Swift/Objective-C
- **Cross-Platform Development**: React Native, Flutter for multi-platform solutions
- **Progressive Web Apps (PWAs)**: Web apps with native-like experience

### 3. App Maintenance Services
- **Performance Optimization**: Speed improvements and bug fixes
- **Security Updates**: Regular security patches and vulnerability assessments
- **Feature Updates**: New functionality and user experience improvements
- **Technical Support**: 24/7 monitoring and issue resolution
- **Database Management**: Optimization and backup solutions

### 4. Social Media Management
- **Content Strategy**: Brand-aligned content planning and creation
- **Community Management**: Engagement and customer interaction
- **Social Media Analytics**: Performance tracking and insights
- **Multi-Platform Management**: Facebook, Instagram, LinkedIn, Twitter, TikTok
- **Influencer Collaboration**: Partnership strategies and campaign management

### 5. Google Ads Management
- **Campaign Strategy**: Keyword research and targeting optimization
- **Ad Creation**: Compelling ad copy and creative development
- **Bid Management**: Cost-effective bidding strategies
- **Performance Tracking**: ROI analysis and conversion optimization
- **Landing Page Optimization**: Conversion-focused page design

### 6. Meta Ads Management
- **Facebook Advertising**: Targeted campaigns for brand awareness and conversions
- **Instagram Advertising**: Visual storytelling and engagement campaigns
- **Audience Targeting**: Demographic and behavioral targeting strategies
- **Creative Development**: Eye-catching visuals and video content
- **A/B Testing**: Campaign optimization through systematic testing

### 7. Business Automation & Workflow
- **Process Automation**: Streamlining repetitive business tasks
- **CRM Integration**: Customer relationship management solutions
- **Email Marketing Automation**: Drip campaigns and lead nurturing
- **Inventory Management**: Automated stock tracking and ordering
- **Financial Automation**: Invoicing, payments, and reporting systems
- **API Integrations**: Connecting different business tools and platforms

## Technical Implementation Plan

### Architecture & Structure

#### New File Structure
```
app/services/
├── page.tsx (main services page)
├── components/
│   ├── ServiceHero.tsx
│   ├── WebDevelopmentSection.tsx
│   ├── AppDevelopmentSection.tsx
│   ├── AppMaintenanceSection.tsx
│   ├── SocialMediaSection.tsx
│   ├── GoogleAdsSection.tsx
│   ├── MetaAdsSection.tsx
│   ├── AutomationSection.tsx
│   ├── ServiceCard.tsx (enhanced)
│   ├── ServiceFeature.tsx
│   └── ServiceCTA.tsx
└── data/
    └── services-content.ts
```

#### Component Design Patterns
- **Consistent Section Structure**: Each service section follows the same layout pattern
- **Reusable Components**: ServiceCard, ServiceFeature, and ServiceCTA for consistency
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Animation Integration**: GSAP animations consistent with site-wide standards (0.6s duration, power2.out easing)

### SEO Optimization Strategy

#### Technical SEO Implementation
- **Structured Data**: JSON-LD schema markup for each service category
- **Meta Tags**: Optimized title, description, and Open Graph tags
- **Semantic HTML**: Proper heading hierarchy (H1, H2, H3) and semantic elements
- **Internal Linking**: Strategic links to relevant case studies and contact pages
- **Page Speed**: Optimized images, lazy loading, and efficient code splitting

#### Content SEO Strategy
- **Keyword Optimization**: Target high-value service-related keywords
- **Local SEO**: Dublin, Ireland location targeting for local services
- **Long-tail Keywords**: Specific service combinations and industry terms
- **Featured Snippets**: FAQ sections and structured content for snippet optimization
- **AI Search Optimization**: Content structured for AI-powered search results

#### Schema Markup Implementation
```typescript
// Service schema for each category
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Web Development Services",
  "provider": {
    "@type": "Organization",
    "name": "Sharp Ireland",
    "url": "https://sharpireland.com"
  },
  "serviceType": "Web Development",
  "areaServed": "Ireland",
  "description": "Professional web development services...",
  "offers": [
    {
      "@type": "Offer",
      "name": "Next.js Development",
      "description": "Modern React framework development"
    }
  ]
}
```

### Content Strategy

#### Service Section Content Structure
Each service section will include:
1. **Hero/Introduction**: Brief overview and value proposition
2. **Key Features**: 3-4 main service offerings with icons
3. **Benefits**: Why choose Sharp Ireland for this service
4. **Technologies/Tools**: Relevant tech stack or platforms
5. **Process Overview**: How we deliver the service
6. **Case Studies/Examples**: Brief success stories or examples
7. **Call-to-Action**: Contact form or consultation booking

#### Content Tone & Messaging
- **Professional yet Approachable**: Technical expertise with clear communication
- **Results-Focused**: Emphasis on business outcomes and ROI
- **Local Expertise**: Highlighting Irish market knowledge and presence
- **Innovation-Driven**: Showcasing cutting-edge technologies and approaches

### Design System Integration

#### Visual Design Elements
- **Color System**: Consistent use of CSS variables (--bg-100, --text-100, etc.)
- **Typography**: Proper font hierarchy using Anton for headings, Inter for body text
- **Spacing**: Consistent padding and margins following site-wide patterns
- **Icons**: Custom SVG icons for each service category
- **Imagery**: Professional service-related images and illustrations

#### Interactive Elements
- **Hover Effects**: Subtle animations on service cards and buttons
- **Scroll Animations**: GSAP-powered reveal animations as sections come into view
- **Progressive Disclosure**: Expandable sections for detailed service information
- **Loading States**: Smooth transitions and loading indicators

### Performance Optimization

#### Core Web Vitals Optimization
- **Largest Contentful Paint (LCP)**: Optimized hero section loading
- **First Input Delay (FID)**: Minimal JavaScript blocking
- **Cumulative Layout Shift (CLS)**: Stable layouts with proper image sizing

#### Technical Performance
- **Code Splitting**: Lazy loading of service components
- **Image Optimization**: WebP format with fallbacks, proper sizing
- **Font Loading**: Optimized font loading strategies
- **Bundle Size**: Minimal dependencies and tree shaking

### Accessibility Implementation

#### WCAG 2.1 AA Compliance
- **Semantic HTML**: Proper heading structure and landmark elements
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: Sufficient contrast ratios for all text
- **Focus Management**: Clear focus indicators and logical tab order

### Mobile-First Responsive Design

#### Breakpoint Strategy
- **Mobile (320px+)**: Single column layout, stacked service cards
- **Tablet (768px+)**: Two-column grid, enhanced navigation
- **Desktop (1024px+)**: Multi-column layouts, side-by-side content
- **Large Desktop (1440px+)**: Maximum width containers, optimal spacing

#### Touch Optimization
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Gesture Support**: Swipe navigation for service carousels
- **Mobile-Specific Features**: Click-to-call buttons, mobile-optimized forms

## Content Research & Development

### Industry Best Practices Research
- **Competitor Analysis**: Review top digital agencies' service pages
- **Industry Standards**: Current best practices for service presentation
- **User Experience Research**: Optimal information architecture for service discovery

### Service-Specific Content Development

#### Web Development Services Content
- **Next.js Benefits**: Server-side rendering, performance, SEO advantages
- **React Ecosystem**: Component libraries, state management, testing
- **WordPress Capabilities**: Custom development, e-commerce, maintenance
- **Framework Comparison**: When to use different technologies

#### Mobile App Development Content
- **Platform Considerations**: Native vs. cross-platform development
- **App Store Optimization**: Getting apps discovered and downloaded
- **User Experience Design**: Mobile-first design principles
- **Performance Optimization**: App speed and battery efficiency

#### Digital Marketing Services Content
- **ROI-Focused Messaging**: Measurable results and business impact
- **Platform-Specific Strategies**: Tailored approaches for each platform
- **Analytics and Reporting**: Transparent performance tracking
- **Industry Expertise**: Sector-specific marketing knowledge

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Create new component structure
- [ ] Implement ServiceHero component
- [ ] Set up services content data structure
- [ ] Implement basic responsive layout

### Phase 2: Core Services (Week 2)
- [ ] Implement WebDevelopmentSection component
- [ ] Implement AppDevelopmentSection component
- [ ] Implement AppMaintenanceSection component
- [ ] Add GSAP animations and interactions

### Phase 3: Marketing Services (Week 3)
- [ ] Implement SocialMediaSection component
- [ ] Implement GoogleAdsSection component
- [ ] Implement MetaAdsSection component
- [ ] Implement AutomationSection component

### Phase 4: SEO & Optimization (Week 4)
- [ ] Add structured data markup
- [ ] Implement meta tags and Open Graph
- [ ] Optimize for Core Web Vitals
- [ ] Add accessibility features
- [ ] Performance testing and optimization

### Phase 5: Testing & Launch (Week 5)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] SEO validation
- [ ] Performance benchmarking
- [ ] Launch and monitoring

## Success Metrics

### Technical Metrics
- **Page Load Speed**: < 3 seconds on mobile, < 2 seconds on desktop
- **Core Web Vitals**: All metrics in "Good" range
- **Accessibility Score**: WCAG 2.1 AA compliance
- **SEO Score**: 90+ on Lighthouse SEO audit

### Business Metrics
- **Lead Generation**: Increase in service inquiry form submissions
- **User Engagement**: Time on page, scroll depth, interaction rates
- **Search Rankings**: Improved rankings for target service keywords
- **Conversion Rate**: Service page to contact form conversion

## Risk Mitigation

### Technical Risks
- **Performance Impact**: Careful monitoring of bundle size and loading times
- **Browser Compatibility**: Testing across all target browsers
- **Mobile Experience**: Thorough mobile testing and optimization

### Content Risks
- **SEO Impact**: Gradual rollout with monitoring of search rankings
- **User Experience**: A/B testing of new design elements
- **Brand Consistency**: Review process to ensure brand alignment

## Post-Launch Optimization

### Continuous Improvement
- **Analytics Monitoring**: Regular review of user behavior and performance
- **A/B Testing**: Ongoing optimization of conversion elements
- **Content Updates**: Regular refresh of service offerings and case studies
- **SEO Monitoring**: Tracking of keyword rankings and organic traffic

### Future Enhancements
- **Interactive Elements**: Service calculators, cost estimators
- **Personalization**: Dynamic content based on user behavior
- **Integration**: CRM integration for lead tracking
- **Multilingual Support**: Irish and other language versions

This comprehensive plan ensures the new services page will be a powerful tool for showcasing Sharp Ireland's capabilities while providing an excellent user experience and strong SEO performance.
---

## Design Specification Addendum v1.0

This addendum enhances the implementation plan with a comprehensive, section-by-section design system blueprint. It adheres to the project’s unified CSS variable system, animation standards, and accessibility guidelines. All sections will follow the unique ID policy for parent and child divs per project code rules.

Guiding principles
- Theme tokens: Use semantic CSS variables exclusively
  - Background: var(--bg-100), var(--bg-200), var(--bg-300)
  - Text: var(--text-100), var(--text-200)
  - Accents: var(--accent-green), var(--accent-green-base), var(--white-color)
- Typography: Anton for headings, Inter for body
- Animation standards: GSAP 0.6s duration, 0.1s stagger, power2.out easing
- Unique IDs: Every parent and child container has a unique id attribute
- Layout rhythm: 12-column responsive grid, fluid spacing, clamp() for type
- Accessibility: WCAG 2.1 AA, aria-labels, proper heading order, keyboard support
- Performance: Image optimization, lazy loading, minimal DOM work, transform/opacity animations only
- SEO: H1 once per page, H2 for each service section, descriptive alt and internal links

Proposed new components
- Page-level
  - [ServiceHero.tsx](app/services/components/ServiceHero.tsx)
  - [ServiceCTA.tsx](app/services/components/ServiceCTA.tsx)
- Shared building blocks
  - [SectionHeader.tsx](app/services/components/SectionHeader.tsx)
  - [FeatureGrid.tsx](app/services/components/FeatureGrid.tsx)
  - [StatBar.tsx](app/services/components/StatBar.tsx)
  - [ProcessSteps.tsx](app/services/components/ProcessSteps.tsx)
  - [FAQSlice.tsx](app/services/components/FAQSlice.tsx)
- Service sections
  - [WebDevelopmentSection.tsx](app/services/components/WebDevelopmentSection.tsx)
  - [AppDevelopmentSection.tsx](app/services/components/AppDevelopmentSection.tsx)
  - [AppMaintenanceSection.tsx](app/services/components/AppMaintenanceSection.tsx)
  - [SocialMediaSection.tsx](app/services/components/SocialMediaSection.tsx)
  - [GoogleAdsSection.tsx](app/services/components/GoogleAdsSection.tsx)
  - [MetaAdsSection.tsx](app/services/components/MetaAdsSection.tsx)
  - [AutomationSection.tsx](app/services/components/AutomationSection.tsx)

Mermaid overview
flowchart TD
  A[Services Hero] --> B[Web Development]
  A --> C[App Development]
  A --> D[App Maintenance]
  A --> E[Social Media Handling]
  A --> F[Google Ads]
  A --> G[Meta Ads]
  A --> H[Automation]
  B --> Z[Global CTA]
  C --> Z
  D --> Z
  E --> Z
  F --> Z
  G --> Z
  H --> Z

---

### Page hero design blueprint
Component: [ServiceHero.tsx](app/services/components/ServiceHero.tsx)

- Structure
  - id hero-services
  - Two-column layout on lg+: left copy, right visual collage
  - Safe area container max-w-screen-xl px-6 lg:px-8
- Visual language
  - Background: gradient using var(--bg-100) to var(--bg-200)
  - Subtle banding overlay using repeating-linear-gradient with low opacity
  - Heading: AI powered services for growth
  - Subtext: Business outcomes driven by modern engineering and marketing
- Content hierarchy
  - Announcement chip with availability info
  - H1 main heading
  - Supporting paragraph
  - Primary and secondary CTA buttons
- Interactions
  - Hover scale on buttons
  - Small parallax on right-side tiles
- Animations
  - Entrance for .animate-element from opacity 0, y 24
  - Stagger 0.1, duration 0.6, ease power2.out
- SEO
  - Single H1
  - Canonical and Open Graph at page level
- Accessibility
  - aria-labels on interactive controls
  - Focus outlines, focus-visible styles

---

### Shared section blueprint
Used by all service sections via [SectionHeader.tsx](app/services/components/SectionHeader.tsx) and [FeatureGrid.tsx](app/services/components/FeatureGrid.tsx)

- Container
  - id unique per section root
  - section with padding py-20 md:py-32
  - Background var(--bg-100), border accents var(--bg-300)
- Header
  - Eyebrow: small uppercase, var(--accent-green)
  - H2: main section title, clamp scale
  - P: supporting description, max-w-2xl center
- Feature grid
  - Responsive grid 1 to 3 columns
  - Cards with border var(--bg-300), background var(--bg-100), subtle shadow
  - Icon slot top left, title, description, bullet features
- CTA row
  - Primary: Book a Call
  - Secondary: Request Proposal
- Animations
  - Header elements staggered
  - Feature cards in small rise and fade
- Accessibility
  - Proper heading order starting at H2 for each section

---

## Service sections detailed design

### 1. Web development services
Component: [WebDevelopmentSection.tsx](app/services/components/WebDevelopmentSection.tsx)
- Section meta
  - id services-web-dev
  - Eyebrow: Engineering excellence
  - H2: Web development services
  - Copy: Next.js, React, WordPress, Wix and major frameworks
- Layout
  - Left: copy + features + CTA
  - Right: brand collage using SVG logos layered in a Bento grid
- Feature grid items
  - Next.js apps: SSR, SSG, SEO, performance
  - React SPAs: scalable UIs, component libraries
  - WordPress: custom themes, Gutenberg, WooCommerce
  - Wix: rapid build, custom sections
  - Headless CMS: Contentful, Sanity
  - E2E quality: testing, CI, analytics
- Visual language
  - Use brand icons from public images where available
  - Soft shadows, rounded 2xl radii
- Animations
  - Feature cards: stagger-in
  - Collage tiles: subtle float
- SEO
  - H2 and H3 subheadings per capability
  - Internal links to projects and contact

### 2. App development services
Component: [AppDevelopmentSection.tsx](app/services/components/AppDevelopmentSection.tsx)
- Section meta
  - id services-app-dev
  - Eyebrow: Mobile experience
  - H2: Android and iOS app development
- Layout
  - Device mockups: phone frames showing app screens
  - Tabs to switch Android, iOS, cross platform
- Feature grid
  - Native Android with Kotlin
  - Native iOS with Swift
  - Cross platform React Native or Flutter
  - PWAs for installable web apps
- Visuals
  - Device mockups with gradient overlays
- Animations
  - Tab transitions, device fade-in
- SEO
  - App store optimization notes, performance, security

### 3. App maintenance
Component: [AppMaintenanceSection.tsx](app/services/components/AppMaintenanceSection.tsx)
- Section meta
  - id services-maintenance
  - Eyebrow: Reliability first
  - H2: App maintenance and lifecycle
- Layout
  - Timeline row showing cadence: monthly, quarterly, on-demand
  - Checklist cards for security, performance, backups, monitoring
- Features
  - Performance optimization
  - Security patches
  - Feature updates
  - 24x7 monitoring
  - DB backups and restoration
- Interactions
  - Expandable accordions for scope per plan
- Animations
  - Timeline slide-in, checklist pop
- SEO
  - FAQ slice for common maintenance questions

### 4. Social media handling
Component: [SocialMediaSection.tsx](app/services/components/SocialMediaSection.tsx)
- Section meta
  - id services-social
  - Eyebrow: Brand presence
  - H2: Social media management
- Layout
  - Content planning board visual
  - KPI counters (reach, engagement, growth) with StatBar
- Features
  - Strategy and calendar
  - Community management
  - Multi platform ops
  - Analytics and reporting
  - Influencer collab
- Visuals
  - Grid of mock posts, avatars, reactions
- Interactions
  - Hover reveals post metadata
- Animations
  - Counters animate from 0
- SEO
  - Internal links to contact and case studies

### 5. Google Ads management
Component: [GoogleAdsSection.tsx](app/services/components/GoogleAdsSection.tsx)
- Section meta
  - id services-google-ads
  - Eyebrow: Performance marketing
  - H2: Google Ads management
- Layout
  - Funnel card: impressions to conversions with micro-metric chips
- Features
  - Keyword research
  - Ad creation
  - Bid strategy
  - Conversion tracking
  - Landing page optimization
- Visuals
  - KPI chips with semantic colors
- Interactions
  - Switch views: Search, Display, Performance Max
- Animations
  - Metric chips stagger-in
- SEO
  - Structured copy focusing ROI, CPC, CTR

### 6. Meta Ads management
Component: [MetaAdsSection.tsx](app/services/components/MetaAdsSection.tsx)
- Section meta
  - id services-meta-ads
  - Eyebrow: Social ads at scale
  - H2: Meta advertising management
- Layout
  - Creative carousel with image and short clips
  - Audience persona cards
- Features
  - Facebook and Instagram campaigns
  - Lookalikes and retargeting
  - Creative testing
  - Budget pacing
- Interactions
  - Carousel drag on mobile
- Animations
  - Persona cards float subtly
- SEO
  - Target long tail around campaign goals and sectors

### 7. Automation and workflows
Component: [AutomationSection.tsx](app/services/components/AutomationSection.tsx)
- Section meta
  - id services-automation
  - Eyebrow: Scale operations
  - H2: Business and workflow automation
- Layout
  - Visual pipeline blocks representing triggers and actions
- Features
  - Process automation
  - CRM integration
  - Email and lead flows
  - Inventory ops
  - Finance automation
  - API integrations
- Visuals
  - Node blocks with dashed connectors
- Interactions
  - Hover highlights flow path
- Animations
  - Flow lines draw in on scroll
- SEO
  - Include use cases by industry

---

## CTA patterns
Component: [ServiceCTA.tsx](app/services/components/ServiceCTA.tsx)
- Primary CTA
  - Book a Call button, high-contrast, large target
- Secondary CTA
  - Request Proposal with outline style
- Placement
  - After each section and sticky footer CTA on mobile
- Microcopy
  - Outcome oriented phrases

---

## SEO plan specifics

Metadata implementation
- Use next-seo library patterns at the page level
- Title structure
  - Services by Sharp Ireland
- Description focus
  - Growth focused services across web, app, marketing and automation
- Open Graph
  - type website, social images for services page
- Canonical
  - /services

Structured data
- WebPage JSON LD at page level
- Service JSON LD per section injected server side
- FAQ JSON LD where applicable

Content structure
- H1 at hero only
- H2 per service section
- H3 sub features, FAQs
- Internal links to projects and contact
- Media alt text descriptive and keyword aligned

---

## Accessibility details

- Keyboard navigation
  - All interactive elements focusable in logical order
  - Skip to content link at top
- ARIA
  - Landmarks section, banner, contentinfo
  - aria-expanded on accordions
- Contrast
  - Ensure color choices maintain AA minimums
- Motion
  - Respect prefers reduced motion

---

## Performance considerations

- Images
  - Next Image component, responsive sizes, webp sources
- JS
  - Lazy load non critical sections below fold
  - Defer heavy assets
- CSS
  - Tailwind v4 JIT ensures only used classes
- Animations
  - transform and opacity only, cleanup GSAP contexts

---

## Acceptance criteria per section

General
- Unique IDs for all wrappers and sub containers
- Passes lighthouse accessibility at AA
- Core web vitals green on desktop and mobile
- Valid structured data

Hero
- Renders announcement, heading, subtext, CTAs
- Right visual grid loads with placeholder fallback

Each service section
- Displays header, feature grid, and visual
- Animations trigger once on scroll
- CTA row visible and functional
- Internal link to contact page present

---

## Implementation sequencing update

- Phase 1 updates
  - Create shared components [SectionHeader.tsx](app/services/components/SectionHeader.tsx), [FeatureGrid.tsx](app/services/components/FeatureGrid.tsx), [StatBar.tsx](app/services/components/StatBar.tsx), [ProcessSteps.tsx](app/services/components/ProcessSteps.tsx), [FAQSlice.tsx](app/services/components/FAQSlice.tsx)
  - Implement [ServiceHero.tsx](app/services/components/ServiceHero.tsx)
- Phase 2 updates
  - Implement [WebDevelopmentSection.tsx](app/services/components/WebDevelopmentSection.tsx), [AppDevelopmentSection.tsx](app/services/components/AppDevelopmentSection.tsx), [AppMaintenanceSection.tsx](app/services/components/AppMaintenanceSection.tsx)
- Phase 3 updates
  - Implement [SocialMediaSection.tsx](app/services/components/SocialMediaSection.tsx), [GoogleAdsSection.tsx](app/services/components/GoogleAdsSection.tsx), [MetaAdsSection.tsx](app/services/components/MetaAdsSection.tsx), [AutomationSection.tsx](app/services/components/AutomationSection.tsx)
- Phase 4 updates
  - Add structured data and SEO integrations
  - Performance and accessibility pass

---

## Notes on IDs and code rules

- Every div in every component must have a unique id
- IDs follow kebab case semantic prefixes
  - services-web-dev-root
  - services-web-dev-feature-1
  - services-app-dev-tabs
- Verify uniqueness per rendered component instance
# Sharp Ireland - Architecture Overview

## System Architecture

Sharp Ireland is built as a modern Next.js 15 application with a component-based architecture, featuring advanced animations, comprehensive theming, and responsive design patterns.

### Core Framework Stack
- **Next.js 15.3.2**: React framework with App Router for optimal performance and SEO
- **React 19**: Latest React with concurrent features and optimizations
- **TypeScript 5**: Full type safety throughout the application
- **Tailwind CSS 4**: Utility-first CSS framework with custom design system integration

### Source Code Structure

```
app/
├── components/           # All React components
│   ├── ClientProviders.tsx    # Theme context wrapper
│   ├── ColorShowcase.tsx      # Color system demonstration
│   ├── ContactSection.tsx     # Contact form and information
│   ├── Footer.tsx             # Site footer with social links
│   ├── HeroSection.tsx        # Landing section with comet animation
│   ├── NavBar.tsx             # Navigation with theme toggle
│   ├── ProcessSection.tsx     # Interactive process showcase
│   ├── ProjectsSection.tsx    # Portfolio display
│   ├── SaaSComparisonSection.tsx  # Service comparison matrix
│   ├── TechGridSection.tsx    # Technology showcase grid
│   └── TestimonialsSection.tsx    # Client testimonials carousel
├── context/
│   └── ThemeContext.tsx       # Theme management context
├── utils/
│   ├── colors.ts              # Color system utilities
│   ├── globalStyles.ts        # Global style utilities
│   └── text-utils.ts          # Text processing utilities
├── colors/
│   └── page.tsx               # Color system showcase page
├── globals.css                # Global styles and CSS variables
├── layout.tsx                 # Root layout with providers
└── page.tsx                   # Main homepage composition
```

## Key Technical Decisions

### 1. Component Architecture
- **Single Responsibility**: Each section is a self-contained component
- **Consistent Patterns**: All sections follow the same structural template
- **Reusable Logic**: Shared utilities for animations, colors, and styling
- **Type Safety**: Full TypeScript integration with proper interfaces

### 2. Animation System
- **GSAP 3.13.0**: Professional-grade animation library for complex interactions
- **ScrollTrigger**: Scroll-based animations with performance optimization
- **Canvas Integration**: Custom comet animation using HTML5 Canvas API
- **Performance Focus**: Hardware-accelerated transforms and opacity changes

### 3. Theming Architecture
- **CSS Custom Properties**: Semantic color variables for theme switching
- **React Context**: Centralized theme state management
- **System Integration**: Automatic detection of user's preferred color scheme
- **Smooth Transitions**: Universal transition system for theme changes

### 4. Responsive Design Strategy
- **Mobile-First**: Progressive enhancement from mobile to desktop
- **Fluid Typography**: Dynamic font sizing using clamp() and viewport units
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts
- **Touch Optimization**: Enhanced interactions for mobile devices

## Design Patterns in Use

### Section Component Pattern
Every major section follows this consistent structure:
```tsx
export default function SectionName() {
  return (
    <section id="section-name" className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Header Pattern */}
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            Section Subtitle
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Section Title
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Section description
          </p>
        </div>
        {/* Content */}
      </div>
    </section>
  );
}
```

### Animation Pattern
Consistent GSAP animation setup across components:
```tsx
useEffect(() => {
  const elements = sectionRef.current?.querySelectorAll(".animate-element");
  if (elements) {
    gsap.fromTo(elements, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        }
      }
    );
  }
}, []);
```

### Color System Pattern
Semantic color usage throughout:
```tsx
// ✅ Correct - Uses semantic CSS variables
className="bg-[var(--bg-200)] text-[var(--text-100)] border-[var(--bg-300)]"

// ❌ Incorrect - Hardcoded colors
className="bg-white text-black border-gray-300"
```

## Component Relationships

### Layout Hierarchy
```
RootLayout
├── ClientProviders (Theme Context)
│   ├── NavBar (Fixed header with theme toggle)
│   ├── Main Content
│   │   ├── HeroSection (Landing with comet animation)
│   │   ├── TechGridSection (Technology showcase)
│   │   ├── ProjectsSection (Portfolio display)
│   │   ├── ProcessSection (Interactive process)
│   │   ├── SaaSComparisonSection (Service comparison)
│   │   ├── TestimonialsSection (Client testimonials)
│   │   └── ContactSection (Contact form)
│   └── Footer (Social links and info)
```

### Data Flow
- **Theme State**: Managed by ThemeContext, consumed by all components
- **Animation State**: Local state in each component with GSAP cleanup
- **Form State**: Local state in ContactSection with validation
- **Navigation State**: Managed through Next.js routing and scroll behavior

## Critical Implementation Paths

### 1. Theme Switching Flow
```
User clicks theme toggle → ThemeContext.toggleTheme() → 
localStorage update → HTML class update → CSS variables change → 
Universal transitions apply → All components re-render with new theme
```

### 2. Animation Initialization
```
Component mounts → useEffect triggers → GSAP context created → 
ScrollTrigger registered → Animation timeline setup → 
Cleanup function registered for unmount
```

### 3. Responsive Typography (Hero Section)
```
Component mounts → Measure first line width → 
Binary search for optimal second line font size → 
Apply calculated size → Window resize listener → 
Recalculate on resize
```

### 4. Canvas Animation (Comet)
```
Canvas setup → Mouse move listener → Target position update → 
Animation loop → Tail history tracking → Smooth interpolation → 
Fade effects → Performance optimization
```

## Performance Optimizations

### 1. Animation Performance
- Hardware-accelerated properties (transform, opacity)
- Proper cleanup of GSAP instances and ScrollTriggers
- Efficient canvas rendering with requestAnimationFrame
- Smooth interpolation for comet movement

### 2. Bundle Optimization
- Next.js automatic code splitting
- Dynamic imports for large components
- Tree shaking for unused code
- Font optimization with Fontsource

### 3. Rendering Optimization
- React 19 concurrent features
- Proper dependency arrays in useEffect
- Memoization where appropriate
- Efficient re-renders with theme changes

### 4. Asset Optimization
- WebP images with fallbacks
- Optimized SVG icons
- Efficient font loading strategies
- Minimized CSS with Tailwind purging

## Scalability Considerations

### Adding New Sections
1. Follow the established section component pattern
2. Use the standard container and header structure
3. Implement consistent GSAP animations
4. Ensure theme compatibility with CSS variables
5. Add proper TypeScript interfaces
6. Test responsive behavior across breakpoints

### Extending the Color System
1. Add new variables to globals.css
2. Update colors.ts utility file
3. Document new colors in COLOR_SYSTEM.md
4. Test in both light and dark themes
5. Update Tailwind configuration if needed

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size analysis
- Animation performance profiling
- Memory leak detection
- Cross-browser compatibility testing

This architecture provides a solid foundation for continued development while maintaining consistency, performance, and scalability.
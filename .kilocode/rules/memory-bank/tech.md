# Sharp Ireland - Technology Stack

## Core Technologies

### Framework & Runtime
- **Next.js 15.3.2**: React framework with App Router
  - Server-side rendering and static site generation
  - Automatic code splitting and optimization
  - Built-in performance optimizations
  - Turbopack for fast development builds
- **React 19**: Latest React with concurrent features
  - Concurrent rendering for better performance
  - Automatic batching for state updates
  - Enhanced Suspense capabilities
- **TypeScript 5**: Full type safety
  - Strict type checking enabled
  - Interface definitions for all components
  - Enhanced developer experience with IntelliSense

### Styling & Design
- **Tailwind CSS 4**: Utility-first CSS framework
  - Custom design system integration
  - Responsive design utilities
  - JIT compilation for optimal bundle size
- **CSS Custom Properties**: Theme-aware styling system
  - Semantic color variables (--primary-100, --text-100, etc.)
  - Automatic light/dark mode switching
  - Universal transition system
- **PostCSS**: CSS processing and optimization
  - Autoprefixer for browser compatibility
  - CSS optimization and minification

### Animation & Interactions
- **GSAP 3.13.0**: Professional animation library
  - ScrollTrigger for scroll-based animations
  - Timeline-based animation sequences
  - Hardware-accelerated performance
- **Split-Type 0.3.4**: Advanced text animation capabilities
  - Character and word-level text splitting
  - Enhanced typography animations
- **Canvas API**: Custom interactive graphics
  - Comet particle system with mouse tracking
  - Hardware-accelerated rendering
  - Smooth interpolation and fade effects

### Typography
- **Fontsource Integration**: Optimized font loading
  - **Anton**: Display headings and hero text
  - **Inter**: Body text and UI elements (weights: 400, 500, 600, 700)
  - **Alex Brush**: Decorative script elements
- **Dynamic Font Sizing**: Responsive typography system
  - Clamp() functions for fluid scaling
  - Binary search algorithm for optimal sizing
  - Viewport-based calculations

## Development Tools

### Code Quality & Linting
- **ESLint 9**: Code quality enforcement
  - Next.js specific rules and configurations
  - TypeScript integration
  - Consistent code style enforcement
- **TypeScript Compiler**: Type checking and compilation
  - Strict mode enabled
  - Path mapping for clean imports
  - Interface definitions for all props

### Build & Development
- **Turbopack**: Next.js development server
  - Fast refresh and hot reloading
  - Optimized bundling for development
  - Enhanced developer experience
- **Next.js Build System**: Production optimization
  - Automatic code splitting
  - Image optimization
  - Bundle analysis capabilities

## Architecture Patterns

### State Management
- **React Context**: Theme management
  - ThemeProvider for global theme state
  - localStorage persistence
  - System preference detection
- **Local State**: Component-specific state
  - useState for form inputs and UI state
  - useRef for DOM element references
  - useEffect for side effects and cleanup

### Component Architecture
- **Functional Components**: Modern React patterns
  - Hooks-based state management
  - Custom hooks for reusable logic
  - Proper cleanup and memory management
- **TypeScript Interfaces**: Type safety
  - Props interfaces for all components
  - Utility type definitions
  - Strict type checking

### Performance Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Preloading and optimization
- **Bundle Analysis**: Regular size monitoring

## Development Setup

### Package Management
- **npm**: Package manager with lock file
- **package-lock.json**: Dependency version locking
- **Semantic versioning**: Controlled dependency updates

### Scripts & Commands
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Development Workflow
1. **Local Development**: `npm run dev` with Turbopack
2. **Type Checking**: Continuous TypeScript validation
3. **Linting**: ESLint integration with VS Code
4. **Hot Reloading**: Instant feedback on changes
5. **Build Testing**: Regular production builds

## Technical Constraints

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: ES2020+ features
- **CSS**: Grid, Flexbox, Custom Properties, backdrop-filter
- **Canvas**: HTML5 Canvas API support

### Performance Requirements
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Animation Performance**: 60fps animations with hardware acceleration
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Loading Speed**: Fast initial page load and navigation

### Accessibility Standards
- **WCAG 2.1 AA**: Minimum compliance level
- **Semantic HTML**: Proper element usage
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Sufficient contrast ratios

## Dependencies Overview

### Production Dependencies
```json
{
  "@fontsource/alex-brush": "^5.2.5",
  "@fontsource/anton": "^5.2.5",
  "@fontsource/inter": "^5.2.5",
  "@types/gsap": "^1.20.2",
  "gsap": "^3.13.0",
  "next": "15.3.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "split-type": "^0.3.4"
}
```

### Development Dependencies
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.3.2",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## Tool Usage Patterns

### GSAP Animation Workflow
1. **Component Mount**: Initialize GSAP context
2. **Element Selection**: Query DOM elements
3. **Animation Setup**: Configure timelines and triggers
4. **Cleanup**: Proper disposal on unmount

### Theme System Workflow
1. **Context Provider**: Wrap app with ThemeProvider
2. **State Management**: Theme state in React Context
3. **CSS Variables**: Dynamic color switching
4. **Persistence**: localStorage for user preference

### Responsive Design Workflow
1. **Mobile-First**: Start with mobile styles
2. **Breakpoint Progression**: md: (768px+), lg: (1024px+)
3. **Fluid Typography**: clamp() for responsive text
4. **Container Queries**: Component-level responsiveness

## Future Technology Considerations

### Potential Upgrades
- **React Server Components**: For enhanced performance
- **Streaming SSR**: Improved loading experience
- **Edge Runtime**: Faster global deployment
- **Web Workers**: Offload heavy computations

### Monitoring & Analytics
- **Core Web Vitals**: Performance monitoring
- **Bundle Analyzer**: Size optimization
- **Error Tracking**: Runtime error monitoring
- **User Analytics**: Interaction tracking

This technology stack provides a solid foundation for modern web development with excellent performance, developer experience, and scalability.
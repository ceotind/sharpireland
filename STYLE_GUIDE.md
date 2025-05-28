# Sharp Ireland - Comprehensive Style Guide

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Typography](#typography)
3. [Color System](#color-system)
4. [Layout & Spacing](#layout--spacing)
5. [Component Patterns](#component-patterns)
6. [Animation Guidelines](#animation-guidelines)
7. [Accessibility Standards](#accessibility-standards)
8. [Development Guidelines](#development-guidelines)
9. [File Structure](#file-structure)
10. [Scaling Guidelines](#scaling-guidelines)

---

## Design System Overview

This style guide establishes the foundation for Sharp Ireland's design system, ensuring consistency across all components and enabling efficient scaling of the application.

### Core Principles
1. **Consistency** - All components follow standardized patterns
2. **Accessibility** - WCAG 2.1 AA compliance minimum
3. **Performance** - Optimized animations and efficient CSS
4. **Scalability** - Modular components that can be easily extended
5. **Theme Flexibility** - Seamless light/dark mode switching

---

## Typography

### Font Families
```css
/* Primary Fonts */
--font-anton: 'Anton', sans-serif;     /* Headlines, Hero text */
--font-inter: 'Inter', sans-serif;     /* Body text, UI elements */
--font-brush: 'Alex Brush', cursive;   /* Decorative elements */
```

### Typography Classes
```css
/* Heading Styles */
.heading-big {
  font-family: 'Anton', sans-serif;
  text-transform: uppercase;
  line-height: 0.9;
  /* Use for hero headlines */
}

.heading-standard {
  font-family: 'Anton', sans-serif;
  text-transform: uppercase;
  line-height: 1.1;
  /* Use for section titles */
}
```

### Typography Scale
| Class | Desktop | Mobile | Usage |
|-------|---------|--------|-------|
| `text-4xl md:text-5xl` | 48px/60px | 36px | Section Headlines |
| `text-3xl md:text-4xl` | 36px/48px | 30px | Subsection Headlines |
| `text-xl md:text-2xl` | 20px/24px | 18px | Card Titles |
| `text-base md:text-lg` | 16px/18px | 16px | Body Text |
| `text-sm` | 14px | 14px | Captions, Labels |

### Font Weight Guidelines
- **font-bold (700)** - Headlines, Important CTAs
- **font-semibold (600)** - Subheadings, Button Text
- **font-medium (500)** - Labels, Secondary Text
- **font-normal (400)** - Body Text, Descriptions

---

## Color System

The Sharp Ireland color system uses semantic naming and supports both light and dark themes through CSS custom properties. See `COLOR_SYSTEM.md` for detailed documentation.

### New Color Variables (Recommended)
```css
/* Primary Colors */
--primary-100: Main brand color (Light: #0077C2, Dark: #0085ff)
--primary-200: Secondary brand color (Light: #59a5f5, Dark: #69b4ff)
--primary-300: Light brand color (Light: #c8ffff, Dark: #e0ffff)

/* Accent Colors */
--accent-100: Primary accent (Light: #00BFFF, Dark: #006fff)
--accent-200: Secondary accent (Light: #00619a, Dark: #e1ffff)

/* Text Colors */
--text-100: Primary text (Light: #333333, Dark: #FFFFFF)
--text-200: Secondary text (Light: #5c5c5c, Dark: #9e9e9e)

/* Background Colors */
--bg-100: Main background (Light: #FFFFFF, Dark: #1E1E1E)
--bg-200: Secondary background (Light: #f5f5f5, Dark: #2d2d2d)
--bg-300: Borders/tertiary (Light: #cccccc, Dark: #454545)
```

### Legacy CSS Custom Properties (Still Supported)
```css
/* Theme Variables */
--background-black: Theme-dependent main background (maps to --bg-100)
--background-lighter: Cards, forms, elevated surfaces (maps to --bg-200)
--white-color: Primary text color (maps to --text-100)
--foreground: Primary text (alias for white-color)

/* Border Colors */
--border-dark: Primary borders (maps to --bg-300)
--border-light: Subtle borders (maps to --bg-200)
--border-medium: Medium contrast borders (maps to --bg-300)
--border-darker: High contrast borders (maps to --text-200)

/* Accent Colors */
--accent-green: Primary brand color (#6ADC01 / #52a501)
--accent-blue: Secondary brand color (now uses --primary-100)
--accent-linkedin: LinkedIn brand color (now uses --primary-100)
--accent-email: Email accent color
--accent-whatsapp: WhatsApp brand color
```

### Usage Guidelines
1. **Use semantic variables** - Prefer `--primary-100` over `--accent-blue`
2. **Always use CSS custom properties** - Never hardcode hex values
3. **Background Hierarchy**: `--bg-100` → `--bg-200` → `--bg-300` for elevation
4. **Text Hierarchy**: `--text-100` for primary, `--text-200` for secondary
5. **Test both themes** - Always verify components work in light and dark modes

### Color Combinations
```css
/* Primary Button */
background: var(--primary-100);
color: var(--bg-100);

/* Secondary Button */
background: transparent;
border: 1px solid var(--bg-300);
color: var(--text-100);

/* Elevated Card */
background: var(--bg-200);
border: 1px solid var(--bg-300);
color: var(--text-100);

/* Accent Elements */
background: var(--accent-100);
color: var(--bg-100);
```

---

## Layout & Spacing

### Container System
```css
/* Standard Container - Use for all sections */
.container-standard {
  width: 100%;
  max-width: 1280px; /* max-w-screen-xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}

@media (min-width: 1024px) {
  .container-standard {
    padding: 0 2rem; /* lg:px-8 */
  }
}

/* Narrow Container - Use for forms, focused content */
.container-narrow {
  width: 100%;
  max-width: 768px; /* max-w-screen-md */
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Section Spacing
```css
/* Standard Section Padding */
.section-padding {
  padding: 5rem 0; /* py-20 */
}

@media (min-width: 768px) {
  .section-padding {
    padding: 8rem 0; /* md:py-32 */
  }
}
```

### Component Spacing
| Element | Spacing | Class |
|---------|---------|-------|
| Section to Section | 80px/128px | `py-20 md:py-32` |
| Header to Content | 48px | `gap-12` |
| Card Internal Padding | 32px/40px | `p-8 md:p-10` |
| Form Field Spacing | 24px | `space-y-6` |
| Button Padding | 12px 24px | `px-6 py-3` |

---

## Component Patterns

### Section Header Pattern
**Every section should follow this structure:**
```tsx
<div className="text-center">
  <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
    {subtitle}
  </span>
  <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
    {title}
  </h2>
  <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
    {description}
  </p>
</div>
```

### Card Component Pattern
```tsx
<div className="bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] hover:border-[var(--border-medium)] transition-all duration-300 shadow-sm hover:shadow-md">
  {/* Card Content */}
</div>
```

### Button Patterns
```tsx
/* Primary Button */
<button className="bg-[var(--accent-green)] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 transition-all duration-200">
  {children}
</button>

/* Secondary Button */
<button className="bg-transparent border border-[var(--border-medium)] text-[var(--foreground)] px-6 py-3 rounded-lg font-semibold hover:border-[var(--border-dark)] hover:bg-[var(--background-lighter)] focus:outline-none focus:ring-2 focus:ring-[var(--border-dark)] focus:ring-offset-2 transition-all duration-200">
  {children}
</button>
```

### Form Input Pattern
```tsx
<div>
  <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)] mb-2">
    {label}
  </label>
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
    required={required}
    aria-required={required}
  />
</div>
```

---

## Animation Guidelines

### Transition Standards
```css
/* Universal Transition (Applied globally) */
* {
  transition-property: color, background-color, border-color, fill, stroke, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

### GSAP Animation Patterns
```javascript
/* Page Entry Animation */
gsap.from(elements, {
  opacity: 0,
  y: 30,
  stagger: 0.2,
  duration: 0.8,
  ease: "power3.out",
});

/* Scroll-triggered Animation */
gsap.fromTo(
  elements,
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
    },
  }
);
```

### Hover Effects
```css
/* Subtle Hover */
.hover-subtle {
  transition: all 0.2s ease;
}
.hover-subtle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button Hover */
.button-hover {
  transition: all 0.2s ease;
}
.button-hover:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
```

### Animation Performance
- Use `transform` and `opacity` for best performance
- Avoid animating `width`, `height`, `padding`, `margin`
- Use `will-change` sparingly and remove after animation
- Prefer CSS transitions for simple hover effects
- Use GSAP for complex animations and scroll triggers

---

## Accessibility Standards

### Focus States
```css
/* Standard Focus Ring */
.focus-ring:focus {
  outline: none;
  ring: 2px;
  ring-color: var(--accent-green);
  ring-offset: 2px;
}
```

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio

### ARIA Labels and Semantic HTML
```tsx
/* Navigation */
<nav role="navigation" aria-label="Main navigation">
  
/* Sections */
<section aria-labelledby="section-title">
  <h2 id="section-title">Section Title</h2>
  
/* Forms */
<form aria-label="Contact form">
  <input aria-required="true" aria-describedby="field-help">
  
/* Buttons */
<button aria-label="Submit contact form">Submit</button>
```

### Keyboard Navigation
- All interactive elements must be focusable
- Tab order must be logical
- Focus indicators must be visible
- Skip links for screen readers

---

## Development Guidelines

### React Component Structure
```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface ComponentProps {
  // Props with proper TypeScript types
}

export default function ComponentName({ }: ComponentProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Animation setup
  }, []);

  return (
    <section className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        {/* Section Content */}
      </div>
    </section>
  );
}
```

### CSS Custom Property Usage
```tsx
/* ✅ Correct - Use CSS custom properties */
<div className="bg-[var(--background-lighter)] text-[var(--foreground)]">

/* ❌ Incorrect - Never hardcode colors */
<div className="bg-white text-black">
```

### Responsive Design Patterns
```tsx
/* Mobile-first approach */
<div className="text-base md:text-lg lg:text-xl">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="px-4 lg:px-8">
```

### Performance Considerations
- Use `useCallback` and `useMemo` for expensive calculations
- Implement proper loading states
- Optimize images with Next.js Image component
- Lazy load components below the fold
- Minimize bundle size with tree shaking

---

## File Structure

### Component Organization
```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ...
│   └── layout/            # Layout components
│       ├── NavBar.tsx
│       └── Footer.tsx
├── context/               # React contexts
├── utils/                 # Utility functions
├── hooks/                 # Custom hooks
└── types/                 # TypeScript definitions
```

---

## Scaling Guidelines

### Adding New Components
1. **Follow existing patterns** - Use section header pattern, container system
2. **Use design tokens** - Never hardcode colors or spacing
3. **Implement accessibility** - ARIA labels, focus states, semantic HTML
4. **Add animations** - Follow GSAP patterns for consistency
5. **Test responsiveness** - Mobile-first, test all breakpoints

### Adding New Sections
```tsx
// 1. Create component file
export default function NewSection() {
  return (
    <section id="new-section" className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Section Header Pattern */}
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
        
        {/* Section Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content items */}
        </div>
      </div>
    </section>
  );
}

// 2. Add to main page
import NewSection from './components/NewSection';

// 3. Add navigation link if needed
```

### Theme Extension
```css
/* Add new colors to CSS custom properties */
:root {
  --accent-purple: #8B5CF6;
  --accent-orange: #F97316;
}

html.dark {
  --accent-purple: #A78BFA;
  --accent-orange: #FB923C;
}
```

### Animation Extension
```javascript
// Create reusable animation functions
export const fadeInUp = (elements, delay = 0) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: "power3.out",
    }
  );
};

// Use in components
useEffect(() => {
  fadeInUp(".animate-item");
}, []);
```

### Performance Optimization
1. **Code Splitting** - Dynamic imports for large components
2. **Image Optimization** - Use Next.js Image component
3. **Bundle Analysis** - Regular bundle size monitoring
4. **Memoization** - React.memo for pure components
5. **Lazy Loading** - Intersection Observer for below-fold content

---

## Quality Checklist

### Before Adding New Components
- [ ] Follows section header pattern (if applicable)
- [ ] Uses container system (`max-w-screen-xl mx-auto px-4 lg:px-8`)
- [ ] Uses CSS custom properties for all colors
- [ ] Implements proper responsive design
- [ ] Includes ARIA labels and semantic HTML
- [ ] Has proper focus states
- [ ] Follows animation guidelines
- [ ] Tested in both light and dark themes
- [ ] Tested on mobile and desktop
- [ ] Performance optimized

### Code Review Standards
- All colors use CSS custom properties
- No hardcoded spacing values
- Proper TypeScript types
- Accessibility compliance
- Mobile-first responsive design
- Clean, readable code structure
- Proper error handling
- Performance considerations

---

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Support
- CSS Grid and Flexbox
- CSS Custom Properties
- Modern JavaScript (ES2020)
- WebP images with fallbacks
- CSS backdrop-filter

---

## Tools and Resources

### Development Tools
- **Next.js 14+** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **GSAP** - Animations
- **ESLint/Prettier** - Code quality

### Design Tools
- **Figma** - Design system documentation
- **ColorFul** - Color contrast testing
- **WebAIM WAVE** - Accessibility testing

### Testing
- **Chrome DevTools** - Performance testing
- **Lighthouse** - Performance and accessibility audits
- **BrowserStack** - Cross-browser testing

---

## Common Patterns Reference

### Section Structure Template
```tsx
<section id="section-name" className="bg-[var(--background)] py-20 md:py-32">
  <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
    {/* Header */}
    <div className="text-center">
      <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
        Subtitle
      </span>
      <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
        Main Title
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
        Description text
      </p>
    </div>
    
    {/* Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Grid items */}
    </div>
  </div>
</section>
```

### Card Grid Pattern
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] hover:border-[var(--border-medium)] transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
        {item.title}
      </h3>
      <p className="text-[var(--foreground)] opacity-80">
        {item.description}
      </p>
    </div>
  ))}
</div>
```

### Form Pattern
```tsx
<form className="space-y-6 bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] shadow-lg">
  <div>
    <label htmlFor="field-id" className="block text-sm font-medium text-[var(--foreground)] mb-2">
      Field Label
    </label>
    <input
      id="field-id"
      type="text"
      className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
    />
  </div>
  
  <button
    type="submit"
    className="w-full bg-[var(--accent-green)] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 transition-all duration-200"
  >
    Submit
  </button>
</form>
```

---

This style guide should be treated as a living document and updated as the design system evolves. All team members should reference this guide when creating new components or modifying existing ones to ensure consistency and quality across the entire application.

## Implementation Notes

### Getting Started
1. **Read through the entire style guide** before starting development
2. **Bookmark common patterns** for quick reference
3. **Use the quality checklist** before submitting code
4. **Test in both themes** (light/dark) during development
5. **Follow the file structure** for consistency

### Maintenance
- Update this guide when adding new patterns
- Regular accessibility audits
- Performance monitoring
- Cross-browser testing
- Mobile testing on real devices

### Questions and Support
For questions about implementing these patterns or suggestions for improvements, please create an issue in the project repository or discuss with the team lead.

### Standard Component Layout
Every section component should follow this structure:

```tsx
export default function ComponentName() {
  return (
    <section id="component-name" className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Header Section */}
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            Section Label
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Section Title
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Section description text
          </p>
        </div>
        
        {/* Content Section */}
        <div className="mt-8 md:mt-12">
          {/* Component content */}
        </div>
      </div>
    </section>
  );
}
```

### Component Naming Conventions
- **Files**: PascalCase with descriptive names (`ContactSection.tsx`)
- **Components**: Match filename (`ContactSection`)
- **IDs**: kebab-case (`id="contact-section"`)
- **CSS Classes**: Follow Tailwind conventions

---

## CSS & Styling

### Styling Approach
1. **Tailwind CSS**: Primary styling framework
2. **CSS Custom Properties**: For theming and design tokens
3. **GSAP**: For animations and interactions
4. **Responsive Design**: Mobile-first breakpoints

### Class Naming Patterns
```tsx
// ✅ Good
className="bg-[var(--background)] text-[var(--foreground)] py-20 md:py-32"

// ❌ Avoid
className="bg-white text-black p-8"
```

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large Desktop**: `xl:` (1280px+)

---

## Typography

### Font Hierarchy
```css
/* Primary Headings */
.heading-primary {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Secondary Headings */
.heading-secondary {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2rem, 6vw, 3rem);
  text-transform: uppercase;
  line-height: 1.2;
}

/* Body Text */
.text-body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}
```

### Typography Scale
- **Hero Text**: `text-4xl md:text-6xl lg:text-8xl`
- **Section Titles**: `text-4xl md:text-5xl`
- **Subsection Titles**: `text-2xl md:text-3xl`
- **Body Text**: `text-base md:text-lg`
- **Small Text**: `text-sm`
- **Labels**: `text-xs uppercase tracking-wide`

---

## Layout & Spacing

### Container System
```tsx
// Standard section container
<div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">

// Content container (narrower)
<div className="w-full max-w-screen-md mx-auto px-4 lg:px-8">

// Full width container
<div className="w-full">
```

### Spacing Scale
- **Section Padding**: `py-20 md:py-32`
- **Component Gap**: `gap-12`
- **Element Gap**: `gap-8`
- **Small Gap**: `gap-4`
- **Content Margin**: `mt-4`, `mb-8`

### Grid Systems
```tsx
// Card Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Two Column Layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

// Auto Grid
<div className="grid grid-cols-auto-fit gap-6">
```

---

## Colors & Theming

### Color Palette
```css
/* Primary Colors */
--accent-green-base: #6ADC01;
--accent-green: #52a501;
--accent-blue-base: #0156A4;
--accent-blue: #014586;

/* Background Colors */
--background-black: #0A0A0A; /* Dark theme */
--background-lighter: #1A1A1A;
--background-black: #FFFAFA; /* Light theme */
--background-lighter: #FFFFFF;

/* Text Colors */
--white-color: #F1F1F1; /* Dark theme */
--white-color: #151515; /* Light theme */

/* Border Colors */
--border-light: #3C3C3C; /* Dark theme */
--border-medium: #222222;
--border-dark: #2C2C2C;
```

### Theme Usage
```tsx
// ✅ Always use CSS custom properties
className="bg-[var(--background)] text-[var(--foreground)]"
className="border-[var(--border-light)]"
className="text-[var(--accent-green)]"

// ❌ Never use hardcoded colors
className="bg-black text-white"
className="border-gray-300"
```

---

## Components Guidelines

### Buttons
```tsx
// Primary Button
<button className="bg-[var(--accent-green)] text-[var(--white-color)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-green-base)] transition-colors">
  Button Text
</button>

// Secondary Button
<button className="bg-transparent border-2 border-[var(--accent-green)] text-[var(--accent-green)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-green)] hover:text-[var(--white-color)] transition-colors">
  Button Text
</button>
```

### Cards
```tsx
<div className="bg-[var(--background-lighter)] p-6 md:p-8 rounded-xl border border-[var(--border-light)] hover:border-[var(--accent-green)] transition-all duration-300 hover:shadow-lg">
  {/* Card content */}
</div>
```

### Form Elements
```tsx
// Input Field
<input className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors" />

// Textarea
<textarea className="w-full border-2 border-[var(--border-medium)] bg-transparent p-4 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors rounded-lg resize-none" />
```

---

## Animation & Interactions

### GSAP Animation Patterns
```tsx
// Scroll Trigger Animation
useEffect(() => {
  const elements = sectionRef.current?.querySelectorAll(".animate-element");
  if (elements) {
    gsap.fromTo(elements, 
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
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

### Hover Effects
```css
/* Smooth transitions */
.interactive-element {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scale hover */
.hover-scale:hover {
  transform: scale(1.02);
}

/* Color hover */
.hover-color:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}
```

---

## Accessibility

### Requirements
- **Semantic HTML**: Use proper HTML5 elements
- **ARIA Labels**: Add aria-label for interactive elements
- **Focus States**: Visible focus indicators
- **Color Contrast**: Meet WCAG AA standards
- **Screen Reader**: Alt text for images

### Implementation
```tsx
// ✅ Good accessibility
<button 
  aria-label="Navigate to next testimonial"
  className="focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
>
  <svg aria-hidden="true">...</svg>
</button>

<img 
  src="/image.jpg" 
  alt="Descriptive text about the image content"
/>

// Form labels
<label htmlFor="email" className="sr-only">Email Address</label>
<input id="email" type="email" placeholder="Email" />
```

---

## File Organization

### Directory Structure
```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── sections/           # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ProjectsSection.tsx
│   └── layout/             # Layout components
│       ├── NavBar.tsx
│       └── Footer.tsx
├── context/                # React contexts
├── utils/                  # Utility functions
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

### Import Organization
```tsx
// External imports
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Internal imports
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

// Type imports
import type { ComponentProps } from '../types';
```

---

## Code Standards

### React Best Practices
```tsx
// ✅ Functional components with hooks
export default function ComponentName() {
  const [state, setState] = useState(initialValue);
  const ref = useRef<HTMLElement>(null);
  
  // Effect hooks
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// ✅ Props with TypeScript
interface ComponentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Component({ title, description, children }: ComponentProps) {
  // Component logic
}
```

### Performance Guidelines
- Use `React.memo` for expensive components
- Implement proper cleanup in useEffect
- Optimize images with Next.js Image component
- Use dynamic imports for large components
- Minimize re-renders with proper dependencies

### Testing Considerations
- Write tests for complex logic
- Test accessibility features
- Verify responsive behavior
- Test theme switching functionality
- Validate form submissions

---

## Future Scaling Guidelines

### Adding New Components
1. Follow the standard component structure
2. Use the established naming conventions
3. Implement proper TypeScript interfaces
4. Add appropriate animations with GSAP
5. Ensure accessibility compliance
6. Test across all breakpoints

### Extending the Design System
1. Add new CSS custom properties to globals.css
2. Update the style guide documentation
3. Create reusable utility classes
4. Maintain consistent spacing scale
5. Test theme compatibility

### Performance Optimization
- Implement code splitting for route-based chunks
- Optimize bundle size with tree shaking
- Use proper image optimization
- Implement lazy loading for below-fold content
- Monitor Core Web Vitals

---

## Quick Reference

### Common Patterns
```tsx
// Section wrapper
<section className="bg-[var(--background)] py-20 md:py-32">

// Container
<div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8">

// Header pattern
<div className="text-center">
  <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Label</span>
  <h2 className="mt-4 text-4xl md:text-5xl font-bold">Title</h2>
  <p className="mt-4 max-w-2xl mx-auto opacity-80">Description</p>
</div>

// Card pattern
<div className="bg-[var(--background-lighter)] p-6 md:p-8 rounded-xl border border-[var(--border-light)]">

// Button pattern
<button className="bg-[var(--accent-green)] text-[var(--white-color)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-green-base)] transition-colors">
```

This style guide should be referenced for all future development to maintain consistency and quality as the project scales.

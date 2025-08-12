/**
 * Animation Configuration for Framer Motion
 * 
 * This file contains standardized timing, easing, and animation constants
 * that match the existing GSAP animation feel across home page components.
 * 
 * Based on analysis of existing GSAP animations:
 * - HeroSection: fade-in with stagger 0.1s, duration 0.6s, ease "power2.out"
 * - TechGridSection: scroll-triggered with stagger 0.05s, duration 0.6s, hover scale 1.05
 * - ProjectsSection: scroll-triggered with stagger 0.1s, duration 0.6s
 * - ProcessSection: scroll-triggered with duration 0.35s, stagger 0.06s
 * - TestimonialsSection: scroll-triggered with duration 0.6s
 */

// Animation Durations (in seconds)
export const DURATIONS = {
  // Fast animations for micro-interactions
  fast: 0.2,
  
  // Standard entrance animations
  standard: 0.35,
  
  // Longer entrance animations for hero elements
  slow: 0.6,
  
  // Hover and interactive animations
  hover: 0.3,
  
  // Page transitions
  pageTransition: 0.4,
} as const;

// Animation Easing Functions
// Matching GSAP's "power2.out" and other common easings
export const EASINGS = {
  // Equivalent to GSAP's "power2.out" - smooth deceleration
  easeOut: [0.25, 0.46, 0.45, 0.94],
  
  // Equivalent to GSAP's "power2.in" - smooth acceleration
  easeIn: [0.55, 0.06, 0.68, 0.19],
  
  // Equivalent to GSAP's "power2.inOut" - smooth acceleration and deceleration
  easeInOut: [0.76, 0, 0.24, 1],
  
  // Bouncy spring effect for playful interactions
  spring: [0.68, -0.55, 0.265, 1.55],
  
  // Gentle spring for subtle bounce
  gentleSpring: [0.25, 0.46, 0.45, 0.94],
  
  // Sharp entrance for attention-grabbing elements
  sharp: [0.4, 0, 0.2, 1],
} as const;

// Stagger Delays (in seconds)
export const STAGGERS = {
  // Very fast stagger for tech grid items
  fast: 0.05,
  
  // Standard stagger for cards and list items
  standard: 0.1,
  
  // Slower stagger for hero elements
  slow: 0.15,
  
  // Process steps stagger
  process: 0.06,
} as const;

// Transform Values
export const TRANSFORMS = {
  // Y-axis movement for entrance animations
  slideUp: {
    initial: 24,
    animate: 0,
  },
  
  // Smaller slide for subtle entrance
  slideUpSmall: {
    initial: 12,
    animate: 0,
  },
  
  // Larger slide for dramatic entrance
  slideUpLarge: {
    initial: 40,
    animate: 0,
  },
  
  // Scale transforms for hover effects
  scale: {
    rest: 1,
    hover: 1.05,
    active: 0.95,
  },
  
  // Rotation for playful hover effects
  rotation: {
    rest: 0,
    hover: 0.5,
  },
  
  // 3D rotation for process boxes
  rotateX: {
    initial: -10,
    animate: 0,
  },
} as const;

// Opacity Values
export const OPACITY = {
  hidden: 0,
  visible: 1,
  dimmed: 0.75,
  faded: 0.5,
} as const;

// Scroll Trigger Positions
// Matching GSAP ScrollTrigger start positions
export const SCROLL_TRIGGERS = {
  // Early trigger for elements that should animate before coming into view
  early: "top 85%",
  
  // Standard trigger position used across most components
  standard: "top 80%",
  
  // Late trigger for elements that should animate when more visible
  late: "top 70%",
  
  // Center trigger for elements that should animate when centered
  center: "center center",
} as const;

// Animation Variants Presets
// Common animation patterns used across components
export const ANIMATION_PRESETS = {
  // Fade in from bottom (most common pattern)
  fadeInUp: {
    duration: DURATIONS.standard,
    ease: EASINGS.easeOut,
    y: TRANSFORMS.slideUp.initial,
    opacity: OPACITY.hidden,
  },
  
  // Hero section fade in
  heroFadeIn: {
    duration: DURATIONS.slow,
    ease: EASINGS.easeOut,
    stagger: STAGGERS.standard,
    y: TRANSFORMS.slideUp.initial,
    opacity: OPACITY.hidden,
  },
  
  // Tech grid entrance
  techGridEntrance: {
    duration: DURATIONS.slow,
    ease: EASINGS.easeOut,
    stagger: STAGGERS.fast,
    y: TRANSFORMS.slideUpSmall.initial,
    opacity: OPACITY.hidden,
  },
  
  // Process box 3D entrance
  processBoxEntrance: {
    duration: DURATIONS.standard,
    ease: EASINGS.easeOut,
    stagger: STAGGERS.process,
    rotateX: TRANSFORMS.rotateX.initial,
    y: TRANSFORMS.slideUpSmall.initial,
    opacity: OPACITY.hidden,
  },
  
  // Hover scale effect
  hoverScale: {
    duration: DURATIONS.hover,
    ease: EASINGS.easeOut,
    scale: TRANSFORMS.scale.hover,
  },
  
  // Button hover with scale
  buttonHover: {
    duration: DURATIONS.hover,
    ease: EASINGS.easeOut,
    scale: TRANSFORMS.scale.hover,
  },
} as const;

// Responsive Breakpoints for Animations
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// Animation Performance Settings
export const PERFORMANCE = {
  // Reduce motion for users who prefer reduced motion
  respectReducedMotion: true,
  
  // Use transform3d for better performance
  useTransform3d: true,
  
  // Optimize for mobile performance
  mobileOptimized: true,
} as const;

// Utility function to create consistent animation configs
export const createAnimationConfig = (
  preset: keyof typeof ANIMATION_PRESETS,
  overrides?: Partial<typeof ANIMATION_PRESETS[keyof typeof ANIMATION_PRESETS]>
) => {
  return {
    ...ANIMATION_PRESETS[preset],
    ...overrides,
  };
};

// Utility function to get responsive duration
export const getResponsiveDuration = (baseDuration: number, isMobile: boolean = false) => {
  return isMobile ? baseDuration * 0.8 : baseDuration;
};

// Utility function to check if reduced motion is preferred
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
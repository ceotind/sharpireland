/**
 * Framer Motion Variants for Home Page Components
 * 
 * This file contains reusable motion variants that replicate the existing GSAP
 * animation patterns found in home page components. Each variant is designed
 * to match the timing, easing, and visual effects of the original animations.
 * 
 * Components covered:
 * - HeroSection: fade-in animations, button hover effects
 * - TechGridSection: scroll-triggered animations, tech logo hover effects
 * - ProjectsSection: scroll-triggered card animations
 * - ProcessSection: 3D box animations, interactive hover effects
 * - SaaSComparisonSection: scroll-triggered animations, card hover effects
 * - TestimonialsSection: scroll-triggered animations, navigation hover effects
 * - TripleSwitchSection: scroll-triggered animations, switch hover effects
 * - ContactSectionWrapper: scroll-triggered animations, form hover effects
 */

import { Variants } from 'framer-motion';
import {
  DURATIONS,
  EASINGS,
  STAGGERS,
  TRANSFORMS,
  OPACITY
} from './animation-config';

// =============================================================================
// HERO SECTION VARIANTS
// =============================================================================

/**
 * Hero section fade-in animation
 * Replicates GSAP: fromTo(elements, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 })
 */
export const heroFadeIn: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORMS.slideUp.initial,
  },
  visible: {
    opacity: OPACITY.visible,
    y: TRANSFORMS.slideUp.animate,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
      staggerChildren: STAGGERS.standard,
    },
  },
};

/**
 * Hero element individual animation
 */
export const heroElement: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORMS.slideUp.initial,
  },
  visible: {
    opacity: OPACITY.visible,
    y: TRANSFORMS.slideUp.animate,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Hero button hover effect
 * Replicates CSS: hover:scale-105 with smooth transition
 */
export const heroButton: Variants = {
  rest: {
    scale: TRANSFORMS.scale.rest,
  },
  hover: {
    scale: TRANSFORMS.scale.hover,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  tap: {
    scale: TRANSFORMS.scale.active,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// TECH GRID SECTION VARIANTS
// =============================================================================

/**
 * Tech grid container animation
 * Replicates GSAP batch animation with stagger
 */
export const techGridContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.fast,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual tech grid item animation
 * Replicates GSAP: fromTo(batch, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 })
 */
export const techGridItem: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Tech logo hover animation
 * Replicates GSAP: scale: 1.05, rotation: 0.5, duration: 0.4
 */
export const techLogo: Variants = {
  rest: {
    scale: TRANSFORMS.scale.rest,
    rotate: TRANSFORMS.rotation.rest,
  },
  hover: {
    scale: TRANSFORMS.scale.hover,
    rotate: TRANSFORMS.rotation.hover,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// PROJECTS SECTION VARIANTS
// =============================================================================

/**
 * Projects container animation
 */
export const projectsContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
      delayChildren: 0.2,
    },
  },
};

/**
 * Project card animation
 * Replicates GSAP: fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
 */
export const projectCard: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// PROCESS SECTION VARIANTS
// =============================================================================

/**
 * Process section header animation
 * Replicates GSAP: fromTo(".process-header", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 })
 */
export const processHeader: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Process content animation
 * Replicates GSAP: delay: 0.06 from header
 */
export const processContent: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
      delay: 0.06,
    },
  },
};

/**
 * Process boxes container
 */
export const processBoxContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.process,
      delayChildren: 0.12,
    },
  },
};

/**
 * Individual process box 3D animation
 * Replicates GSAP: fromTo(".process-box", { opacity: 0, rotateX: -10, y: 20 }, { opacity: 1, rotateX: 0, y: 0 })
 */
export const processBox: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    rotateX: TRANSFORMS.rotateX.initial,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    rotateX: TRANSFORMS.rotateX.animate,
    y: 0,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
  hover: {
    scale: 1.05,
    rotateX: 2,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  active: {
    opacity: 1,
    scale: 1.1,
    rotateX: 0,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// TESTIMONIALS SECTION VARIANTS
// =============================================================================

/**
 * Testimonials section entrance
 * Replicates GSAP: fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
 */
export const testimonialsSection: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Testimonial content slide animation
 */
export const testimonialContent: Variants = {
  enter: {
    x: 0,
    opacity: OPACITY.visible,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
  exit: {
    x: -20,
    opacity: OPACITY.hidden,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeIn,
    },
  },
};

/**
 * Navigation button hover
 */
export const navButton: Variants = {
  rest: {
    scale: TRANSFORMS.scale.rest,
    backgroundColor: 'var(--bg-200)',
  },
  hover: {
    scale: TRANSFORMS.scale.hover,
    backgroundColor: 'var(--accent-green)',
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// SAAS COMPARISON SECTION VARIANTS
// =============================================================================

/**
 * SaaS comparison container
 */
export const saasContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
      delayChildren: 0.2,
    },
  },
};

/**
 * SaaS comparison card
 */
export const saasCard: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// TRIPLE SWITCH SECTION VARIANTS
// =============================================================================

/**
 * Triple switch section animation
 * Replicates GSAP: fromTo(elements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
 */
export const tripleSwitchSection: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 30,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
      staggerChildren: STAGGERS.standard,
    },
  },
};

/**
 * Triple switch card hover animation
 * Replicates CSS: hover:shadow-md transition
 */
export const tripleSwitchCard: Variants = {
  hover: {
    y: -2,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Triple switch button animation
 * Replicates CSS: hover:bg-[var(--accent-green-base)]
 */
export const tripleSwitchButton: Variants = {
  hover: {
    backgroundColor: "var(--accent-green-base)",
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Triple switch container
 */
export const tripleSwitchContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
      delayChildren: 0.1,
    },
  },
};

/**
 * Switch item animation
 */
export const switchItem: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  active: {
    scale: 1.05,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// CONTACT SECTION VARIANTS
// =============================================================================

/**
 * Contact section container
 */
export const contactContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
      delayChildren: 0.2,
    },
  },
};

/**
 * Contact form field animation
 */
export const contactField: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: 20,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
  focus: {
    scale: 1.02,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Contact submit button
 */
export const contactButton: Variants = {
  rest: {
    scale: TRANSFORMS.scale.rest,
  },
  hover: {
    scale: TRANSFORMS.scale.hover,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  tap: {
    scale: TRANSFORMS.scale.active,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
  loading: {
    scale: 0.98,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// UTILITY VARIANTS
// =============================================================================

/**
 * Generic fade in animation
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
  },
  visible: {
    opacity: OPACITY.visible,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Generic slide up animation
 */
export const slideUp: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORMS.slideUp.initial,
  },
  visible: {
    opacity: OPACITY.visible,
    y: TRANSFORMS.slideUp.animate,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Generic scale animation for buttons
 */
export const scaleButton: Variants = {
  rest: {
    scale: TRANSFORMS.scale.rest,
  },
  hover: {
    scale: TRANSFORMS.scale.hover,
    transition: {
      duration: DURATIONS.hover,
      ease: EASINGS.easeOut,
    },
  },
  tap: {
    scale: TRANSFORMS.scale.active,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Staggered container for lists
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
    },
  },
};

/**
 * List item animation
 */
export const listItem: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    x: -20,
  },
  visible: {
    opacity: OPACITY.visible,
    x: 0,
    transition: {
      duration: DURATIONS.standard,
      ease: EASINGS.easeOut,
    },
  },
};

// =============================================================================
// SCROLL-TRIGGERED VARIANTS
// =============================================================================

/**
 * Viewport-based animation trigger
 * Use with useInView hook for scroll-triggered animations
 */
export const viewportFadeIn: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: TRANSFORMS.slideUp.initial,
  },
  visible: {
    opacity: OPACITY.visible,
    y: TRANSFORMS.slideUp.animate,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  },
};

/**
 * Viewport-based stagger container
 */
export const viewportStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGERS.standard,
      delayChildren: 0.1,
    },
  },
};
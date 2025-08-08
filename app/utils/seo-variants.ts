import { Variants } from 'framer-motion';

export type CubicBezier = [number, number, number, number];

export const MotionTiming = {
  duration: {
    entrance: 0.35,
    exit: 0.5,
    hover: 0.25,
    tap: 0.12,
  },
  stagger: {
    page: 0.06,
    component: 0.06,
  },
} as const;

/**
 * Page container variants
 */
export function pageVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : MotionTiming.stagger.page,
      },
    },
  };
}

/**
 * Title section variants
 */
export function titleVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
      },
    },
  };
}

/**
 * Hero group variants (to sequence hero children: title, subhead, trust note)
 */
export function heroGroupVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : MotionTiming.stagger.component,
      },
    },
  };
}

/**
 * Form container variants
 */
export function formContainerVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : MotionTiming.stagger.component,
      },
    },
  };
}

/**
 * Input field variants
 */
export function inputVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
      },
    },
  };
}

/**
 * Button variants
 */
export function buttonVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.hover,
        ease,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.tap,
        ease,
      },
    },
  };
}

/**
 * Error message variants
 */
export function errorVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.exit,
        ease,
      },
    },
  };
}

/**
 * Loading indicator variants
 */
export function loadingVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.exit,
        ease,
      },
    },
  };
}

/**
 * Feature card variants
 */
export function featureCardVariants(prefersReducedMotion: boolean, ease: CubicBezier): Variants {
  return {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.entrance,
        ease,
        delay: prefersReducedMotion ? 0 : i * MotionTiming.stagger.component,
      },
    }),
    hover: {
      y: -6,
      scale: 1.01,
      transition: {
        duration: prefersReducedMotion ? 0 : MotionTiming.duration.hover,
        ease,
      },
    },
  };
}
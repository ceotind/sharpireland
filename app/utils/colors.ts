/**
 * Light-mode-only color utility functions and constants for Sharp Ireland
 * Single source of truth: CSS variables defined in globals.css
 */

// Light mode colors (matches CSS variables)
export const colors = {
  primary: {
    100: '#0f51dd',
    200: '#0d46c2',
    300: '#4a7aff',
  },
  accent: {
    green: '#10b981',
    red: '#ef4444',
    redLight: '#fee2e2',
  },
  text: {
    100: '#000000',
    200: '#555555',
    300: '#6b7280',
  },
  bg: {
    100: '#ffffff',
    200: '#f5f5f5',
    300: '#e5e5e5',
  },
  error: {
    text: '#dc2626',
    bg: '#fee2e2',
    border: '#fecaca',
  },
  utility: {
    white: '#ffffff',
    border: '#e5e5e5',
  },
} as const;

/**
 * CSS variable names for use with var() function
 */
export const cssVars = {
  primary: {
    100: '--primary-100',
    200: '--primary-200',
    300: '--primary-300',
  },
  accent: {
    green: '--accent-green',
    red: '--accent-red',
    redLight: '--accent-red-light',
  },
  text: {
    100: '--text-100',
    200: '--text-200',
    300: '--text-300',
  },
  bg: {
    100: '--bg-100',
    200: '--bg-200',
    300: '--bg-300',
  },
  error: {
    text: '--error-text',
    bg: '--error-bg',
    border: '--error-border',
  },
  utility: {
    white: '--white-color',
    border: '--border-color',
  },
} as const;

/**
 * Helper function to get CSS variable value
 */
export const getCSSVar = (variable: string): string => `var(${variable})`;

/**
 * Type-safe color getter for components
 */
export type ColorCategory = keyof typeof colors;
export type PrimaryShade = keyof typeof colors.primary;
export type AccentColor = keyof typeof colors.accent;
export type TextShade = keyof typeof colors.text;
export type BgShade = keyof typeof colors.bg;

export const getColor = (
  category: ColorCategory,
  shade: string
): string => {
  const categoryColors = colors[category] as Record<string, string>;
  return categoryColors[shade] || colors.text[100];
};

/**
 * Tailwind CSS custom color configuration
 * These map to CSS variables for consistency
 */
export const tailwindColors = {
  primary: {
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
  },
  accent: {
    green: 'var(--accent-green)',
    red: 'var(--accent-red)',
    'red-light': 'var(--accent-red-light)',
  },
  text: {
    100: 'var(--text-100)',
    200: 'var(--text-200)',
    300: 'var(--text-300)',
  },
  bg: {
    100: 'var(--bg-100)',
    200: 'var(--bg-200)',
    300: 'var(--bg-300)',
  },
  error: {
    text: 'var(--error-text)',
    bg: 'var(--error-bg)',
    border: 'var(--error-border)',
  },
  border: 'var(--border-color)',
  white: 'var(--white-color)',
};

/**
 * Common color combinations for quick use
 */
export const colorCombinations = {
  primaryButton: {
    bg: getCSSVar(cssVars.primary[100]),
    text: getCSSVar(cssVars.utility.white),
    hover: getCSSVar(cssVars.primary[200]),
  },
  secondaryButton: {
    bg: 'transparent',
    text: getCSSVar(cssVars.text[100]),
    border: getCSSVar(cssVars.bg[300]),
    hover: getCSSVar(cssVars.bg[200]),
  },
  errorState: {
    text: getCSSVar(cssVars.error.text),
    bg: getCSSVar(cssVars.error.bg),
    border: getCSSVar(cssVars.error.border),
  },
  successState: {
    text: getCSSVar(cssVars.utility.white),
    bg: getCSSVar(cssVars.accent.green),
    border: getCSSVar(cssVars.accent.green),
  },
} as const;

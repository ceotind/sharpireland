/**
 * Color utility functions and constants for Sharp Ireland
 * Based on the new color scheme defined in copy.txt
 */

export const colors = {
  // Light mode colors
  light: {
    primary: {
      100: '#0f51dd',
      200: '#4a7aff',
      300: '#c8d9ff',
    },
    accent: {
      100: '#0f51dd',
      200: '#0a3bb8',
    },
    text: {
      100: '#333333',
      200: '#5c5c5c',
    },
    bg: {
      100: '#FFFFFF',
      200: '#f5f5f5',
      300: '#cccccc',
    },
  },
  
  // Dark mode colors
  dark: {
    primary: {
      100: '#0085ff',
      200: '#69b4ff',
      300: '#e0ffff',
    },
    accent: {
      100: '#006fff',
      200: '#e1ffff',
    },
    text: {
      100: '#FFFFFF',
      200: '#9e9e9e',
    },
    bg: {
      100: '#1E1E1E',
      200: '#2d2d2d',
      300: '#454545',
    },
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
    100: '--accent-100',
    200: '--accent-200',
  },
  text: {
    100: '--text-100',
    200: '--text-200',
  },
  bg: {
    100: '--bg-100',
    200: '--bg-200',
    300: '--bg-300',
  },
  // Legacy variables for backward compatibility
  legacy: {
    background: '--background',
    foreground: '--foreground',
    backgroundBlack: '--background-black',
    backgroundLighter: '--background-lighter',
    whiteColor: '--white-color',
    borderDark: '--border-dark',
    borderLight: '--border-light',
    borderMedium: '--border-medium',
    borderDarker: '--border-darker',
  },
} as const;

/**
 * Helper function to get CSS variable value
 */
export const getCSSVar = (variable: string): string => `var(${variable})`;

/**
 * Type-safe color getter for components
 */
export type ColorCategory = keyof typeof colors.light;
export type ColorShade = keyof typeof colors.light.primary;

export const getColor = (
  category: ColorCategory,
  shade: ColorShade,
  theme: 'light' | 'dark' = 'light'
): string => {
  return colors[theme][category][shade as keyof typeof colors.light[ColorCategory]];
};

/**
 * Tailwind CSS custom color configuration
 * Add this to your tailwind.config.js to use the new colors
 */
export const tailwindColors = {
  primary: {
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
  },
  accent: {
    100: 'var(--accent-100)',
    200: 'var(--accent-200)',
  },
  text: {
    100: 'var(--text-100)',
    200: 'var(--text-200)',
  },
  bg: {
    100: 'var(--bg-100)',
    200: 'var(--bg-200)',
    300: 'var(--bg-300)',
  },
};

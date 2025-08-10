/**
 * Accessibility utilities for ensuring WCAG 2.1 AA compliance
 */

/**
 * Calculates the relative luminance of a color
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * 
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Relative luminance value
 */
const calculateRelativeLuminance = (r: number, g: number, b: number): number => {
  // Convert RGB values to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Calculate RGB values
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Parses a CSS color string (hex, rgb, rgba) into RGB values
 * 
 * @param color CSS color string
 * @returns RGB values as [r, g, b]
 */
const parseColor = (color: string): [number, number, number] => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      // #RGB format
      const r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      const g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      const b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
      return [r, g, b];
    } else if (hex.length === 6) {
      // #RRGGBB format
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    }
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match && match[1] && match[2] && match[3]) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10)
      ];
    }
  }
  
  // Default to black if color can't be parsed
  console.warn(`Could not parse color: ${color}`);
  return [0, 0, 0];
};

/**
 * Calculates the contrast ratio between two colors
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#contrast-ratio
 * 
 * @param color1 First color (foreground)
 * @param color2 Second color (background)
 * @returns Contrast ratio (1:1 to 21:1)
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const [r1, g1, b1] = parseColor(color1);
  const [r2, g2, b2] = parseColor(color2);
  
  const l1 = calculateRelativeLuminance(r1, g1, b1);
  const l2 = calculateRelativeLuminance(r2, g2, b2);
  
  // Ensure lighter color is l1
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Checks if a color combination meets WCAG 2.1 AA contrast requirements
 * 
 * @param foreground Foreground color (text)
 * @param background Background color
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns Object with contrast ratio and whether it passes AA standard
 */
export const meetsWCAGAA = (
  foreground: string, 
  background: string, 
  isLargeText = false
): { ratio: number; passes: boolean } => {
  const ratio = calculateContrastRatio(foreground, background);
  const threshold = isLargeText ? 3.0 : 4.5;
  
  return {
    ratio,
    passes: ratio >= threshold
  };
};

/**
 * Checks if a color combination meets WCAG 2.1 AAA contrast requirements
 * 
 * @param foreground Foreground color (text)
 * @param background Background color
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns Object with contrast ratio and whether it passes AAA standard
 */
export const meetsWCAGAAA = (
  foreground: string, 
  background: string, 
  isLargeText = false
): { ratio: number; passes: boolean } => {
  const ratio = calculateContrastRatio(foreground, background);
  const threshold = isLargeText ? 4.5 : 7.0;
  
  return {
    ratio,
    passes: ratio >= threshold
  };
};

/**
 * Verifies color contrast for CSS variables in the current theme
 * This can be used to check if the theme's color combinations meet WCAG standards
 * 
 * @returns Object with results for each color combination
 */
export const verifyThemeColorContrast = (): Record<string, { ratio: number; passes: boolean }> => {
  if (typeof window === 'undefined') return {};
  
  const results: Record<string, { ratio: number; passes: boolean }> = {};
  
  // Get computed styles
  const styles = getComputedStyle(document.documentElement);
  
  // Text colors
  const textColors = [
    styles.getPropertyValue('--text-100').trim(),
    styles.getPropertyValue('--text-200').trim(),
    styles.getPropertyValue('--text-300').trim(),
  ];
  
  // Background colors
  const bgColors = [
    styles.getPropertyValue('--bg-100').trim(),
    styles.getPropertyValue('--bg-200').trim(),
    styles.getPropertyValue('--bg-300').trim(),
  ];
  
  // Accent colors
  const accentColors = [
    styles.getPropertyValue('--accent-green').trim(),
    styles.getPropertyValue('--accent-green-base').trim(),
  ];
  
  // Check text colors against background colors
  textColors.forEach((textColor, i) => {
    bgColors.forEach((bgColor, j) => {
      const key = `text-${i+1}00 on bg-${j+1}00`;
      results[key] = meetsWCAGAA(textColor, bgColor);
    });
  });
  
  // Check accent colors against background colors
  accentColors.forEach((accentColor, i) => {
    bgColors.forEach((bgColor, j) => {
      const key = `accent-${i === 0 ? 'green' : 'green-base'} on bg-${j+1}00`;
      results[key] = meetsWCAGAA(accentColor, bgColor);
    });
  });
  
  return results;
};

/**
 * Logs color contrast issues to the console
 * This can be used during development to identify accessibility issues
 */
export const logColorContrastIssues = (): void => {
  const results = verifyThemeColorContrast();
  
  console.group('Color Contrast Verification (WCAG 2.1 AA)');
  
  Object.entries(results).forEach(([combination, { ratio, passes }]) => {
    if (passes) {
      console.log(`✅ ${combination}: ${ratio.toFixed(2)}:1`);
    } else {
      console.warn(`❌ ${combination}: ${ratio.toFixed(2)}:1 (fails WCAG AA)`);
    }
  });
  
  console.groupEnd();
};

/**
 * Checks if the user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks keyboard navigation by simulating tab key presses
 * This is useful for testing keyboard accessibility
 * 
 * @param containerId ID of the container element to test
 * @param maxTabs Maximum number of tab presses to simulate
 * @returns Array of elements that received focus in order
 */
export const testKeyboardNavigation = (
  containerId: string, 
  maxTabs = 20
): HTMLElement[] => {
  if (typeof window === 'undefined') return [];
  
  const container = document.getElementById(containerId);
  if (!container) return [];
  
  const focusableElements = container.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  
  const focusPath: HTMLElement[] = [];
  let currentIndex = -1;
  
  // Simulate tab key presses
  for (let i = 0; i < Math.min(maxTabs, focusableElements.length); i++) {
    currentIndex = (currentIndex + 1) % focusableElements.length;
    const element = focusableElements[currentIndex] as HTMLElement;
    element.focus();
    focusPath.push(element);
  }
  
  return focusPath;
};
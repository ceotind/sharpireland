/**
 * Global CSS class utilities for Sharp Ireland color system
 * These classes can be used throughout your application
 */

// Export class name utilities for easy use in components
export const colorClasses = {
  // Background classes
  bgPrimary: 'bg-[var(--bg-100)]',
  bgSecondary: 'bg-[var(--bg-200)]',
  bgTertiary: 'bg-[var(--bg-300)]',
  
  // Text classes
  textPrimary: 'text-[var(--text-100)]',
  textSecondary: 'text-[var(--text-200)]',
  textBrand: 'text-[var(--primary-100)]',
  textAccent: 'text-[var(--accent-100)]',
  
  // Border classes
  borderDefault: 'border-[var(--bg-300)]',
  borderLight: 'border-[var(--bg-200)]',
  borderBrand: 'border-[var(--primary-100)]',
  
  // Button variations
  btnPrimary: 'btn-primary',
  btnSecondary: 'btn-secondary',
  btnAccent: 'btn-accent',
  
  // Component classes
  card: 'card-base',
  input: 'input-base',
  link: 'link-primary',
} as const;

/**
 * Helper function to combine multiple color classes
 */
export const combineColorClasses = (...classes: string[]): string => {
  return classes.join(' ');
};

/**
 * Predefined component styles using the color system
 */
export const componentStyles = {
  // Card variations
  cardDefault: combineColorClasses(colorClasses.card),
  cardElevated: combineColorClasses(
    'bg-[var(--bg-200)]',
    'border-[var(--bg-300)]',
    'shadow-lg',
    'rounded-lg',
    'p-6',
    colorClasses.textPrimary
  ),
  
  // Button variations
  buttonPrimary: combineColorClasses(colorClasses.btnPrimary),
  buttonSecondary: combineColorClasses(colorClasses.btnSecondary),
  buttonOutline: combineColorClasses(
    'bg-transparent',
    'border',
    colorClasses.borderBrand,
    colorClasses.textBrand,
    'hover:bg-[var(--primary-100)]',
    'hover:text-[var(--bg-100)]',
    'px-4 py-2 rounded transition-all duration-300'
  ),
  
  // Form elements
  inputDefault: combineColorClasses(colorClasses.input),
  inputError: combineColorClasses(
    colorClasses.input,
    'border-red-500',
    'focus:border-red-500'
  ),
  
  // Navigation elements
  navLink: combineColorClasses(
    colorClasses.textPrimary,
    'hover:text-[var(--primary-100)]',
    'transition-colors duration-300'
  ),
  
  // Section containers
  sectionDefault: combineColorClasses(
    colorClasses.bgPrimary,
    colorClasses.textPrimary,
    'py-16 px-4'
  ),
  sectionAlternate: combineColorClasses(
    colorClasses.bgSecondary,
    colorClasses.textPrimary,
    'py-16 px-4'
  ),
} as const;

/**
 * CSS-in-JS style objects for inline styles
 */
export const inlineStyles = {
  // Background styles
  bgPrimary: { backgroundColor: 'var(--bg-100)' },
  bgSecondary: { backgroundColor: 'var(--bg-200)' },
  bgTertiary: { backgroundColor: 'var(--bg-300)' },
  bgBrand: { backgroundColor: 'var(--primary-100)' },
  bgAccent: { backgroundColor: 'var(--accent-100)' },
  
  // Text styles
  textPrimary: { color: 'var(--text-100)' },
  textSecondary: { color: 'var(--text-200)' },
  textBrand: { color: 'var(--primary-100)' },
  textAccent: { color: 'var(--accent-100)' },
  textOnBrand: { color: 'var(--bg-100)' },
  
  // Border styles
  borderDefault: { borderColor: 'var(--bg-300)' },
  borderBrand: { borderColor: 'var(--primary-100)' },
  
  // Combined styles
  cardDefault: {
    backgroundColor: 'var(--bg-200)',
    color: 'var(--text-100)',
    border: '1px solid var(--bg-300)',
    borderRadius: '0.5rem',
    padding: '1.5rem',
  },
  
  buttonPrimary: {
    backgroundColor: 'var(--primary-100)',
    color: 'var(--bg-100)',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
} as const;

export default {
  colorClasses,
  combineColorClasses,
  componentStyles,
  inlineStyles,
};

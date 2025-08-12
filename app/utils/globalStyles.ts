/**
 * Light-mode-only CSS class utilities for Sharp Ireland color system
 * These classes work with the unified color system defined in globals.css
 */

// Export class name utilities for easy use in components
export const colorClasses = {
  // Background classes
  bgPrimary: 'bg-[var(--bg-100)]',
  bgSecondary: 'bg-[var(--bg-200)]',
  bgTertiary: 'bg-[var(--bg-300)]',
  bgBrand: 'bg-[var(--primary-100)]',
  bgBrandHover: 'bg-[var(--primary-200)]',
  
  // Text classes
  textPrimary: 'text-[var(--text-100)]',
  textSecondary: 'text-[var(--text-200)]',
  textMuted: 'text-[var(--text-300)]',
  textBrand: 'text-[var(--primary-100)]',
  textWhite: 'text-[var(--white-color)]',
  textSuccess: 'text-[var(--accent-green)]',
  textError: 'text-[var(--error-text)]',
  
  // Border classes
  borderDefault: 'border-[var(--border-color)]',
  borderLight: 'border-[var(--bg-200)]',
  borderMedium: 'border-[var(--bg-300)]',
  borderBrand: 'border-[var(--primary-100)]',
  borderError: 'border-[var(--error-border)]',
  
  // Button base classes
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
 * Predefined component styles using the light-mode color system
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
  cardBrand: combineColorClasses(
    'bg-[var(--primary-100)]',
    'border-[var(--primary-200)]',
    'shadow-lg',
    'rounded-lg',
    'p-6',
    colorClasses.textWhite
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
    'hover:text-[var(--white-color)]',
    'px-4 py-2 rounded transition-all duration-300'
  ),
  buttonSuccess: combineColorClasses(
    'bg-[var(--accent-green)]',
    'text-[var(--white-color)]',
    'border-[var(--accent-green)]',
    'hover:opacity-90',
    'px-4 py-2 rounded transition-all duration-300'
  ),
  buttonError: combineColorClasses(
    'bg-[var(--accent-red)]',
    'text-[var(--white-color)]',
    'border-[var(--accent-red)]',
    'hover:opacity-90',
    'px-4 py-2 rounded transition-all duration-300'
  ),
  
  // Form elements
  inputDefault: combineColorClasses(colorClasses.input),
  inputError: combineColorClasses(
    colorClasses.input,
    'border-[var(--error-border)]',
    'focus:border-[var(--error-border)]'
  ),
  inputSuccess: combineColorClasses(
    colorClasses.input,
    'border-[var(--accent-green)]',
    'focus:border-[var(--accent-green)]'
  ),
  
  // Navigation elements
  navLink: combineColorClasses(
    colorClasses.textPrimary,
    'hover:text-[var(--primary-100)]',
    'transition-colors duration-300'
  ),
  navLinkActive: combineColorClasses(
    colorClasses.textBrand,
    'font-medium'
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
  
  // Alert/Message styles
  alertSuccess: combineColorClasses(
    'bg-[var(--accent-green)]/10',
    'border-[var(--accent-green)]',
    'text-[var(--text-100)]',
    'border rounded-lg p-4'
  ),
  alertError: combineColorClasses(
    'bg-[var(--error-bg)]',
    'border-[var(--error-border)]',
    'text-[var(--error-text)]',
    'border rounded-lg p-4'
  ),
  alertInfo: combineColorClasses(
    'bg-[var(--primary-100)]/10',
    'border-[var(--primary-100)]',
    'text-[var(--text-100)]',
    'border rounded-lg p-4'
  ),
} as const;

/**
 * CSS-in-JS style objects for inline styles (light mode only)
 */
export const inlineStyles = {
  // Background styles
  bgPrimary: { backgroundColor: 'var(--bg-100)' },
  bgSecondary: { backgroundColor: 'var(--bg-200)' },
  bgTertiary: { backgroundColor: 'var(--bg-300)' },
  bgBrand: { backgroundColor: 'var(--primary-100)' },
  bgBrandHover: { backgroundColor: 'var(--primary-200)' },
  bgSuccess: { backgroundColor: 'var(--accent-green)' },
  bgError: { backgroundColor: 'var(--accent-red)' },
  
  // Text styles
  textPrimary: { color: 'var(--text-100)' },
  textSecondary: { color: 'var(--text-200)' },
  textMuted: { color: 'var(--text-300)' },
  textBrand: { color: 'var(--primary-100)' },
  textWhite: { color: 'var(--white-color)' },
  textSuccess: { color: 'var(--accent-green)' },
  textError: { color: 'var(--error-text)' },
  
  // Border styles
  borderDefault: { borderColor: 'var(--border-color)' },
  borderBrand: { borderColor: 'var(--primary-100)' },
  borderError: { borderColor: 'var(--error-border)' },
  
  // Combined component styles
  cardDefault: {
    backgroundColor: 'var(--bg-200)',
    color: 'var(--text-100)',
    border: '1px solid var(--bg-300)',
    borderRadius: '0.5rem',
    padding: '1.5rem',
  },
  
  buttonPrimary: {
    backgroundColor: 'var(--primary-100)',
    color: 'var(--white-color)',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--text-100)',
    border: '1px solid var(--bg-300)',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
} as const;

const globalStyles = {
  colorClasses,
  combineColorClasses,
  componentStyles,
  inlineStyles,
};

export default globalStyles;

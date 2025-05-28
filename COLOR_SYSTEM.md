# Color System Documentation

This document explains how to use the new color scheme implemented for Sharp Ireland based on the specifications in `copy.txt`.

## Overview

The new color system provides a consistent set of colors for both light and dark themes, with CSS variables that automatically switch based on the current theme.

## Color Variables

### Primary Colors
- `--primary-100`: Main brand color (Light: #0077C2, Dark: #0085ff)
- `--primary-200`: Secondary brand color (Light: #59a5f5, Dark: #69b4ff)
- `--primary-300`: Light brand color (Light: #c8ffff, Dark: #e0ffff)

### Accent Colors
- `--accent-100`: Primary accent (Light: #00BFFF, Dark: #006fff)
- `--accent-200`: Secondary accent (Light: #00619a, Dark: #e1ffff)

### Text Colors
- `--text-100`: Primary text color (Light: #333333, Dark: #FFFFFF)
- `--text-200`: Secondary text color (Light: #5c5c5c, Dark: #9e9e9e)

### Background Colors
- `--bg-100`: Main background (Light: #FFFFFF, Dark: #1E1E1E)
- `--bg-200`: Secondary background (Light: #f5f5f5, Dark: #2d2d2d)
- `--bg-300`: Tertiary background/borders (Light: #cccccc, Dark: #454545)

## Usage in React Components

### Method 1: Inline Styles with CSS Variables
```tsx
<div style={{ backgroundColor: 'var(--bg-200)', color: 'var(--text-100)' }}>
  Content
</div>
```

### Method 2: Using the Color Utility
```tsx
import { getCSSVar, cssVars } from '../utils/colors';

<div style={{ 
  backgroundColor: getCSSVar(cssVars.bg[200]),
  color: getCSSVar(cssVars.text[100])
}}>
  Content
</div>
```

### Method 3: CSS Classes (recommended for repeated use)
```css
.card {
  background-color: var(--bg-200);
  color: var(--text-100);
  border: 1px solid var(--bg-300);
}

.primary-button {
  background-color: var(--primary-100);
  color: var(--bg-100);
  border: none;
}
```

## Theme Integration

The color system is automatically integrated with the existing `ThemeContext`. When users toggle between light and dark themes, all colors update automatically.

```tsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      style={{ 
        backgroundColor: 'var(--primary-100)',
        color: 'var(--bg-100)'
      }}
    >
      Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};
```

## Best Practices

1. **Use CSS Variables**: Always use `var(--variable-name)` instead of hardcoded colors
2. **Semantic Naming**: Use color variables based on their purpose (text, background, primary) rather than their appearance
3. **Consistent Hierarchy**: Use the numbering system consistently (100 for primary, 200 for secondary, etc.)
4. **Test Both Themes**: Always test your components in both light and dark modes
5. **Legacy Compatibility**: The old color variables are still available for backward compatibility

## Migration Guide

If you're updating existing components:

1. Replace hardcoded colors with CSS variables
2. Use the semantic color names (primary, accent, text, bg) instead of generic names
3. Test in both light and dark themes
4. Update any custom CSS to use the new variables

### Before:
```css
.my-component {
  background-color: #FFFFFF;
  color: #333333;
  border: 1px solid #E0E0E0;
}
```

### After:
```css
.my-component {
  background-color: var(--bg-100);
  color: var(--text-100);
  border: 1px solid var(--bg-300);
}
```

## Color Showcase Component

A `ColorShowcase` component has been created to demonstrate all the new colors and provide examples of how to use them. You can add it to any page to see the color system in action:

```tsx
import ColorShowcase from './components/ColorShowcase';

export default function Page() {
  return (
    <div>
      <ColorShowcase />
    </div>
  );
}
```

## Legacy Variables

For backward compatibility, the following legacy variables are still available:
- `--background` (maps to `--bg-100`)
- `--foreground` (maps to `--text-100`)
- `--background-black` (maps to `--bg-100`)
- `--background-lighter` (maps to `--bg-200`)
- `--white-color` (maps to `--text-100`)
- Various border variables (map to bg and text colors)

These will continue to work but it's recommended to migrate to the new semantic variable names for better maintainability.

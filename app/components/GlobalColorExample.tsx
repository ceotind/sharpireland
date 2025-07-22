"use client";

import React from 'react';
import { colorClasses, componentStyles, inlineStyles } from '../utils/globalStyles';

/**
 * Example component showing different ways to use the global color system
 * (Now fixed to dark mode only)
 */
const GlobalColorExample: React.FC = () => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className={`text-4xl font-bold ${colorClasses.textPrimary}`}>
          Global Color System Examples (Dark Mode Only)
        </h1>
        <p className={colorClasses.textSecondary}>
          This component now demonstrates the color system in dark mode only.
        </p>
      </header>

      {/* Method 1: Using CSS Classes */}
      <section className={componentStyles.cardDefault}>
        <h2 className={`text-2xl font-semibold mb-4 ${colorClasses.textBrand}`}>
          Method 1: Using CSS Classes
        </h2>
        <div className="space-y-4">
          <p className={colorClasses.textPrimary}>
            This approach uses predefined CSS classes for consistent styling.
          </p>
          <div className="flex gap-4">
            <button className={componentStyles.buttonPrimary}>Primary Button</button>
            <button className={componentStyles.buttonSecondary}>Secondary Button</button>
            <button className={componentStyles.buttonOutline}>Outline Button</button>
          </div>
          <input
            type="text"
            placeholder="Styled input field"
            className={componentStyles.inputDefault}
          />
        </div>
      </section>

      {/* Method 2: Using Inline Styles */}
      <section style={inlineStyles.cardDefault}>
        <h2 style={{ ...inlineStyles.textBrand, fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Method 2: Using Inline Styles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={inlineStyles.textPrimary}>
            This approach uses CSS-in-JS style objects for dynamic styling.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={inlineStyles.buttonPrimary}>
              Inline Styled Button
            </button>
            <button
              style={{
                ...inlineStyles.buttonPrimary,
                backgroundColor: 'var(--accent-100)',
              }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </section>

      {/* Method 3: Using Tailwind with CSS Variables */}
      <section className="bg-[var(--bg-200)] border border-[var(--bg-300)] rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--primary-100)]">
          Method 3: Using Tailwind with CSS Variables
        </h2>
        <div className="space-y-4">
          <p className="text-[var(--text-100)]">
            This approach uses Tailwind classes with CSS variable values.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--primary-100)] text-[var(--white-color)] p-4 rounded text-center">
              Primary Color
            </div>
            <div className="bg-[var(--accent-100)] text-[var(--white-color)] p-4 rounded text-center">
              Accent Color
            </div>
            <div className="bg-[var(--bg-300)] text-[var(--text-100)] p-4 rounded text-center">
              Background Color
            </div>
          </div>
        </div>
      </section>

      {/* Method 4: Mixed Approach */}
      <section className={`${colorClasses.bgSecondary} border ${colorClasses.borderDefault} rounded-lg p-6`}>
        <h2 style={inlineStyles.textBrand} className="text-2xl font-semibold mb-4">
          Method 4: Mixed Approach
        </h2>
        <div className="space-y-4">
          <p className={colorClasses.textPrimary}>
            You can combine different methods based on your needs.
          </p>
          
          {/* Form Example */}
          <div className="space-y-3">
            <label className={colorClasses.textPrimary}>Name:</label>
            <input
              type="text"
              className={componentStyles.inputDefault}
              placeholder="Enter your name"
            />
            
            <label className={colorClasses.textPrimary}>Message:</label>
            <textarea
              rows={3}
              className={componentStyles.inputDefault}
              placeholder="Enter your message"
              style={{ resize: 'none', width: '100%' }}
            />
            
            <div className="flex gap-3">
              <button className={componentStyles.buttonPrimary}>
                Submit
              </button>
              <button
                style={{
                  ...inlineStyles.buttonPrimary,
                  backgroundColor: 'transparent',
                  color: 'var(--text-100)',
                  border: '1px solid var(--bg-300)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Color Reference */}
      <section className={componentStyles.cardDefault}>
        <h2 className={`text-2xl font-semibold mb-4 ${colorClasses.textBrand}`}>
          Quick Color Reference
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className={`font-semibold mb-2 ${colorClasses.textPrimary}`}>Primary</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--primary-100)]"></div>
                <code>--primary-100</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--primary-200)]"></div>
                <code>--primary-200</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--primary-300)]"></div>
                <code>--primary-300</code>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className={`font-semibold mb-2 ${colorClasses.textPrimary}`}>Accent</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--accent-100)]"></div>
                <code>--accent-100</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--accent-200)]"></div>
                <code>--accent-200</code>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className={`font-semibold mb-2 ${colorClasses.textPrimary}`}>Text</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--text-100)' }}></div>
                <code>--text-100</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--text-200)' }}></div>
                <code>--text-200</code>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className={`font-semibold mb-2 ${colorClasses.textPrimary}`}>Background</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--bg-100)' }}></div>
                <code>--bg-100</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--bg-200)' }}></div>
                <code>--bg-200</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--bg-300)' }}></div>
                <code>--bg-300</code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalColorExample;

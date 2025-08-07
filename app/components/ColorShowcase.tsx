"use client";

import React from 'react';
/**
 * Example component demonstrating the new color system
 * (Now fixed to dark mode only)
 */
const ColorShowcase: React.FC = () => {
  return (
    <div
      id="colorshowcase-div-1"
      className="p-8 space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-100)',
        color: 'var(--text-100)'
      }}
    >
      <div id="colorshowcase-div-2" className="text-center space-y-4">
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--primary-100)' }}
        >
          Sharp Ireland Color Scheme (Dark Mode Only)
        </h2>
        <p style={{ color: 'var(--text-200)' }}>
          This component now demonstrates the color system in dark mode only.
        </p>
      </div>

      {/* Primary Colors */}
      <div id="colorshowcase-div-3" className="space-y-4">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-100)' }}>
          Primary Colors
        </h3>
        <div id="colorshowcase-div-4" className="grid grid-cols-3 gap-4">
          <div
            id="colorshowcase-div-5"
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--primary-100)' }}
          >
            <p className="font-medium" style={{ color: 'var(--bg-100)' }}>
              Primary 100
            </p>
            <code className="text-xs opacity-80" style={{ color: 'var(--bg-100)' }}>
              var(--primary-100)
            </code>
          </div>
          <div
            id="colorshowcase-div-6"
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--primary-200)' }}
          >
            <p className="font-medium" style={{ color: 'var(--bg-100)' }}>
              Primary 200
            </p>
            <code className="text-xs opacity-80" style={{ color: 'var(--bg-100)' }}>
              var(--primary-200)
            </code>
          </div>
          <div
            id="colorshowcase-div-7"
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--primary-300)' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-100)' }}>
              Primary 300
            </p>
            <code className="text-xs opacity-80" style={{ color: 'var(--text-100)' }}>
              var(--primary-300)
            </code>
          </div>
        </div>
      </div>

      {/* Accent Colors */}
      <div id="colorshowcase-div-8" className="space-y-4">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-100)' }}>
          Accent Colors
        </h3>
        <div id="colorshowcase-div-9" className="grid grid-cols-2 gap-4">
          <div
            id="colorshowcase-div-10"
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--accent-100)' }}
          >
            <p className="font-medium" style={{ color: 'var(--bg-100)' }}>
              Accent 100
            </p>
            <code className="text-xs opacity-80" style={{ color: 'var(--bg-100)' }}>
              var(--accent-100)
            </code>
          </div>
          <div
            id="colorshowcase-div-11"
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: 'var(--accent-200)' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-100)' }}>
              Accent 200
            </p>
            <code className="text-xs opacity-80" style={{ color: 'var(--text-100)' }}>
              var(--accent-200)
            </code>
          </div>
        </div>
      </div>

      {/* Text Colors */}
      <div id="colorshowcase-div-12" className="space-y-4">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-100)' }}>
          Text Colors
        </h3>
        <div id="colorshowcase-div-13" className="space-y-2">
          <p className="text-lg" style={{ color: 'var(--text-100)' }}>
            Primary text using var(--text-100)
          </p>
          <p className="text-base" style={{ color: 'var(--text-200)' }}>
            Secondary text using var(--text-200)
          </p>
        </div>
      </div>

      {/* Background Colors */}
      <div id="colorshowcase-div-14" className="space-y-4">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-100)' }}>
          Background Colors
        </h3>
        <div id="colorshowcase-div-15" className="grid grid-cols-3 gap-4">
          <div
            id="colorshowcase-div-16"
            className="p-6 rounded-lg border text-center"
            style={{
              backgroundColor: 'var(--bg-100)',
              borderColor: 'var(--bg-300)',
              color: 'var(--text-100)'
            }}
          >
            <p className="font-medium">BG 100</p>
            <code className="text-xs opacity-60">var(--bg-100)</code>
          </div>
          <div
            id="colorshowcase-div-17"
            className="p-6 rounded-lg border text-center"
            style={{
              backgroundColor: 'var(--bg-200)',
              borderColor: 'var(--bg-300)',
              color: 'var(--text-100)'
            }}
          >
            <p className="font-medium">BG 200</p>
            <code className="text-xs opacity-60">var(--bg-200)</code>
          </div>
          <div
            id="colorshowcase-div-18"
            className="p-6 rounded-lg border text-center"
            style={{
              backgroundColor: 'var(--bg-300)',
              borderColor: 'var(--bg-300)',
              color: 'var(--text-100)'
            }}
          >
            <p className="font-medium">BG 300</p>
            <code className="text-xs opacity-60">var(--bg-300)</code>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div id="colorshowcase-div-19" className="space-y-4">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-100)' }}>
          Usage Examples
        </h3>
        <div id="colorshowcase-div-20" className="space-y-4">
          {/* Card Example */}
          <div
            id="colorshowcase-div-21"
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-200)',
              borderColor: 'var(--bg-300)'
            }}
          >
            <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary-100)' }}>
              Example Card
            </h4>
            <p className="mb-4" style={{ color: 'var(--text-100)' }}>
              This is a card using the new color system.
            </p>
            <button
              className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--accent-100)',
                color: 'var(--bg-100)'
              }}
            >
              Action Button
            </button>
          </div>

          {/* Alert Example */}
          <div
            id="colorshowcase-div-22"
            className="p-4 rounded border-l-4"
            style={{
              backgroundColor: 'var(--primary-300)',
              borderLeftColor: 'var(--primary-100)',
              color: 'var(--text-100)'
            }}
          >
            <p className="font-medium">Information Alert</p>
            <p className="text-sm" style={{ color: 'var(--text-200)' }}>
              This alert uses primary-300 as background and primary-100 as accent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorShowcase;

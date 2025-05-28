"use client";

import ColorShowcase from '../components/ColorShowcase';
import GlobalColorExample from '../components/GlobalColorExample';
import { useTheme } from '../context/ThemeContext';

export default function ColorsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Header showing global color application */}
      <header className="p-6 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sharp Ireland Color System</h1>
            <p className="text-text-200">Current theme: <strong>{theme}</strong></p>
          </div>
          <button 
            onClick={toggleTheme}
            className="btn-primary"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </header>

      {/* Global Color Examples */}
      <GlobalColorExample />

      {/* Original Color Showcase */}
      <section className="border-t">
        <ColorShowcase />
      </section>
      
      {/* Global Form Elements Test */}
      <section className="p-6 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Global Form Elements</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Input Field:</label>
              <input type="text" placeholder="Type here..." className="input-base w-full" />
            </div>
            <div>
              <label className="block mb-2">Textarea:</label>
              <textarea placeholder="Type here..." rows={4} className="input-base w-full resize-none"></textarea>
            </div>
            <div>
              <label className="block mb-2">Select:</label>
              <select className="input-base w-full">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button type="button" className="btn-primary">Submit</button>
              <button type="button" className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

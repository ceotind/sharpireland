/**
 * Comprehensive solution for Chrome sandbox issues on Linux
 * Applies necessary flags to bypass sandbox restrictions in development
 */

export function applyChromeSandboxFix(): string {
  if (process.platform !== 'linux') return '';

  const requiredFlags = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
  ];

  // Apply flags to process environment
  if (!process.env.CHROME_BIN) {
    process.env.CHROME_BIN = 'chromium-browser';
  }

  // Return flags for direct use in command execution
  return requiredFlags.join(' ');
}

// Apply fix immediately when module is loaded
export const CHROME_FLAGS = applyChromeSandboxFix();
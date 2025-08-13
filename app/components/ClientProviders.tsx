"use client";

import { ThemeProvider } from '../context/ThemeContext';
import React, { useEffect } from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize GSAP plugins globally on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadGSAP = async () => {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Make GSAP globally available for components to check
        (window as typeof window & { gsapReady?: boolean }).gsapReady = true;
      };
      
      loadGSAP();
    }
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
}

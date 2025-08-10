"use client";

import { ThemeProvider } from '../context/ThemeContext';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize GSAP plugins globally on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Make GSAP globally available for components to check
      (window as any).gsapReady = true;
    }
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
}

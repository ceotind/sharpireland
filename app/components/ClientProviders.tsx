"use client";

import { ThemeProvider } from '../context/ThemeContext';
import React from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

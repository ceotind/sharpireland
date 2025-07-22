'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import LoadingUI from '../components/LoadingUI';
import { IndustryContent } from '../types/content';
interface ContentState {
  content: IndustryContent | null;
  isLoading: boolean;
  error: Error | null;
}

const ContentContext = createContext<ContentState>({
  content: null,
  isLoading: true,
  error: null
});

interface ContentProviderProps {
  content: IndustryContent | null;
  children: ReactNode;
}

export function ContentProvider({ content, children }: ContentProviderProps) {
  if (!content) {
    return <LoadingUI />;
  }

  return (
    <ContentContext.Provider value={{ content, isLoading: false, error: null }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentState {
  const context = useContext(ContentContext);
  
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  
  return context;
}

export function useContentSection<K extends keyof IndustryContent>(section: K): IndustryContent[K] | undefined {
  const { content, isLoading, error } = useContent();

  if (isLoading || error || !content) {
    return undefined; // Or handle loading/error state as appropriate
  }

  return content[section];
}
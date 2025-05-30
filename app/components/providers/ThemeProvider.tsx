'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isInitialized: boolean;
}

// Initial context value that's safe for server-side rendering
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isInitialized: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // This ensures we don't run any client-specific code during SSR
  const isClient = useIsClient();
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Only runs after client-side hydration is complete
  useEffect(() => {
    if (isClient) {
      try {
        // Check for saved preference
        const savedTheme = localStorage.getItem('theme') as Theme;
        
        // Determine initial theme (saved or system preference)
        let initialTheme: Theme;
        if (savedTheme) {
          initialTheme = savedTheme;
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          initialTheme = prefersDark ? 'dark' : 'light';
        }
        
        // Apply theme to state and document
        setTheme(initialTheme);
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Mark initialization as complete
        setIsInitialized(true);
      } catch (e) {
        // Fallback if anything fails
        console.error('Error initializing theme:', e);
        setIsInitialized(true);
      }
    }
  }, [isClient]);

  const toggleTheme = () => {
    if (!isClient) return; // Safety check
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
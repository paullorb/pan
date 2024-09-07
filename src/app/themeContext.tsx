"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  systemPreference: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  systemPreference: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false); // Ensure we apply the correct theme only once

  // Detect system preference for dark mode and set the initial theme based on it
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemPreference(prefersDarkMode ? 'dark' : 'light');

    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme as 'light' | 'dark'); // If a theme is stored, use it
    } else {
      setTheme(prefersDarkMode ? 'dark' : 'light'); // Default to system preference
    }

    setIsInitialized(true); // Ensure the correct theme is applied after this effect
  }, []);

  // Save theme to localStorage and update document attribute
  useEffect(() => {
    if (isInitialized) {  // Only set the theme after initialization
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

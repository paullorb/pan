"use client";

import React from 'react';
import { useTheme } from '../../../context/themeContext';
import styles from './darkMode.module.css';

const DarkMode: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      className={styles.button}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default DarkMode;
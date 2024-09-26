"use client";

import React from 'react';
import { useTheme } from '../../../context/themeContext';
import styles from './darkMode.module.css';

const DarkMode: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const modes = [
    { name: 'Light', value: 'light', icon: '🌞' },
    { name: 'System', value: 'system', icon: '💻' },
    { name: 'Dark', value: 'dark', icon: '🌑' },
  ];

  return (
    <div className={styles.container}>
      {modes.map((mode) => (
        <button
          key={mode.value}
          className={`${styles.button} ${
            theme === mode.value ? styles.active : ''
          }`}
          onClick={() => setTheme(mode.value as 'light' | 'dark' | 'system')}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
};

export default DarkMode;

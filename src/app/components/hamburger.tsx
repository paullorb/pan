"use client";

import { useTheme } from '../themeContext';
import style from './hamburger.module.css';

export default function Hamburger() {
  const { theme, toggleTheme, systemPreference } = useTheme(); // Get system preference
  const emoji = theme === 'dark' ? '🌞' : '🌑';

  // Function to handle print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={style.container}>
      <div className={style.info}>
        <p>System Preferred Mode: {systemPreference}</p> {/* Display system preference */}
        <p>Current Theme: {theme}</p> {/* Display current theme */}
      </div>
      <button className={style.button} onClick={toggleTheme}>
        {emoji}
      </button>
      <button className={style.button} onClick={handlePrint}>
        🖨️
      </button>
    </div>
  );
}

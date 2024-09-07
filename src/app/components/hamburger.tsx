"use client";

import { useTheme } from '../themeContext';
import style from './hamburger.module.css';

export default function Hamburger() {
  const { theme, toggleTheme } = useTheme(); // Removed systemPreference
  const emoji = theme === 'dark' ? '🌞' : '🌑';

  // Function to handle print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={style.container}>
      <button className={style.button} onClick={toggleTheme}>
        {emoji}
      </button>
      <button className={style.button} onClick={handlePrint}>
        🖨️
      </button>
    </div>
  );
}

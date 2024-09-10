"use client";

import { useTheme } from '../context/themeContext';
import { useState } from 'react';
import AuthModal from './auth'; // Import the AuthModal
import styles from './hamburger.module.css';

const Hamburger: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const emoji = theme === 'dark' ? '🌞' : '🌑';

  const handlePrint = () => {
    window.print();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={toggleTheme}>
        {emoji}
      </button>
      <button className={styles.button} onClick={handlePrint}>
        🖨️
      </button>
      <button className={styles.button} onClick={toggleModal}>
        🔑
      </button>

      <AuthModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Hamburger;

'use client';
import React from 'react';
import styles from './category.module.css';

interface CategoryProps {
  isShown: boolean;
  onToggle: () => void;
}

const Category: React.FC<CategoryProps> = ({ isShown, onToggle }) => {
  return (
    <div className={styles.category}>
      <button className={styles.toggleButton} onClick={onToggle}>
        {isShown ? '🐕' : '🐈'}
      </button>
      <button className={styles.settingsButton}>⚙️</button>
    </div>
  );
};

export default Category;

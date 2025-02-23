'use client';
import React from 'react';
import { useCategory } from './categoryContext';
import styles from './category.module.css';
import { darkenColor } from './utils';

const Categories: React.FC = () => {
  const categories = useCategory();
  return (
    <div className={styles.categories}>
      {categories.map(category => (
        <div
          key={category.name}
          className={styles.categoryItem}
          style={{
            '--bg-color': category.backgroundColor,
            '--border-color': darkenColor(category.backgroundColor, 10)
          } as React.CSSProperties}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Categories;

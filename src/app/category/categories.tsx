'use client';
import React from 'react';
import { useCategory } from './categoryContext';
import styles from './category.module.css';

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = ((num >> 8) & 0x00FF) - amt;
  let B = (num & 0x0000FF) - amt;
  R = R < 0 ? 0 : R;
  G = G < 0 ? 0 : G;
  B = B < 0 ? 0 : B;
  return "#" + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
}

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

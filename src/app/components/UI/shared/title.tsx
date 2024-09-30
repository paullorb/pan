// components/UI/shared/title.tsx

"use client";
import React from 'react';
import styles from './title.module.css';

interface TitleProps {
  title: string;
  count?: {
    completed: number;
    total: number;
  };
}

const Title: React.FC<TitleProps> = ({ title, count }) => {
  return (
    <div className={styles.titleContainer}>
      <h3 className={styles.title}>{title}</h3>
      {count && (
        <div className={styles.count}>
          {count.completed} / {count.total}
        </div>
      )}
    </div>
  );
};

export default Title;

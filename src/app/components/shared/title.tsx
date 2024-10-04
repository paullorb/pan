"use client";
import React from 'react';
import styles from './title.module.css';

interface TitleProps {
  title: string;
  count?: {
    completed: number;
    total: number;
  };
  pagination?: boolean;
  onPrevious?: () => void; // Added onPrevious prop
  onNext?: () => void;     // Added onNext prop
}

const Title: React.FC<TitleProps> = ({ title, count, pagination, onPrevious, onNext }) => {
  return (
    <div className={styles.container}>
      <div className={styles.first}>
        {pagination && (
          <div className={styles.pagination}>
            <button
              aria-label="Previous"
              className={styles.paginationButton}
              onClick={onPrevious} // Added onClick handler
            >
              &lt;
            </button>
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
        {pagination && (
          <div className={styles.pagination}>
            <button
              aria-label="Next"
              className={styles.paginationButton}
              onClick={onNext} // Added onClick handler
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      {count && (
        <div className={styles.second}>
          <div className={styles.count}>
            {count.completed} / {count.total}
          </div>
        </div>
      )}
    </div>
  );
};

export default Title;

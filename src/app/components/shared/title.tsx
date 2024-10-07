// /components/shared/title.tsx
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
  onPrevious?: () => void;
  onNext?: () => void;
  onClick?: () => void;
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  title,
  count,
  pagination,
  onPrevious,
  onNext,
  onClick,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`} onClick={onClick}>
      <div className={styles.first}>
        {pagination && onPrevious && (
          <button
            aria-label="Previous"
            className={styles.paginationButton}
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            &lt;
          </button>
        )}
        <h3 className={styles.title}>{title}</h3>
        {pagination && onNext && (
          <button
            aria-label="Next"
            className={styles.paginationButton}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            &gt;
          </button>
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
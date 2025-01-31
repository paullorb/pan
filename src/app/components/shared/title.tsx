// /components/shared/title.tsx
"use client";

import React from 'react';
import styles from './title.module.css';

interface TitleProps {
  title: string;
  pagination?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onClick?: () => void;
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  title,
  pagination,
  onPrevious,
  onNext,
  onClick,
  className,
}) => {
  return (
    <div className={` ${styles.container}`} onClick={onClick}>
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
        <h3 className={`${styles.title} ${className || ''}`}>{title}</h3>
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
  );
};

export default Title;
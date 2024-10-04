// components/shared/item.tsx

"use client";
import React from 'react';
import styles from './item.module.css';
import Skeleton from './skeleton'; // Import the Skeleton component

interface ItemProps {
  text?: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  inputMode?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean; // New prop for loading state
}

const Item: React.FC<ItemProps> = ({
  text,
  completed = false,
  onToggle,
  onDelete,
  inputMode = false,
  onChange,
  label,
  className,
  children,
  loading = false, // Default to false
}) => {
  if (loading) {
    // Render the Skeleton component when loading
    return (
      <div className={`${styles.item} ${className || ''}`}>
        <Skeleton height="20px" width="100%" />
      </div>
    );
  }

  return (
    <div className={`${styles.item} ${completed ? styles.completed : ''} ${className || ''}`}>
      {children ? (
        children
      ) : inputMode ? (
        <>
          {label && <label className={styles.label}>{label}</label>}
          <input
            className={styles.input}
            type="text"
            value={text}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        </>
      ) : (
        <>
          <span onClick={onToggle} className={styles.text}>
            {text}
          </span>
          {onDelete && (
            <button className={styles.deleteButton} onClick={onDelete}>
              🗑️
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Item;

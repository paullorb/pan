// components/shared/item.tsx

"use client";
import React from 'react';
import styles from './item.module.css';

interface ItemProps {
  text?: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  inputMode?: boolean; // For input fields (e.g., Priorities)
  onChange?: (value: string) => void;
  label?: string; // For labels (e.g., Priorities)
  className?: string;
  children?: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({
  text,
  completed,
  onToggle,
  onDelete,
  inputMode,
  onChange,
  label,
  className,
  children,
}) => {
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

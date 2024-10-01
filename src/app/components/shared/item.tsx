// components/UI/shared/item.tsx

"use client";
import React from 'react';
import styles from './item.module.css';

interface ItemProps {
  text: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  inputMode?: boolean; // For input fields (e.g., Priorities)
  onChange?: (value: string) => void;
  label?: string; // For labels (e.g., Priorities)
}

const Item: React.FC<ItemProps> = ({
  text,
  completed = false,
  onToggle,
  onDelete,
  inputMode = false,
  onChange,
  label,
}) => {
  return (
    <div
      className={`${styles.item} ${completed ? styles.completed : ''}`}
    >
      {inputMode ? (
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

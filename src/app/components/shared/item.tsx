"use client";
import React from 'react';
import styles from './item.module.css';
import Skeleton from './skeleton';
import DelItem from './delItem'; // Import the DelItem component

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
  loading?: boolean;
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
  loading = false,
}) => {
  if (loading) {
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
          {onDelete && <DelItem onDelete={onDelete} />}
        </>
      )}
    </div>
  );
};

export default Item;

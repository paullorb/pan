// components/shared/item.tsx

"use client";
import React, { useState } from 'react';
import styles from './item.module.css';
import TagSelector from './tagSelector'; // Import the TagSelector component

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
  tags?: string[];
  onAddTag?: (tagId: string) => void;
  onRemoveTag?: (tagId: string) => void;
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
  tags = [],
  onAddTag,
  onRemoveTag,
}) => {
  const [showTagSelector, setShowTagSelector] = useState(false);

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
        <div className={styles.itemContent}>
          <span onClick={onToggle} className={styles.text}>
            {text}
          </span>
          <div className={styles.buttons}>
            {onDelete && (
              <button className={styles.deleteButton} onClick={onDelete}>
                🗑️
              </button>
            )}
            {onAddTag && onRemoveTag && (
              <button
                className={styles.tagButton}
                onClick={() => setShowTagSelector(!showTagSelector)}
              >
                🏷️
              </button>
            )}
          </div>
        </div>
      )}
      {/* Render tags if any */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tagId => (
            <span key={tagId} className={styles.tag}>
              {/* For simplicity, display tag ID; you can update this to show tag names */}
              {tagId}
            </span>
          ))}
        </div>
      )}
      {/* Include TagSelector if showTagSelector is true */}
      {showTagSelector && onAddTag && onRemoveTag && (
        <TagSelector
          selectedTags={tags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      )}
    </div>
  );
};

export default Item;

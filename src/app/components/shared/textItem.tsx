// File: app/components/shared/TextItem.tsx

import React from 'react';
import styles from './item.module.css';
import BaseItem from './BaseItem';
import DelItem from './DelItem';

interface TextItemProps {
  text: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  bullet?: boolean;
  className?: string;
}

const TextItem: React.FC<TextItemProps> = ({
  text,
  completed = false,
  onToggle,
  onDelete,
  bullet = false,
  className,
}) => (
  <BaseItem className={`${completed ? styles.completed : ''} ${className || ''}`}>
    <span onClick={onToggle} className={styles.text}>
      {bullet && '• '}{text}
    </span>
    {onDelete && (
      <div className={styles.deleteButton}>
        <DelItem onDelete={onDelete} />
      </div>
    )}
  </BaseItem>
);

export default TextItem;
// components/shared/item.tsx
import React from 'react';
import styles from './item.module.css';
import Skeleton from './skeleton';
import DelItem from './delItem';

interface ItemProps {
  bullet?: boolean;
  children?: React.ReactNode;
  className?: string;
  completed?: boolean;
  disabled?: boolean; 
  inputMode?: boolean;
  id?: string;
  label?: string;
  loading?: boolean;
  text?: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

const Item: React.FC<ItemProps> = ({
  bullet = false,
  className,
  children,
  disabled = false, 
  completed = false,
  inputMode = false,
  label,
  loading = false,
  text,
  onChange,
  onDelete,
  onToggle,
}) => {

  const renderTextItem = () => (
    <>
      {label && <div className={styles.label}>{label}</div>}
      <span onClick={onToggle} className={styles.text}>
        {bullet && '• '}{text}
      </span>
      <div className={styles.actions}>
        {onDelete && <DelItem onDelete={onDelete} />}
      </div>
    </>
  );

  const renderInputItem = () => (
    <>
      {label && <div className={styles.label}>{label}</div>}
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled} 
      />
    </>
  );

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
        renderInputItem()
      ) : (
        renderTextItem()
      )}
    </div>
  );
};

export default Item;
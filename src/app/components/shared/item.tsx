import React from 'react';
import styles from './item.module.css';
import Skeleton from './skeleton';
import DelItem from './delItem';

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
  bullet?: boolean;
  disabled?: boolean; 
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
  bullet = false,
  disabled = false, 
}) => {
  const renderTextItem = () => (
    <>
      <span onClick={onToggle} className={styles.text}>
        {bullet && '• '}{text}
      </span>
      <div className={styles.deleteButton}>
        {onDelete && <DelItem onDelete={onDelete} />}
      </div>
    </>
  );

  const renderInputItem = () => (
    <>
      {label && <label className={styles.label}>{label}</label>}
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
// components/shared/item.tsx
import React from 'react';
import styles from './item.module.css';
import Skeleton from './skeleton';
import DelItem from './delItem';
import { RegularityType } from '../../lib/models/types';

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
  regularity?: {
    value: RegularityType;
    onChange: (value: RegularityType) => void;
  };
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
  id,
  label,
  loading = false,
  text,
  regularity,
  onChange,
  onDelete,
  onToggle,
}) => {
  const renderRegularitySelect = () => regularity && (
    <select 
      className={styles.regularitySelect}
      value={regularity.value}
      onChange={(e) => regularity.onChange(e.target.value as RegularityType)}
      disabled={disabled}
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  );

  const renderTextItem = () => (
    <>
      {label && <div className={styles.label}>{label}</div>}
      <span onClick={onToggle} className={styles.text}>
        {bullet && '• '}{text}
      </span>
      <div className={styles.actions}>
        {regularity && renderRegularitySelect()}
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
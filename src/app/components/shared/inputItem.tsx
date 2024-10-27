// File: app/components/shared/InputItem.tsx

import React from 'react';
import styles from './item.module.css';
import BaseItem from './BaseItem';

interface InputItemProps {
  text: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const InputItem: React.FC<InputItemProps> = ({ text, onChange, label, className }) => (
  <BaseItem className={className}>
    {label && <label className={styles.label}>{label}</label>}
    <input
      className={styles.input}
      type="text"
      value={text}
      onChange={(e) => onChange(e.target.value)}
    />
  </BaseItem>
);

export default InputItem;

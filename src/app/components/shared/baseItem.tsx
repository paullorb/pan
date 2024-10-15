// File: app/components/shared/BaseItem.tsx

import React from 'react';
import styles from './item.module.css';

interface BaseItemProps {
  className?: string;
  children: React.ReactNode;
}

const BaseItem: React.FC<BaseItemProps> = ({ className, children }) => (
  <div className={`${styles.item} ${className || ''}`}>{children}</div>
);

export default BaseItem;
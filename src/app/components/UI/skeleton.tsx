// Skeleton.tsx
import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ height = '20px', width = '100%' }) => {
  return <div className={styles.skeleton} style={{ height, width }} />;
};

export default Skeleton;

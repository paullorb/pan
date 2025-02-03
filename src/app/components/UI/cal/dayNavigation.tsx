// dayNavigation.tsx

"use client";

import React from 'react';
import styles from './calendar.module.css';

interface DayNavigationProps {
  formattedDate: string;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const DayNavigation: React.FC<DayNavigationProps> = ({
  formattedDate,
  onPrev,
  onNext,
  onReset,
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => (
  <div className={styles.dayNavigation}>
    <button onClick={onPrev}>‹</button>
    <p
      className={styles.formattedDate}
      onClick={onReset}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {formattedDate}
    </p>
    <button onClick={onNext}>›</button>
  </div>
);

export default DayNavigation;

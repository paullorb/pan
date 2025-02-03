// weekdayDisplay.tsx

import React from 'react';
import styles from './calendar.module.css';

interface WeekdayDisplayProps {
  weekday: string;
}

const WeekdayDisplay: React.FC<WeekdayDisplayProps> = ({ weekday }) => (
  <div className={styles.weekdayDisplay}>
    <p>{weekday}</p>
  </div>
);

export default WeekdayDisplay;

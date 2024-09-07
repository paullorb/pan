import React, { useEffect, useState } from 'react';
import { useHours } from '../hoursContext'; // Adjust the import path as necessary
import Adjuster from './adjuster';
import style from './hour.module.css';

interface HourProps {
  hour: number;
}

const Hour: React.FC<HourProps> = ({ hour }) => {
  const { activities, handleActivityChange } = useHours();
  const activityFull = activities[`${hour}:00`] || '';
  const activityHalf = activities[`${hour}:30`] || '';

  // Generalized copy function
  const handleCopy = (sourceTime: string, destinationTime: string) => {
    const value = activities[sourceTime] || '';
    handleActivityChange(destinationTime, value);
  };

  // State to track if the fields are merged
  const [isMergedHalf, setIsMergedHalf] = useState(false); // Merging activityFull with activityHalf

  // Merge function: Check if two input fields have the same value, and if so, merge them
  useEffect(() => {
    // Merging activityFull and activityHalf
    if (activityFull === activityHalf && activityFull !== '') {
      setIsMergedHalf(true); // Set merged state when values match
    } else {
      setIsMergedHalf(false); // Reset merge state if values differ
    }
  }, [activityFull, activityHalf]);

  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <div className={style.pan}>
          <input
            type="text"
            className={style.event}
            placeholder={`🍞 at ${hour}:00`}
            value={activityFull}
            onChange={(e) => handleActivityChange(`${hour}:00`, e.target.value)}
          />
          <Adjuster onIncrease={() => handleCopy(`${hour}:00`, `${hour}:30`)} />
        </div>

        {/* Conditionally render the second input field based on the isMergedHalf state */}
        {!isMergedHalf && (
          <div className={style.pan}>
            <input
              type="text"
              className={style.event}
              placeholder={`🍞 at ${hour}:30`}
              value={activityHalf}
              onChange={(e) => handleActivityChange(`${hour}:30`, e.target.value)}
            />
            <Adjuster onIncrease={() => handleCopy(`${hour}:30`, `${hour + 1}:00`)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hour;

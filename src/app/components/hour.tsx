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
  const nextActivityFull = activities[`${hour + 1}:00`] || '';

  // Generalized copy function
  const handleCopy = (sourceTime: string, destinationTime: string) => {
    const value = activities[sourceTime] || '';
    handleActivityChange(destinationTime, value);
  };

  // State to track if the current hour should be merged with the next
  const [isMergedIntoNext, setIsMergedIntoNext] = useState(false);
  const [isMiddleOfRepeatedActivity, setIsMiddleOfRepeatedActivity] = useState(false);
  const [isMergedWithinHour, setIsMergedWithinHour] = useState(false);

  useEffect(() => {
    if (
      activityFull === activityHalf &&
      activityFull === nextActivityFull &&
      activityFull !== ''
    ) {
      setIsMergedIntoNext(true); // Hide middle hours
    } else {
      setIsMergedIntoNext(false); // Show first and last instance of the activity
    }

    if (
      activityFull === nextActivityFull &&
      activityFull !== '' &&
      (activities[`${hour - 1}:00`] === activityFull || activities[`${hour - 1}:30`] === activityFull)
    ) {
      setIsMiddleOfRepeatedActivity(true); // Hide middle occurrences
    } else {
      setIsMiddleOfRepeatedActivity(false);
    }

    if (activityFull === activityHalf && activityFull !== '') {
      setIsMergedWithinHour(true); // Hide the second input field in the same hour
    } else {
      setIsMergedWithinHour(false); // Show both fields if they differ
    }
  }, [activityFull, activityHalf, nextActivityFull, activities, hour]);

  if (isMiddleOfRepeatedActivity) {
    return null;
  }

  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <div className={`${style.pan} ${isMergedWithinHour ? style.centered : ''}`}>
          <input
            type="text"
            className={style.event}
            placeholder={`🍞 at ${hour}:00`}
            value={activityFull}
            onChange={(e) => handleActivityChange(`${hour}:00`, e.target.value)}
          />
          <Adjuster onIncrease={() => handleCopy(`${hour}:00`, `${hour}:30`)} />
        </div>

        {/* Conditionally render the second input field with hover effect */}
        {!isMergedWithinHour && (
          <div className={`${style.pan} ${style.hideOnHover}`}>
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

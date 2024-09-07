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

  // State to track if the current hour should be merged with the next
  const [isMergedIntoNext, setIsMergedIntoNext] = useState(false);
  // State to track if the current hour is in the middle of a repeated activity
  const [isMiddleOfRepeatedActivity, setIsMiddleOfRepeatedActivity] = useState(false);
  // State to track if activityFull and activityHalf are the same (for merging within the hour)
  const [isMergedWithinHour, setIsMergedWithinHour] = useState(false);

    // Generalized copy function
    const handleCopy = (sourceTime: string, destinationTime: string) => {
      const value = activities[sourceTime] || '';
      handleActivityChange(destinationTime, value);
    };

  // Check if the current hour's activity is repeated in the next hour
  useEffect(() => {
    // Check if the current hour's fields should be merged into the next
    if (
      activityFull === activityHalf &&
      activityFull === nextActivityFull &&
      activityFull !== ''
    ) {
      setIsMergedIntoNext(true); // Hide the middle hours
    } else {
      setIsMergedIntoNext(false); // Show the first and last instance of the activity
    }

    // Check if the current hour is the middle of a repeated activity (to hide)
    if (
      activityFull === nextActivityFull &&
      activityFull !== '' &&
      (activities[`${hour - 1}:00`] === activityFull || activities[`${hour - 1}:30`] === activityFull)
    ) {
      setIsMiddleOfRepeatedActivity(true); // Hide middle occurrences
    } else {
      setIsMiddleOfRepeatedActivity(false);
    }

    // Check if the activity within the same hour is the same for both fields
    if (activityFull === activityHalf && activityFull !== '') {
      setIsMergedWithinHour(true); // Hide the second input field in the same hour
    } else {
      setIsMergedWithinHour(false); // Show both fields if they differ
    }
  }, [activityFull, activityHalf, nextActivityFull, activities, hour]);

  // Return null if this is the middle of a repeated activity (hide it)
  if (isMiddleOfRepeatedActivity) {
    return null;
  }

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

        {/* Conditionally render the second input field based on the isMergedWithinHour state */}
        {!isMergedWithinHour && (
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

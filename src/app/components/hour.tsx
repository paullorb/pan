import React, { useEffect, useState } from 'react';
import { useHours } from '../context/hoursContext';
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

  const handleCopy = (sourceTime: string, destinationTime: string) => {
    handleActivityChange(destinationTime, activities[sourceTime] || '');
  };

  const [isMerged, setIsMerged] = useState({
    intoNext: false,
    withinHour: false,
    repeatedMiddle: false,
  });

  useEffect(() => {
    setIsMerged({
      intoNext:
        activityFull === activityHalf &&
        activityFull === nextActivityFull &&
        activityFull !== '',
      withinHour: activityFull === activityHalf && activityFull !== '',
      repeatedMiddle:
        activityFull === nextActivityFull &&
        activityFull !== '' &&
        (activities[`${hour - 1}:00`] === activityFull || activities[`${hour - 1}:30`] === activityFull),
    });
  }, [activityFull, activityHalf, nextActivityFull, activities, hour]);

  // Determine background class based on the evenness of the hour
  const backgroundClass = hour % 2 === 0 ? style.altBackground1 : style.altBackground2;

  if (isMerged.repeatedMiddle) return null;

  return (
    <div className={`${style.frame} ${backgroundClass}`}>
      <div className={`${style.hour} ${backgroundClass}`}>{hour}:00</div>
      <div className={style.events}>
        <div className={`${style.pan} ${backgroundClass} ${isMerged.withinHour ? style.centered : ''}`}>
          <input
            type="text"
            className={style.event}
            placeholder={`🍞 at ${hour}:00`}
            value={activityFull}
            onChange={(e) => handleActivityChange(`${hour}:00`, e.target.value)}
          />
          <Adjuster onIncrease={() => handleCopy(`${hour}:00`, `${hour}:30`)} />
        </div>
        {!isMerged.withinHour && (
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

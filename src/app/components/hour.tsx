// Hour.tsx
import Adjuster from './adjuster';
import style from './hour.module.css';

interface HourProps {
  hour: number;
  activityFull: string;
  activityHalf: string;
  onActivityChange: (hourKey: string, value: string) => void;
}

const Hour: React.FC<HourProps> = ({ hour, activityFull, activityHalf, onActivityChange }) => {
  // Function to copy full hour activity to half hour
  const handleCopyFullToHalf = () => {
    onActivityChange(`${hour}:30`, activityFull);
  };

  const handleCopyHalfToNext = () => {
    onActivityChange(`${hour+1}:00`, activityHalf);
  };

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
            onChange={(e) => onActivityChange(`${hour}:00`, e.target.value)}
          />
          <Adjuster onIncrease={handleCopyFullToHalf} />
        </div>
        <div className={style.pan}>
          <input 
            type="text" 
            className={style.event} 
            placeholder={`🍞 at ${hour}:30`} 
            value={activityHalf}
            onChange={(e) => onActivityChange(`${hour}:30`, e.target.value)}
          />
          <Adjuster onIncrease={handleCopyHalfToNext} />
        </div>
      </div>
    </div>
  );
};

export default Hour;

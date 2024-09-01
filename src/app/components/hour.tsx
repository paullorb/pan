// components/hour.tsx
import style from './hour.module.css';

interface HourProps {
  hour: number;
  activityFull: string;
  activityHalf: string;
  onActivityChange: (hourKey: string, value: string) => void;
}

export default function Hour({ hour, activityFull, activityHalf, onActivityChange }: HourProps) {
  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <input 
          type="text" 
          className={style.event} 
          placeholder={`🍞 at ${hour}:00`} 
          value={activityFull}
          onChange={(e) => onActivityChange(`${hour}:00`, e.target.value)}
        />
        <input 
          type="text" 
          className={style.event} 
          placeholder={`🍞 at ${hour}:30`} 
          value={activityHalf}
          onChange={(e) => onActivityChange(`${hour}:30`, e.target.value)}
        />
      </div>
    </div>
  );
}

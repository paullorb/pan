// components/hour.tsx
import style from './hour.module.css';

export default function Hour({ hour }: { hour: number }) {
  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <input 
          type="text" 
          className={style.event} 
          placeholder={`🍞 at ${hour}:00`} 
        />
        <input 
          type="text" 
          className={style.event} 
          placeholder={`🍞 at ${hour}:30`} 
        />
      </div>
    </div>
  );
}

// components/hours.tsx
import Hour from './hour';
import style from './hour.module.css';

export default function Hours() {
  return (
    <div className={style.hourly}>
      {Array.from({ length: 24 }, (_, i) => (
        <Hour key={i} hour={i} />
      ))}
    </div>
  );
}

// components/hours.tsx
import Hour from './hour';
import style from './hour.module.css';

interface HoursProps {
  from: number;
  until: number;
}

export default function Hours({ from, until }: HoursProps) {
  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  return (
    <div className={style.hourly}>
      {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
        <Hour key={i} hour={validFrom + i} />
      ))}
    </div>
  );
}

// components/hours.tsx
import Hour from './hour';
import style from './hour.module.css';

// Define props interface for type safety
interface HoursProps {
  from: number;
  until: number;
}

export default function Hours({ from, until }: HoursProps) {
  // Ensure the 'from' and 'until' values are within valid ranges and logical
  const validFrom = Math.max(0, Math.min(23, from));   // Ensures 'from' is between 0 and 23
  const validUntil = Math.max(validFrom, Math.min(23, until)); // Ensures 'until' is no less than 'from' and not greater than 23

  return (
    <div className={style.hourly}>
      {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
        <Hour key={i} hour={validFrom + i} />
      ))}
    </div>
  );
}

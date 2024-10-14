import { useDate } from '../../context/dateContext';
import style from './week.module.css';

export default function Week() {
  const { selectedDate } = useDate();

  // Function to get the start of the week (Monday)
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay(); // Sunday - Saturday : 0 - 6
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(selectedDate));

  // Generate array of dates for the week
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div className={style.container}>
      {days.map((date) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        return (
          <div
            key={date.toISOString()}
            className={`${style.day} ${isSelected ? style.selectedDay : ''}`}
          >
            <div className={style.dayName}>{dayName}</div>
          </div>
        );
      })}
    </div>
  );
}
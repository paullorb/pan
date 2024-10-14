import style from './workWeek.module.css';

export default function WorkWeek() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className={style.container}>
      {days.map((day) => (
        <div key={day} className={style.day}>
          <div className={style.dayName}>{day}</div>
        </div>
      ))}
    </div>
  );
}
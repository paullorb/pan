import style from './month.module.css';

export default function Month() {  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
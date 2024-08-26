import style from './hour.module.css';

export default function Hour({ hour }: { hour: number }) {
  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <div className={style.event}>🍞</div>
        <div className={style.event}>🍞</div>
      </div>
    </div>
  );
}

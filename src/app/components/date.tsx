// components/Date.tsx
import style from './date.module.css';

export default function DateComponent() {
  function getTomorrowDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return tomorrow.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function getTomorrowWeekday(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return tomorrow.toLocaleDateString('en-EN', { weekday: 'long' });
  }

  return (
    <div className={style.container}>
      <h1 className={style.date}>🍞 {getTomorrowDate()}</h1>
      <h2 className={style.weekday}>{getTomorrowWeekday()}</h2>
    </div>
  );
}

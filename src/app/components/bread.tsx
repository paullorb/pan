import style from './notes.module.css';

export default function Bread () {
  return (
  <div className={style.notes}>
    <div className={style.title}>Bread</div>
    <div className={style.note}>🍞 Physio Übungen</div>
    <div className={style.note}>🍞 Duolingo</div>
    <div className={style.note}>🍞 Disagreeing techniques</div>
  </div>
  )
}
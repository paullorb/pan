import style from './panes.module.css';

export default function Panes () {
  return (
  <div className={style.notes}>
    <div className={style.title}>Panes</div>
    <div className={style.note}>🍞 Physio Übungen</div>
    <div className={style.note}>🍞 Duolingo</div>
    <div className={style.note}>🍞 Disagreeing techniques</div>
  </div>
  )
}
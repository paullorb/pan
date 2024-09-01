import style from './notes.module.css';

export default function Notes () {
  return (
  <div className={style.notes}>
    <div className={style.title}>NOTES</div>
    <div className={style.note}>🍞 Notizen übertragen</div>
    <div className={style.note}>🍞</div>
    <div className={style.note}>🍞</div>
  </div>
  )
}
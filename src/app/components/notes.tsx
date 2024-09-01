import style from './notes.module.css';

export default function Notes () {
  return (
  <div className={style.notes}>
    <div className={style.title}>NOTES</div>
    <div className={style.note}>🍞 Notizen übertragen</div>
    <div className={style.note}>🍞 Duolingo</div>
    <div className={style.note}>🍞 Fahrrad in die Werkstatt</div>
    <div className={style.note}>🍞 Pasaporte holen</div>
    <div className={style.note}>🍞 Disagreeing techniques</div>
    <div className={style.note}>🍞 Mieterverein</div>
  </div>
  )
}
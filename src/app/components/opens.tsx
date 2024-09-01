import style from './opens.module.css';

export default function Opens () {
  return ( 
    <div className={style.opens}>
      <div className={style.title}>OPEN</div>
        <div className={style.open}>🍞 Cable barberass</div>
        <div className={style.open}>🍞 Staubsaugen</div>
        <div className={style.open}>🍞 Notizen übertragen</div>
        <div className={style.open}>🍞 Linkedin Post</div>

      </div>
  )
}
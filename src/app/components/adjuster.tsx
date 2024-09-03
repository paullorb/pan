import style from './adjuster.module.css';

export default function Adjuster () {
  return (
    <div className={style.container}>
      <h6 className={style.button}>+</h6>
      <h6 className={style.button}>-</h6>
    </div>
  )
}
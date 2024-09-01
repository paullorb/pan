import style from './priorities.module.css';

export default function Priorities () {
  return (
    <div className={style.container}>
      <div className={style.title}>PRIORITIES</div>
      <div className={style.priorities}>
        <div className={style.priority}>1</div>
        <div className={style.priority}>2</div>
        <div className={style.priority}>3</div>
      </div>
    </div>
  )
}
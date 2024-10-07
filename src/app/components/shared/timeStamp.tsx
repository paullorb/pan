import style from './timeStamp.module.css';

export default function TimeStamp () {
  return (
    <div className={style.container}>
      <span>Timestamp: {new Date().toLocaleString()}</span>
    </div>
  )
}
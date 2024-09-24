import style from './dots.module.css';

export default function Dots () {
  return (
    <div className={style.container}>
      <div className={style.dot}>•</div>
      <div className={style.dot}>•</div>
      <div className={style.dot}>•</div>
    </div>
  );
}
// /components/layout/nav.tsx

import DateComponent from '../UI/date/date';
import Hamburger from '../UI/hamburger/hamburger';
import style from './nav.module.css';

export default function Nav () {
  return (
    <nav className={style.container}>
      <div className={style.leftUp}>
        <DateComponent  />
      </div>
      <div className={style.rightUp}>
        <div className={style.titleC}>
          <h1 className={style.title}>
            <span className={style.emoji}>🍞 </span>Pansito del día
          </h1>
        </div>
          <Hamburger />
        </div>
    </nav>
  )
}
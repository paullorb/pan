// /components/layout/nav.tsx

import Link from 'next/link';
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
          <Link href="/" className={style.title}> 🍞Pansito del día </Link>
        </div>
          <Hamburger />
        </div>
    </nav>
  )
}
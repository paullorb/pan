// nav.tsx

import Link from 'next/link';
import DateComponent from '../UI/date/date';
import Navigation from '../UI/navigation/navigation';
import style from './nav.module.css';

export default function Nav () {
  return (
    <nav className={style.container}>
      <div className={style.leftUp}>
        <DateComponent  />
      </div>
      <div className={style.rightUp}>
          <Link href="/" className={style.title}>🍞 Pansito</Link>
          <Navigation />
        </div>
    </nav>
  )
}
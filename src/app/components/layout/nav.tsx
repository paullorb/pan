import DateComponent from '../UI/date/date';
import Navigation from '../UI/navigation/navigation';
import style from './nav.module.css';

export default function Nav () {
  return (
    <nav className={style.container}>
      <DateComponent  />
      <Navigation />
    </nav>
  )
}
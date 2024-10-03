import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Hours from './components/toggles/hours/hours';
import Hamburger from './components/UI/hamburger/hamburger';
import Aside from './components/layout/aside';
import DateComponent from './components/toggles/date/date';

export default function Home() {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
        <div className={style.leftUp}>
          <DateComponent />
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
      <div className={style.tables}>
        <div className={style.leftDown}>
        <Aside />
        </div>
        <div className={style.rightDown}>
        <Hours />
        </div>
      </div>
  </div>
  );
}

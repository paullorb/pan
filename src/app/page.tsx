import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Hours from './components/toggles/hours';
import Tasks from './components/toggles/tasks';
import Priority from './components/toggles/priorities';
import DateComponent from './components/toggles/date';
import Hamburger from './components/UI/hamburger';
import Month from './components/toggles/month';
import Momentum from './components/toggles/momentum';
import Language from './components/toggles/language';
import Aside from './components/layout/aside';

export default function Home() {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
        <div className={`${style.side} ${style.sideLeft}`}>
          <Language />
        </div>
        <div className={style.titleC}>
          <h1 className={style.title}>
            <span className={style.emoji}>🍞 </span>Pansito del día
          </h1>
        </div>
        <div className={`${style.side} ${style.sideRight}`}>
          <Hamburger />
        </div>
      </nav>
      <div className={style.tables}>
        <Aside />
        <main className={style.main}>
          <Hours />
          {/* <Moments /> */}
        </main>
      </div>
    </div>
  );
}

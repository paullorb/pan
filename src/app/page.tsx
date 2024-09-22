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
        <aside className={style.aside}>
          <div className={style.top}>
            <DateComponent />
            <Month />
            <Priority />
          </div>
          <div className={style.bottom}>
            <Tasks />
            <Momentum />
          </div>
        </aside>
        {/* Removed Controls from here */}
        <main className={style.main}>
          <Hours />
          {/* <Moments /> */}
        </main>
      </div>
    </div>
  );
}

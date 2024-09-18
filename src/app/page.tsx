import './aesthetics/globals.css'
import style from './aesthetics/page.module.css';
import Hours from './components/toggles/hours';
import Tasks from './components/toggles/tasks';
import Priority from './components/toggles/priorities';
import DateComponent from './components/toggles/date'; 
import Hamburger from './components/layout/hamburger';
import Controls from './components/toggles/controls';
import Month from './components/toggles/month';
import Moments from './components/toggles/moments';
import Toggles from './components/UI/toggles';
import Momentum from './components/toggles/momentum';

export default function Home() {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
      <div className={`${style.side} ${style.sideLeft}`}>
        <Toggles />
      </div>
      <div className={style.titleC}><h1 className={style.title}><span className={style.emoji}>🍞 </span>Pansito del día</h1></div>
      <div className={`${style.side} ${style.sideRight}`}>
        <Hamburger />
      </div>
      </nav>
      <div className={style.tables}>
        <div className={style.aside}>
          <div className={style.top}>
            <DateComponent />
            <Month />
            <Priority />
          </div>
          <div className={style.bottom}>
            <Tasks />
            <Momentum />
          </div>
        </div>
        <Controls />
        <div className={style.header}>
          <Hours />
          {/* <Moments /> */}
        </div>
      </div>
    </div>
  );
}

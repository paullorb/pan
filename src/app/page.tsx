import './aesthetics/globals.css'
import style from './aesthetics/page.module.css';
import Hours from './components/hours';
import Tasks from './components/tasks';
import Priority from './components/priorities';
import DateComponent from './components/date'; 
import Panes from './components/panes';
import Hamburger from './components/hamburger';
import Controls from './components/controls';
import Month from './components/month';
import Moments from './components/moments';
import Toggles from './components/toggles';

export default function Home() {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
      <div className={`${style.side} ${style.sideLeft}`}>
        {/* <Toggles /> */}
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
            <Panes />
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

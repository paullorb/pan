// page.tsx

import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Hamburger from './components/UI/hamburger/hamburger';
import Aside from './components/layout/aside';
import DateComponent from './components/toggles/date/date';
import MainComponent from './components/layout/main';

export default function Home() {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
          <DateComponent />
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
        <Aside />
        <MainComponent />
      </div>
  </div>
  );
}

import './aesthetics/globals.css'
import style from './aesthetics/page.module.css';
import Hours from './components/hours';
import Opens from './components/opens';
import Priority from './components/priorities';
import DateComponent from './components/date'; 
import Bread from './components/bread';
import Hamburger from './components/hamburger';
import Controls from './components/controls';
import Month from './components/month';

export default function Home() {
  return (
    <div className={style.container}>
      <h1 className={style.title}>🍞 Pansito del día</h1>
      <div className={style.tables}>
        <Controls />
        <div className={style.header}>
          <Hours />
        </div>
        <div className={style.aside}>
          <div className={style.top}>
            <DateComponent />
            <Hamburger />
            <Month />
            <Priority />
          </div>
          <div className={style.bottom}>
            <Opens />
            <Bread />
          </div>
        </div>
      </div>
    </div>
  );
}

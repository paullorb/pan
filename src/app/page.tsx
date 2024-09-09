import './globals.css';
import style from './page.module.css';
import Hours from './components/hours';
import Opens from './components/opens';
import Priority from './components/priorities';
import DateComponent from './components/date'; 
import Bread from './components/bread';
import Hamburger from './components/hamburger';
import Controls from './components/controls';

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.sides}></div>
      <h1 className={style.title}>🍞 Pansito del día</h1>
      <div className={style.sides}>
        <Hamburger />
      </div>
      </div>
      <div className={style.tables}>
        <Controls />
        <div className={style.head}>
          <Hours />
        </div>
        <div className={style.aside}>
          <div className={style.top}>
            <DateComponent />
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

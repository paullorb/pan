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
      <h1 className={style.title}>🍞 Pansito del día</h1>
      <div className={style.tables}>
        <div className={style.header}>
          <Controls />
          <Hours from={5} until={23} />
        </div>
        <div className={style.aside}>
          <div className={style.top}>
            <DateComponent />
            <Hamburger />
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

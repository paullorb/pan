import './globals.css';
import style from './page.module.css';
import Hours from './components/hours';
import Opens from './components/opens';
import Priority from './components/priorities';
import Notes from './components/notes';
import DateComponent from './components/date'; 

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.tables}>
        <Hours from={5} until={23} />
        <div className={style.aside}>
          <div className={style.top}>
            <DateComponent />
            <Priority />
          </div>
          <div className={style.bottom}>
            <Opens />
            <Notes />
          </div>
        </div>
      </div>
    </div>
  );
}

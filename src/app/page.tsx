// page.tsx

import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Aside from './components/layout/aside';
import Header from './components/layout/Header';
import MainComponent from './components/layout/main';
import Nav from './components/layout/nav';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <div className={style.content}>
        {/* <Header /> */}
        <div className={style.tables}>
          <Aside />
          {/* <MainComponent /> */}
        </div>
      </div>
  </div>
  );
}

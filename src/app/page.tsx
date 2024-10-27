// page.tsx

import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Aside from './components/layout/Aside';
import Header from './components/layout/Header';
import MainComponent from './components/layout/Main';
import Nav from './components/layout/Nav';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <Header />
      <div className={style.tables}>
        <Aside />
        <MainComponent />
      </div>
  </div>
  );
}

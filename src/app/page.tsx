// page.tsx

import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import Aside from './components/layout/aside';
import Nav from './components/layout/nav';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <div className={style.content}>
        <div className={style.tables}>
          <Aside />
        </div>
      </div>
  </div>
  );
}

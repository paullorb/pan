// page.tsx

import MainComponent from './components/layout/mainComponent';
import Nav from './components/layout/nav';
import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <MainComponent />
  </div>
  );
}

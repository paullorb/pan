// page.tsx

import './aesthetics/globals.css';
import style from './aesthetics/page.module.css';
import MainComponent from './components/layout/mainComponent';
import Nav from './components/layout/nav';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <MainComponent />
  </div>
  );
}

// page.tsx

import style from './page.module.css';
import Nav from '../components/layout/Nav';
import MainComponent from './components/main';

export default function Home() {
  return (
    <div className={style.container}>
      <Nav />
      <MainComponent />
  </div>
  );
}

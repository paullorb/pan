import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import style from './mainComponent.module.css';

export default function MainComponent() {

  return (
    <main className={style.container}>
      <Month />
      <Priority />
    </main>
  );
};
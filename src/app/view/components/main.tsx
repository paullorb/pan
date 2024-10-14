import style from './main.module.css';
import Week from './week';

export default function MainComponent() {
  return (
    <div className={style.container}>
      <Week />
    </div>
  );
}
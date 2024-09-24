// dots.tsx
import style from './dots.module.css';

interface DotsProps {
  hasUncompletedTasks: boolean;
}

export default function Dots({ hasUncompletedTasks }: DotsProps) {
  return (
    <div className={style.container}>
      <div className={`${style.dot} ${hasUncompletedTasks ? style.uncompleted : ''}`}>•</div>
      <div className={style.dot}>•</div>
      <div className={style.dot}>•</div>
    </div>
  );
}

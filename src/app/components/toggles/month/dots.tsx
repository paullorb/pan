// dots.tsx
import style from './dots.module.css';

interface DotsProps {
  hasUncompletedTasks: boolean;
  allTasksCompleted: boolean;
}

export default function Dots({ hasUncompletedTasks, allTasksCompleted }: DotsProps) {
  let dotClass = style.dot;

  if (hasUncompletedTasks) {
    dotClass += ` ${style.uncompleted}`; // Red color
  } else if (allTasksCompleted) {
    dotClass += ` ${style.completed}`; // Green color
  }

  return (
    <div className={style.container}>
      <div className={dotClass}>•</div>
      <div className={style.dot}>•</div>
      <div className={style.dot}>•</div>
    </div>
  );
}

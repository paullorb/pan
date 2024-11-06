// dots.tsx
import style from './dots.module.css';

interface DotsProps {
  hasUncompletedTasks: boolean;
  allTasksCompleted: boolean;
  isTodo: boolean; // New prop
}

export default function Dots({ hasUncompletedTasks, allTasksCompleted, isTodo }: DotsProps) {
  let dotClass = style.dot;

  if (isTodo) {
    dotClass += ` ${style.todo}`; // Gray color for future tasks
  } else if (hasUncompletedTasks) {
    dotClass += ` ${style.uncompleted}`; // Red color for uncompleted tasks
  } else if (allTasksCompleted) {
    dotClass += ` ${style.completed}`; // Green color for all tasks completed
  }

  return (
    <div className={style.container}>
      <div className={style.dot}>•</div>
      <div className={dotClass}>•</div>
      <div className={style.dot}>•</div>
    </div>
  );
}

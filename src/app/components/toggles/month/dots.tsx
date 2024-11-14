// dots.tsx
import style from './dots.module.css';

interface DotsProps {
  hasUncompletedTasks: boolean;
  allTasksCompleted: boolean;
  isTodo: boolean;
}

export default function Dots({ hasUncompletedTasks, allTasksCompleted, isTodo }: DotsProps) {
  let dotClass = style.dot;

  if (isTodo) {
    dotClass += ` ${style.todo}`;
  } else if (allTasksCompleted) {
    dotClass += ` ${style.completed}`; 
  } else if (hasUncompletedTasks) {
    dotClass += ` ${style.uncompleted}`;
  }

  return (
    <div className={style.container}>
      <div className={dotClass}>•</div>
      {/* <div className={style.test}></div> */}
    </div>
  );
}
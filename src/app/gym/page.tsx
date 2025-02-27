import WorkoutScroll from "./workoutScroll";
import { workouts } from "./workoutData";
import styles from "./page.module.css";

export default function GymPage() {
  const workout = workouts[0];
  return (
    <div className={styles.container}>
      <h1>{workout.title} Workout</h1>
      <WorkoutScroll exercises={workout.exercises} />
    </div>
  );
}

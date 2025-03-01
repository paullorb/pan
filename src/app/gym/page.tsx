import WorkoutSelection from "./workoutSelection";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>Select Your Workout</h1>
      <WorkoutSelection />
    </div>
  );
}

import { notFound } from "next/navigation";
import WorkoutScroll from "../workoutScroll";
import { workouts } from "../workoutData";
import styles from "../page.module.css";

export default async function WorkoutDetailPage({
  params,
}: {
  params: any;
}): Promise<JSX.Element> {
  const { workoutId } = await Promise.resolve(params);
  const workout = workouts.find((w) => w.id === Number(workoutId));
  if (!workout) {
    notFound();
  }
  return (
    <div className={styles.container}>
      <h1>{workout.title} Workout</h1>
      <WorkoutScroll exercises={workout.exercises} />
    </div>
  );
}

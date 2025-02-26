import Image from "next/image";
import { Exercise } from "./workoutData";
import styles from "./page.module.css";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className={styles.card}>
      <h2>{exercise.title}</h2>
      <Image src={exercise.image} alt={exercise.title} width={300} height={300} />
      <p className={styles.description}>{exercise.series}</p>
      <p className={styles.description}>{exercise.repetitions}</p>
      {exercise.notes && <p className={styles.description}>{exercise.notes}</p>}
    </div>
  );
}

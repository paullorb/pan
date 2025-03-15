"use client"
import { useWorkout } from "../workout/workoutContext"
import styles from "./progressLine.module.css"

export default function ProgressLine({ currentExercise }: { currentExercise: string }) {
  const { exercises } = useWorkout()
  return (
    <div className={styles.container}>
      {exercises.map((exercise) => (
        <div key={exercise} className={styles.item}>
          <div className={styles.label}>{exercise}</div>
          <div
            className={styles.dot}
            style={{ backgroundColor: exercise === currentExercise ? "#0070f3" : "#ccc" }}
          />
        </div>
      ))}
    </div>
  )
}

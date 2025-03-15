"use client"
import { useWorkout } from "../workout/workoutContext"
import { useRouter } from "next/navigation"
import { slugify } from "./utils"
import styles from "./progressLine.module.css"

export default function ProgressLine() {
  const { exercises, currentIndex } = useWorkout()
  const router = useRouter()

  const handleClick = (exercise: string) => {
    router.push(`/gym/${slugify(exercise)}`)
  }

  const completedWidth =
    exercises.length > 1 ? (currentIndex / (exercises.length - 1)) * 100 : 0

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.lineContainer}>
          <div className={styles.lineBackground} />
          <div
            className={styles.lineCompleted}
            style={{ width: `${completedWidth}%` }}
          />
        </div>
        {exercises.map((exercise, index) => (
          <div
            key={exercise}
            className={styles.item}
            onClick={() => handleClick(exercise)}
          >
            <div className={styles.label}>{exercise}</div>
            <div
              className={
                index < currentIndex
                  ? styles.completedDot
                  : index === currentIndex
                  ? styles.currentDot
                  : styles.futureDot
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

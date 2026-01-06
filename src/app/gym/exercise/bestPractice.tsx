"use client"
import styles from "./bestPractice.module.css"
import exercises from "../exercises"

type BestPracticeProps = { selectedExercise: string }

export default function BestPractice({ selectedExercise }: BestPracticeProps) {
  const exercise = exercises.find(ex => ex.name === selectedExercise)
  if (!exercise || !exercise.bestPractice) return null
  return (
    <div className={styles.bestPracticeContainer}>
      <p className={styles.bestPracticeText}>{exercise.bestPractice}</p>
    </div>
  )
}

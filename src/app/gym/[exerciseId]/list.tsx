"use client"
import styles from "./card.module.css"

type ExerciseItem = {
  name: string
  type: string
}

type ListProps = {
  exercises: ExerciseItem[]
  onSelectExercise: (exercise: string) => void
}

const List = ({ exercises, onSelectExercise }: ListProps) => {
  return (
    <ul className={styles.dropdown}>
      {exercises.map((ex, i) => (
        <li key={i} onClick={() => onSelectExercise(ex.name)}>
          <span className={styles.type}>{ex.type}</span>
          <span>{ex.name}</span>
        </li>
      ))}
    </ul>
  )
}

export default List

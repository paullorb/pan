"use client"
import styles from "./card.module.css"

type ExerciseItem = {
  name: string
  type: string
}

type ListProps = {
  exercises: ExerciseItem[]
  selectedExercise: string
  dropdownOpen: boolean
  toggleDropdown: () => void
  onSelectExercise: (exercise: string) => void
}

const List = ({
  exercises,
  selectedExercise,
  dropdownOpen,
  toggleDropdown,
  onSelectExercise
}: ListProps) => {
  return (
    <div>
      <div className={styles.header}>
        <span>{selectedExercise}</span>
        <button onClick={toggleDropdown}>{dropdownOpen ? "▲" : "▼"}</button>
      </div>
      {dropdownOpen && (
        <ul className={styles.dropdown}>
          {exercises.map((ex, i) => (
            <li key={i} onClick={() => onSelectExercise(ex.name)}>
              <span className={styles.type}>{ex.type}</span>
              <span>{ex.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default List

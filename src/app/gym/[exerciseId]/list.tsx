"use client"
import styles from "./card.module.css"

type ExerciseItem = {
  name: string
  type: string
}

type ListProps = {
  exercises: ExerciseItem[]
  dropdownOpen: boolean
  toggleDropdown: () => void
  onSelectExercise: (exercise: string) => void
}

const List = ({
  exercises,
  dropdownOpen,
  toggleDropdown,
  onSelectExercise
}: ListProps) => {
  return (
    <div className={styles.listContainer}>
      <button onClick={toggleDropdown}>
        {dropdownOpen ? "▲" : "▼"}
      </button>
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

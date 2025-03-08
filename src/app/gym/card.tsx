"use client"

import { useState } from 'react'
import styles from './card.module.css'
import exercises from './exercises'

type ExerciseSet = {
  reps: string
  weight: string
}

const typeStyleMap: Record<string, { backgroundColor: string; color: string }> = {
  weight: { backgroundColor: 'blue', color: 'white' },
  cardio: { backgroundColor: 'green', color: 'white' },
  stretch: { backgroundColor: 'purple', color: 'white' },
}

const defaultSets: ExerciseSet[] = [
  { reps: "10", weight: "10" },
  { reps: "15", weight: "10" },
  { reps: "20", weight: "10" }
]

const Card = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(exercises[0].name)
  const [sets, setSets] = useState<ExerciseSet[]>(defaultSets)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const selectExercise = (exercise: string) => {
    setSelectedExercise(exercise)
    setDropdownOpen(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }
  const updateSet = (index: number, field: "reps" | "weight", value: string) => {
    const newSets = [...sets]
    newSets[index] = { ...newSets[index], [field]: value }
    setSets(newSets)
  }
  const addSet = () => {
    const lastSet = sets[sets.length - 1]
    setSets([...sets, { reps: lastSet.reps, weight: lastSet.weight }])
  }
  const deleteSet = () => {
    if (sets.length > 1) setSets(sets.slice(0, sets.length - 1))
  }
  const completeExercise = () => {
    const userId = "loggedInUserId" // Replace with actual logged in user id
    const payload = {
      exercise: selectedExercise,
      sets,
      date: new Date().toISOString(),
      done: true,
      userId
    }
    console.log(payload)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{selectedExercise}</span>
        <button onClick={toggleDropdown}>{dropdownOpen ? '▲' : '▼'}</button>
      </div>
      {dropdownOpen && (
        <ul className={styles.dropdown}>
          {exercises.map((ex, i) => (
            <li key={i} onClick={() => selectExercise(ex.name)}>
              <span className={styles.type} style={typeStyleMap[ex.type]}>
                {ex.type}
              </span>
              <span>{ex.name}</span>
            </li>
          ))}
        </ul>
      )}
      <img src={`/${selectedExercise}.png`} alt={selectedExercise} className={styles.image} />
      {sets.map((set, index) => (
        <div key={index} className={styles.setContainer}>
          <input
            type="text"
            value={set.reps}
            onChange={(e) => updateSet(index, "reps", e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.repsInput}
          />
          <span className={styles.unit}>x</span>
          <input
            type="text"
            value={set.weight}
            onChange={(e) => updateSet(index, "weight", e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.weightsInput}
          />
          <span className={styles.unit}>kg</span>
        </div>
      ))}
      <div className={styles.buttonContainer}>
        <button onClick={deleteSet} className={styles.deleteButton}>Delete Last Set</button>
        <button onClick={addSet} className={styles.addButton}>Add New Set</button>
      </div>
      <div className={styles.completeContainer}>
        <button onClick={completeExercise} className={styles.completeButton}>
          Complete Exercise
        </button>
      </div>
    </div>
  )
}

export default Card

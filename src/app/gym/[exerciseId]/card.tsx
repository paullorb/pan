"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import styles from "./card.module.css"
import exercises from "./exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify } from "./utils"
import Details from "./details"

const Card = () => {
  const { exerciseId } = useParams()
  const initialExercise =
    exercises.find(ex => slugify(ex.name) === exerciseId)?.name || exercises[0].name
  const { user } = useAuth()
  const { createExercise } = useExercise()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(initialExercise)
  const [sets, setSets] = useState([
    { reps: "10", weight: "10" },
    { reps: "15", weight: "10" },
    { reps: "20", weight: "10" }
  ])

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const selectExercise = (exercise: string) => {
    setSelectedExercise(exercise)
    setDropdownOpen(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
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
    if (!user) return
    const exercise = exercises.find(ex => ex.name === selectedExercise)
    if (!exercise) return
    const payload = {
      exerciseId: slugify(selectedExercise),
      type: exercise.type,
      details: { sets },
      date: new Date().toISOString()
    }
    createExercise(payload)
  }

  const exerciseType = exercises.find(ex => ex.name === selectedExercise)?.type || ""

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{selectedExercise}</span>
        <button onClick={toggleDropdown}>{dropdownOpen ? "▲" : "▼"}</button>
      </div>
      {dropdownOpen && (
        <ul className={styles.dropdown}>
          {exercises.map((ex, i) => (
            <li key={i} onClick={() => selectExercise(ex.name)}>
              <span className={styles.type}>{ex.type}</span>
              <span>{ex.name}</span>
            </li>
          ))}
        </ul>
      )}
      <img src={`/${selectedExercise}.png`} alt={selectedExercise} className={styles.image} />
      <Details
        exerciseType={exerciseType}
        sets={sets}
        updateSet={updateSet}
        addSet={addSet}
        deleteSet={deleteSet}
        handleKeyDown={handleKeyDown}
      />
      <div className={styles.completeContainer}>
        <button onClick={completeExercise} className={styles.completeButton}>
          Complete Exercise
        </button>
      </div>
    </div>
  )
}

export default Card

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

  const [exerciseDetails, setExerciseDetails] = useState({
    sets: [
      { reps: "10", weight: "10" },
      { reps: "15", weight: "10" },
      { reps: "20", weight: "10" }
    ],
    time: "30",
    intensity: "5",
    reps: "8"
  })

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const selectExercise = (exercise: string) => {
    setSelectedExercise(exercise)
    setDropdownOpen(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }
  const updateSet = (index: number, field: "reps" | "weight", value: string) => {
    const newSets = [...exerciseDetails.sets]
    newSets[index] = { ...newSets[index], [field]: value }
    setExerciseDetails({ ...exerciseDetails, sets: newSets })
  }
  const addSet = () => {
    const lastSet = exerciseDetails.sets[exerciseDetails.sets.length - 1]
    setExerciseDetails({
      ...exerciseDetails,
      sets: [...exerciseDetails.sets, { reps: lastSet.reps, weight: lastSet.weight }]
    })
  }
  const deleteSet = () => {
    if (exerciseDetails.sets.length > 1) {
      setExerciseDetails({
        ...exerciseDetails,
        sets: exerciseDetails.sets.slice(0, exerciseDetails.sets.length - 1)
      })
    }
  }
  const updateDetailField = (field: "time" | "intensity" | "reps", value: string) => {
    setExerciseDetails({ ...exerciseDetails, [field]: value })
  }
  const completeExercise = () => {
    if (!user) return
    const exercise = exercises.find(ex => ex.name === selectedExercise)
    if (!exercise) return
    const payload = {
      exerciseId: slugify(selectedExercise),
      type: exercise.type,
      details: exerciseDetails,
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
        exerciseDetails={exerciseDetails}
        updateSet={updateSet}
        addSet={addSet}
        deleteSet={deleteSet}
        updateDetailField={updateDetailField}
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

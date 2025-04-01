"use client"
import { useState, useEffect } from "react"
import styles from "./card.module.css"
import exercises from "../exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify } from "./utils"
import Details from "./details"
import List from "../list/list"
import Status from "./status"
import BestPractice from "./bestPractice"
import LastDetails from "./lastDetails"

// Import the helper functions
import { addSet, deleteSet } from "./manageSets"

const Card = () => {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [sets, setSets] = useState([{ reps: "", weight: "", duration: "", intensity: "" }])
  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise, getLastExercise } = useExercise()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [completedToday, setCompletedToday] = useState(false)
  const [lastSets, setLastSets] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const slug = slugify(selectedExercise.name)
      const [today, last] = await Promise.all([
        getExercise(slug),
        getLastExercise(slug)
      ])

      if (today && new Date(today.date).toDateString() === new Date().toDateString()) {
        setSets(today.sets)
        setCompletedToday(true)
      } else {
        setSets([{ reps: "", weight: "", duration: "", intensity: "" }])
        setCompletedToday(false)
      }
      setLastSets(last?.sets || null)
    }
    fetchData()
  }, [user, selectedExercise, getExercise, getLastExercise])

  const toggleCompletion = async () => {
    if (!user) return
    const slug = slugify(selectedExercise.name)
    if (!completedToday) {
      await createExercise({
        exerciseId: slug,
        type: selectedExercise.type,
        sets,
        date: new Date().toISOString()
      })
      setCompletedToday(true)
    } else {
      await deleteExercise(slug)
      setCompletedToday(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.exerciseHeader}>
        <div className={styles.exerciseName} onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedExercise.name} {completedToday ? "✔️" : ""} {dropdownOpen ? "▲" : "▼"}
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownWrapper}>
            <List
              exercises={exercises}
              onSelectExercise={ex => {
                const selected = exercises.find(e => e.name === ex)
                if (selected) setSelectedExercise(selected)
                setDropdownOpen(false)
              }}
            />
          </div>
        )}
      </div>
      <Status imageSrc={`/${selectedExercise.name}.png`} />
      <LastDetails exerciseType={selectedExercise.type} lastDetails={lastSets?.slice(-1)[0]} />
      <Details exerciseType={selectedExercise.type} sets={sets} updateSets={setSets} />
      <div className={styles.buttonGroup}>
        <button className={styles.setsButton} onClick={() => setSets(addSet(sets))}>+</button>
        <button className={styles.setsButton} onClick={() => setSets(deleteSet(sets))}>-</button>
      </div>
      <BestPractice selectedExercise={selectedExercise.name} />
      <div
        onClick={toggleCompletion}
        className={`${styles.completeContainer} ${completedToday ? styles.completed : styles.incomplete}`}
      >
        <button className={styles.completeButton}>
          {completedToday ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
      </div>
    </div>
  )
}

export default Card

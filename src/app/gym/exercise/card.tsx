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
import { addSet, deleteSet } from "./manageSets"
import { toggleSetCompletion } from "./toggleSetCompletion"

const Card = () => {
  const storedSlug = typeof window !== "undefined" ? localStorage.getItem("lastSelectedExercise") : null
  const initial = exercises.find(e => slugify(e.name) === storedSlug) || exercises[0]
  const [selectedExercise, setSelectedExercise] = useState(initial)
  const [sets, setSets] = useState([{ reps: "", weight: "", duration: "", intensity: "", completed: false }])
  const [completedToday, setCompletedToday] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [lastSets, setLastSets] = useState<any>(null)
  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise, getLastExercise } = useExercise()

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const slug = slugify(selectedExercise.name)
      const [today, last] = await Promise.all([getExercise(slug), getLastExercise(slug)])
      if (today && new Date(today.date).toDateString() === new Date().toDateString()) {
        setSets(Array.isArray(today.sets) ? today.sets : [])
        setCompletedToday(true)
      } else {
        setSets([{ reps: "", weight: "", duration: "", intensity: "", completed: false }])
        setCompletedToday(false)
      }
      setLastSets(last?.sets || null)
    }
    fetchData()
  }, [user, selectedExercise, getExercise, getLastExercise])

  useEffect(() => {
    localStorage.setItem("lastSelectedExercise", slugify(selectedExercise.name))
  }, [selectedExercise])

  const allSetsCompleted = sets.every(s => s.completed)
  const toggleSetComplete = (i: number) => {
    if (completedToday) return
    setSets(toggleSetCompletion(sets, i))
  }

  const toggleCompletion = async () => {
    if (!user) return
    if (!completedToday && !allSetsCompleted) return
    const slug = slugify(selectedExercise.name)
    if (!completedToday) {
      await createExercise({ exerciseId: slug, type: selectedExercise.type, sets, date: new Date().toISOString() })
      setCompletedToday(true)
    } else {
      await deleteExercise(slug)
      setSets(sets.map(s => ({ ...s, completed: false })))
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
      <Details
        exerciseType={selectedExercise.type}
        sets={sets}
        updateSets={setSets}
        toggleSetComplete={toggleSetComplete}
        exerciseCompleted={completedToday}
      />
      <div className={styles.buttonGroup}>
        <button onClick={() => setSets(addSet(sets))} className={styles.setsButton}>+</button>
        <button onClick={() => setSets(deleteSet(sets))} className={styles.setsButton}>-</button>
      </div>
      <BestPractice selectedExercise={selectedExercise.name} />
      <div
        onClick={toggleCompletion}
        className={`${styles.completeContainer} ${completedToday ? styles.completed : styles.incomplete}`}
      >
        <button disabled={!allSetsCompleted && !completedToday} className={styles.completeButton}>
          {completedToday ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
      </div>
    </div>
  )
}

export default Card

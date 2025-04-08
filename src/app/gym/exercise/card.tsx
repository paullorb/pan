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

type SetItem = {
  reps: string
  weight: string
  duration: string
  intensity: string
  completed: boolean
}

const Card = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [completedToday, setCompletedToday] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])

  useEffect(() => {
    const storedSlug = localStorage.getItem("lastSelectedExercise")
    const found = exercises.find(e => slugify(e.name) === storedSlug)
    if (found) setSelectedExercise(found)
  }, [])
  const [sets, setSets] = useState<SetItem[]>([])
  const [lastSets, setLastSets] = useState<SetItem[] | null>(null)
  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise, getLastExercise } = useExercise()

  useEffect(() => {
    localStorage.setItem("lastSelectedExercise", slugify(selectedExercise.name))
  }, [selectedExercise])

  useEffect(() => {
    let isMounted = true
    const slug = slugify(selectedExercise.name)
    const localKey = `sets_${slug}`

    const loadLocal = () => {
      const stored = localStorage.getItem(localKey)
      return stored ? JSON.parse(stored) as SetItem[] : null
    }

    const loadData = async () => {
      const localSets = loadLocal()
      if (!user) {
        if (isMounted) {
          setSets(localSets || [{ reps: "", weight: "", duration: "", intensity: "", completed: false }])
          setCompletedToday(false)
        }
        return
      }
      const [today, last] = await Promise.all([getExercise(slug), getLastExercise(slug)])
      if (!isMounted) return
      if (today && new Date(today.date).toDateString() === new Date().toDateString()) {
        setSets(Array.isArray(today.sets) ? today.sets : [{ reps: "", weight: "", duration: "", intensity: "", completed: false }])
        setCompletedToday(true)
        localStorage.removeItem(localKey)
      } else {
        setSets(localSets || [{ reps: "", weight: "", duration: "", intensity: "", completed: false }])
        setCompletedToday(false)
      }
      setLastSets(last?.sets || null)
    }

    loadData()
    return () => { isMounted = false }
  }, [user, selectedExercise, getExercise, getLastExercise])

  useEffect(() => {
    if (!completedToday) {
      const slug = slugify(selectedExercise.name)
      const localKey = `sets_${slug}`
      localStorage.setItem(localKey, JSON.stringify(sets))
    }
  }, [sets, selectedExercise, completedToday])

  const toggleSetComplete = (i: number) => {
    if (completedToday) return
    setSets(toggleSetCompletion(sets, i))
  }

  const toggleCompletion = async () => {
    if (!user) return
    const slug = slugify(selectedExercise.name)
    const localKey = `sets_${slug}`
    if (!completedToday) {
      if (!sets.every(s => s.completed)) return
      await createExercise({
        exerciseId: slug,
        type: selectedExercise.type,
        sets,
        date: new Date().toISOString()
      })
      setCompletedToday(true)
      localStorage.removeItem(localKey)
    } else {
      await deleteExercise(slug)
      setCompletedToday(false)
      const resetSets = sets.map(s => ({ ...s, completed: false }))
      localStorage.setItem(localKey, JSON.stringify(resetSets))
      setSets(resetSets)
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
                const found = exercises.find(e => e.name === ex)
                if (found) setSelectedExercise(found)
                setDropdownOpen(false)
              }}
            />
          </div>
        )}
      </div>
      <Status imageSrc={`/${selectedExercise.name}.png`} />
      <LastDetails exerciseType={selectedExercise.type} lastDetails={lastSets?.slice(-1)[0] ?? null} />
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
        <button disabled={!sets.every(s => s.completed) && !completedToday} className={styles.completeButton}>
          {completedToday ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
      </div>
    </div>
  )
}

export default Card

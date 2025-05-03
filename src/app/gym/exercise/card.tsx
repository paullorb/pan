"use client"
import { useState, useEffect } from "react"
import styles from "./card.module.css"
import exercises from "../exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify } from "./utils"
import Details from "../sets/details"
import List from "../list/list"
import Status from "./status"
import BestPractice from "./bestPractice"
import LastDetails from "../sets/lastDetails"
import { addSet, deleteSet } from "../utils/manageSets"
import { toggleSetCompletion } from "../utils/toggleSetCompletion"
import NextUp from "../exercises/nextUp"
import Completed from "./completed"
import Timeline from "../exercises/timeline"
import { 
  ExerciseType, 
  ExerciseSet 
} from "../../lib/types/exercise"

export default function Card() {
  const [mode, setMode] = useState<"none" | "current" | "next">("none")
  const [completedToday, setCompletedToday] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [nextExercise, setNextExercise] = useState(exercises[1] || exercises[0])
  const [sets, setSets] = useState<ExerciseSet[]>([])
  const [lastSets, setLastSets] = useState<ExerciseSet[] | null>(null)

  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise, getLastExercise } = useExercise()

  useEffect(() => {
    setHasMounted(true)
    const storedSlug = localStorage.getItem("lastSelectedExercise")
    const found = exercises.find(e => slugify(e.name) === storedSlug)
    if (found) setSelectedExercise(found)
  }, [])

  useEffect(() => {
    let isMounted = true
    const slug = slugify(selectedExercise.name)
    const localKey = `sets_${slug}`
    const loadData = async () => {
      const localSets = JSON.parse(localStorage.getItem(localKey) || "null")
      if (!user) {
        if (isMounted) {
          setSets(localSets || [{
            reps: "",
            weight: "",
            duration: "",
            intensity: "",
            completed: false
          }])
          setCompletedToday(false)
        }
        return
      }
      const [today, last] = await Promise.all([getExercise(slug), getLastExercise(slug)])
      if (!isMounted) return
      if (today && new Date(today.date).toDateString() === new Date().toDateString()) {
        setSets(today.sets || [{
          reps: "",
          weight: "",
          duration: "",
          intensity: "",
          completed: false
        }])
        setCompletedToday(true)
        localStorage.removeItem(localKey)
      } else {
        const lastSet = last?.sets?.slice(-1)?.[0];
        setSets(localSets || [{
          reps: lastSet?.reps || "",
          weight: lastSet?.weight || "",
          duration: lastSet?.duration || "",
          intensity: lastSet?.intensity || "",
          completed: false
        }])
        setCompletedToday(false)
      }
      setLastSets(last?.sets || null)
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [user, selectedExercise, getExercise, getLastExercise])

  useEffect(() => {
    if (!completedToday && hasMounted) {
      const slug = slugify(selectedExercise.name)
      const localKey = `sets_${slug}`
      localStorage.setItem(localKey, JSON.stringify(sets))
    }
  }, [sets, selectedExercise, completedToday, hasMounted])

  const handleSelectExercise = (name: string) => {
    if (mode === "current") {
      const found = exercises.find(e => e.name === name)
      if (found) {
        setSelectedExercise(found)
        localStorage.setItem("lastSelectedExercise", slugify(found.name))
      }
    }
    if (mode === "next") {
      const found = exercises.find(e => e.name === name)
      if (found) {
        setNextExercise(found)
      }
    }
    setMode("none")
  }

  const toggleSetComplete = (i: number) => {
    if (completedToday) return
    setSets(toggleSetCompletion(sets, i))
  }

  const toggleCompletion = () => {
    if (!user) return
    const slug = slugify(selectedExercise.name)
    if (!completedToday && !sets.every(s => s.completed)) return

    if (!completedToday) {
      localStorage.removeItem(`sets_${slug}`)
      setCompletedToday(true)
      createExercise({
        exerciseId: slug,
        type: selectedExercise.type,
        sets,
        date: new Date().toISOString()
      }).catch(() => {
        setCompletedToday(false)
        localStorage.setItem(`sets_${slug}`, JSON.stringify(sets))
      })
    } else {
      setCompletedToday(false)
      const resetSets = sets.map(s => ({ ...s, completed: false }))
      setSets(resetSets)
      localStorage.setItem(`sets_${slug}`, JSON.stringify(resetSets))
      deleteExercise(slug).catch(() => {
        setCompletedToday(true)
        setSets(sets)
        localStorage.removeItem(`sets_${slug}`)
      })
    }
  }

  const handleCompleteAndNext = async () => {
    if (!completedToday) {
      await toggleCompletion()
      setSelectedExercise(nextExercise)
      localStorage.setItem("lastSelectedExercise", slugify(nextExercise.name))
    }
  }

  return (
    <div className={styles.card}>
      <Timeline
        currentExercise={{
          name: selectedExercise.name,
          slug: slugify(selectedExercise.name),
          completed: completedToday
        }}
      />
      <div className={styles.exerciseHeader}>
        <div
          className={`${styles.exerciseName} ${mode === "current" ? styles.changingCurrent : ""}`}
          onClick={() => setMode(mode === "current" ? "none" : "current")}
        >
          {selectedExercise.name} {completedToday ? "✔️" : ""}
        </div>
        <NextUp
          exercise={nextExercise}
          isActive={mode === "next"}
          onClick={() => setMode(mode === "next" ? "none" : "next")}
        />
      </div>
      {mode !== "none" && (
        <div className={styles.dropdownWrapper}>
          <List exercises={exercises} onSelectExercise={handleSelectExercise} />
        </div>
      )}
      <Status imageSrc={`/${selectedExercise.name}.png`} />
      <LastDetails
        exerciseType={selectedExercise.type}
        lastDetails={lastSets?.slice(-1)?.[0] || null}
      />
      <Details
        exerciseType={selectedExercise.type as ExerciseType}
        sets={sets}
        updateSets={setSets}
        toggleSetComplete={toggleSetComplete}
        exerciseCompleted={completedToday}
      />
      <div className={styles.buttonGroup}>
        <button onClick={() => setSets(addSet(sets))} className={styles.setsButton}>
          +
        </button>
        <button onClick={() => setSets(deleteSet(sets))} className={styles.setsButton}>
          -
        </button>
      </div>
      <BestPractice selectedExercise={selectedExercise.name} />
      <Completed
        completedToday={completedToday}
        sets={sets}
        onToggleCompletion={toggleCompletion}
        onCompleteAndNext={handleCompleteAndNext}
      />
    </div>
  )
}

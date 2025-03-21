"use client"
import { useState, useEffect } from "react"
import styles from "./card.module.css"
import exercises, { modalities } from "../exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify, daysBetween } from "./utils"
import Details from "./details"
import List from "../list/list"
import Status from "./status"
import { useWorkout } from "../workout/workoutContext"
import BestPractice from "./bestPractice"

type SetType = { reps: string; weight: string }
type DetailsType = {
  sets: SetType[]
  time: string
  intensity: string
  reps: string
}

const Card = () => {
  const defaultExerciseObj = exercises[0]
  const defaultDetails =
    (modalities.find(m => m.name === defaultExerciseObj.type)
      ?.defaultDetails as DetailsType) || { sets: [], time: "", intensity: "", reps: "" }
  const [selectedExercise, setSelectedExercise] = useState(defaultExerciseObj.name)
  const [exerciseDetails, setExerciseDetails] = useState<DetailsType>(defaultDetails)
  const { user } = useAuth()
  const { createExercise, deleteExercise } = useExercise()
  const { exercises: workoutExercises, setExercises, setCurrentIndex } = useWorkout()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [lastDoneDate, setLastDoneDate] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!workoutExercises.length) {
      const orderMap: Record<string, number> = { cardio: 1, weight: 2, stretch: 3 }
      const sortedModalities = Array.from(new Set(exercises.map(ex => ex.type))).sort(
        (a, b) => orderMap[a] - orderMap[b]
      )
      const orderedExercises: string[] = []
      sortedModalities.forEach(mod => {
        exercises.filter(ex => ex.type === mod).forEach(ex => orderedExercises.push(ex.name))
      })
      setExercises(orderedExercises)
    }
  }, [workoutExercises, setExercises])

  const toggleDropdown = () => setDropdownOpen(prev => !prev)
  const onSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
    const newExercise = exercises.find(ex => ex.name === exerciseName)
    const mod = modalities.find(m => m.name === newExercise?.type)
    setExerciseDetails((mod?.defaultDetails as DetailsType) || defaultDetails)
    setDropdownOpen(false)
    setLastDoneDate(undefined)
  }
  const updateSet = (index: number, field: "reps" | "weight", value: string) => {
    const newSets = exerciseDetails.sets.map(set => ({ ...set }))
    newSets[index][field] = value
    for (let i = index + 1; i < newSets.length; i++) {
      newSets[i][field] = value
    }
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
  }
  const toggleCompletion = async () => {
    if (!user) return
    const exercise = exercises.find(ex => ex.name === selectedExercise)
    if (!exercise) return
    const exerciseIdSlug = slugify(selectedExercise)
    if (!lastDoneDate) {
      const now = new Date().toISOString()
      setLastDoneDate(now)
      const payload = {
        exerciseId: exerciseIdSlug,
        type: exercise.type,
        details: exerciseDetails,
        date: now
      }
      createExercise(payload)
      const exerciseIndex = workoutExercises.indexOf(selectedExercise)
      if (exerciseIndex !== -1) {
        setCurrentIndex(exerciseIndex + 1)
      }
    } else {
      await deleteExercise(exerciseIdSlug)
      setLastDoneDate(undefined)
    }
  }
  const exerciseType = exercises.find(ex => ex.name === selectedExercise)?.type || ""
  let statusText = ""
  if (lastDoneDate) {
    const diff = daysBetween(new Date(lastDoneDate), new Date())
    statusText =
      diff === 0 ? "(done today)" : `(${diff} day${diff > 1 ? "s" : ""} since last done)`
  }

  useEffect(() => {
    if (!user) return
    const fetchExisting = async () => {
      const res = await fetch(`/api/exercises?exerciseId=${slugify(selectedExercise)}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.exercise) {
          setExerciseDetails(data.exercise.details)
          setLastDoneDate(data.exercise.date)
        } else {
          const currentExercise = exercises.find(ex => ex.name === selectedExercise) || defaultExerciseObj
          const mod = modalities.find(m => m.name === currentExercise.type)
          setExerciseDetails((mod?.defaultDetails as DetailsType) || defaultDetails)
          setLastDoneDate(undefined)
        }
      }
    }
    fetchExisting()
  }, [user, selectedExercise, defaultExerciseObj, defaultDetails])

  return (
    <div className={styles.card}>
      <div className={styles.exerciseHeader}>
        <div className={styles.exerciseName} onClick={toggleDropdown}>
          {selectedExercise} {statusText} {dropdownOpen ? "▲" : "▼"}
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownWrapper}>
            <List exercises={exercises} onSelectExercise={onSelectExercise} />
          </div>
        )}
      </div>
      <Status imageSrc={`/${selectedExercise}.png`} />
      <Details
        exerciseType={exerciseType}
        exerciseDetails={exerciseDetails}
        updateSet={updateSet}
        addSet={addSet}
        deleteSet={deleteSet}
        updateDetailField={updateDetailField}
        handleKeyDown={handleKeyDown}
      />
      <BestPractice selectedExercise={selectedExercise} />
      <div onClick={toggleCompletion} className={styles.completeContainer}>
        <button className={styles.completeButton}>
          {lastDoneDate ? "Mark as Incomplete" : "Exercise Completed"}
        </button>
      </div>
    </div>
  )
}

export default Card

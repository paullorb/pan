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
    (modalities.find(m => m.name === defaultExerciseObj.type)?.defaultDetails as DetailsType) ||
    { sets: [], time: "", intensity: "", reps: "" }
  const [selectedExercise, setSelectedExercise] = useState(defaultExerciseObj.name)
  const [exerciseDetails, setExerciseDetails] = useState<DetailsType>(defaultDetails)
  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise } = useExercise()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [lastDoneDate, setLastDoneDate] = useState<string | undefined>(undefined)

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
      const exercise = await getExercise(slugify(selectedExercise))
      if (exercise) {
        setExerciseDetails(exercise.details)
        setLastDoneDate(exercise.date)
      } else {
        const currentExercise = exercises.find(ex => ex.name === selectedExercise) || defaultExerciseObj
        const mod = modalities.find(m => m.name === currentExercise.type)
        setExerciseDetails((mod?.defaultDetails as DetailsType) || defaultDetails)
        setLastDoneDate(undefined)
      }
    }
    fetchExisting()
  }, [user, selectedExercise, defaultExerciseObj, defaultDetails, getExercise])

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
          {lastDoneDate ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
      </div>
    </div>
  )
}

export default Card

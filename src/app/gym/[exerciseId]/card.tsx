"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import styles from "./card.module.css"
import exercises from "./exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify } from "./utils"
import Details from "./details"
import List from "./list"
import Status from "./status"

function daysBetween(a: Date, b: Date) {
  const diff = b.getTime() - a.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const Card = () => {
  const { exerciseId } = useParams()
  const initialExercise =
    exercises.find(ex => slugify(ex.name) === exerciseId)?.name || exercises[0].name

  const { user } = useAuth()
  const { createExercise } = useExercise()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(initialExercise)
  const [lastDoneDate, setLastDoneDate] = useState<string | undefined>(undefined)
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

  const onSelectExercise = (exercise: string) => {
    setSelectedExercise(exercise)
    setDropdownOpen(false)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur()
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

  let statusText = ""
  if (lastDoneDate) {
    const diff = daysBetween(new Date(lastDoneDate), new Date())
    statusText = diff === 0 ? "(done today)" : `(${diff} day${diff > 1 ? "s" : ""} since last done)`
  }

  useEffect(() => {
    if (!user) return
    const fetchExisting = async () => {
      const res = await fetch(`/api/exercises?exerciseId=${slugify(selectedExercise)}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.exercise) {
          setExerciseDetails(data.exercise.details)
          setLastDoneDate(data.exercise.date)
        } else {
          setExerciseDetails({
            sets: [
              { reps: "10", weight: "10" },
              { reps: "15", weight: "10" },
              { reps: "20", weight: "10" }
            ],
            time: "30",
            intensity: "5",
            reps: "8"
          })
          setLastDoneDate(undefined)
        }
      }
    }
    fetchExisting()
  }, [user, selectedExercise])

  return (
    <div className={styles.card}>
      <div className={styles.exerciseHeader}>
        <div className={styles.exerciseName} onClick={toggleDropdown}>
          {selectedExercise} {statusText} {dropdownOpen ? "▲" : "▼"}
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownWrapper}>
            <List
              exercises={exercises}
              onSelectExercise={onSelectExercise}
            />
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
      <div className={styles.completeContainer}>
        <button onClick={completeExercise} className={styles.completeButton}>
          Complete Exercise
        </button>
      </div>
    </div>
  )
}

export default Card

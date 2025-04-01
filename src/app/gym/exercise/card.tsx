"use client"
import { useState, useEffect } from "react"
import styles from "./card.module.css"
import exercises, { modalities } from "../exercises"
import { useAuth } from "../../auth/authContext"
import { useExercise } from "./exerciseContext"
import { slugify } from "./utils"
import Details from "./details"
import List from "../list/list"
import Status from "./status"
import BestPractice from "./bestPractice"
import LastDetails from "./lastDetails"

const Card = () => {
  const defaultExerciseObj = exercises[0]
  const defaultDetails =
    modalities.find(m => m.name === defaultExerciseObj.type)?.defaultDetails ||
    { sets: [], time: "", intensity: "", reps: "" }

  const [selectedExercise, setSelectedExercise] = useState(defaultExerciseObj.name)
  const [exerciseDetails, setExerciseDetails] = useState(defaultDetails)
  const { user } = useAuth()
  const { createExercise, deleteExercise, getExercise, getLastExercise } = useExercise()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [completedToday, setCompletedToday] = useState(false)
  const [lastExerciseDetails, setLastExerciseDetails] = useState<any>(null);
  const toggleDropdown = () => setDropdownOpen(prev => !prev)

  const onSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
    const newExercise = exercises.find(ex => ex.name === exerciseName)
    const mod = modalities.find(m => m.name === newExercise?.type)
    setExerciseDetails(mod?.defaultDetails || defaultDetails)
    setDropdownOpen(false)
    setCompletedToday(false)
  }

  const toggleCompletion = async () => {
    if (!user) return
    const exercise = exercises.find(ex => ex.name === selectedExercise)
    if (!exercise) return
    const exerciseIdSlug = slugify(selectedExercise)

    if (!completedToday) {
      const now = new Date().toISOString()
      setCompletedToday(true)
      await createExercise({
        exerciseId: exerciseIdSlug,
        type: exercise.type,
        details: exerciseDetails,
        date: now
      })
    } else {
      await deleteExercise(exerciseIdSlug)
      setCompletedToday(false)
    }
  }

  useEffect(() => {
    if (!user) return;
    
    const fetchExerciseData = async () => {
      const exerciseSlug = slugify(selectedExercise);
      
      const [exerciseToday, lastExercise] = await Promise.all([
        getExercise(exerciseSlug),
        getLastExercise(exerciseSlug),
      ]);

      if (exerciseToday && new Date(exerciseToday.date).toDateString() === new Date().toDateString()) {
        setExerciseDetails(exerciseToday.details);
        setCompletedToday(true);
      } else {
        const currentExercise = exercises.find(ex => ex.name === selectedExercise) || defaultExerciseObj;
        const mod = modalities.find(m => m.name === currentExercise.type);
        setExerciseDetails(mod?.defaultDetails || defaultDetails);
        setCompletedToday(false);
      }

      setLastExerciseDetails(lastExercise?.details || null);
    };

    fetchExerciseData();
  }, [user, selectedExercise, getExercise, getLastExercise]);

  const exerciseType = exercises.find(ex => ex.name === selectedExercise)?.type || ""

  return (
    <div className={styles.card}>
      <div className={styles.exerciseHeader}>
        <div className={styles.exerciseName} onClick={toggleDropdown}>
          {selectedExercise} {completedToday ? "✔️" : ""} {dropdownOpen ? "▲" : "▼"}
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownWrapper}>
            <List exercises={exercises} onSelectExercise={onSelectExercise} />
          </div>
        )}
      </div>
      <Status imageSrc={`/${selectedExercise}.png`} />
      <LastDetails exerciseType={exerciseType} lastDetails={lastExerciseDetails} />
      <Details
        exerciseType={exerciseType}
        exerciseDetails={exerciseDetails}
        updateSet={(idx, field, val) => {
          const newSets = [...exerciseDetails.sets]
          newSets[idx][field] = val
          setExerciseDetails({ ...exerciseDetails, sets: newSets })
        }}
        addSet={() => {
          const lastSet = exerciseDetails.sets.slice(-1)[0]
          setExerciseDetails({
            ...exerciseDetails,
            sets: [...exerciseDetails.sets, { reps: lastSet.reps, weight: lastSet.weight }]
          })
        }}
        deleteSet={() => {
          if (exerciseDetails.sets.length > 1) {
            setExerciseDetails({
              ...exerciseDetails,
              sets: exerciseDetails.sets.slice(0, -1)
            })
          }
        }}
        updateDetailField={(field, val) => setExerciseDetails({ ...exerciseDetails, [field]: val })}
        handleKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }}
      />
      <BestPractice selectedExercise={selectedExercise} />
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
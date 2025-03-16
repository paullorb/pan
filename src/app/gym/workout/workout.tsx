"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import exercises, { modalities } from "../exercises"
import Modifier from "./modifier"
import styles from "./workout.module.css"
import { getDateKey } from "./utils"

const modalityOrder = ["cardio", "weight", "stretch"]

export default function Workout() {
  const [workout, setWorkout] = useState<Record<string, string[]>>({})
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const sortedModalities = modalityOrder.map(name => ({ name }))

  useEffect(() => {
    async function loadWorkout() {
      const today = getDateKey(new Date())
      let savedWorkout: Record<string, string[]> = {}
      try {
        const res = await fetch(`/api/workout?date=${today}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          savedWorkout = data.workout || {}
        }
      } catch (error) {
        console.error("Error fetching saved workout:", error)
      }
      const newWorkout: Record<string, string[]> = {}
      modalityOrder.forEach(mod => {
        const required = mod === "cardio" ? 1 : mod === "weight" ? 4 : mod === "stretch" ? 5 : 1
        const saved = savedWorkout[mod] || []
        const available = exercises.filter(e => e.type === mod && !saved.includes(e.name))
        const randomCount = Math.max(required - saved.length, 0)
        const randomExercises = available
          .sort(() => 0.5 - Math.random())
          .slice(0, randomCount)
          .map(e => e.name)
        newWorkout[mod] = [...saved, ...randomExercises]
      })
      setWorkout(newWorkout)
    }
    loadWorkout()
  }, [])

  async function fetchStatuses() {
    const statuses: Record<string, boolean> = {}
    for (const mod in workout) {
      for (const exerciseName of workout[mod] ?? []) {
        try {
          const res = await fetch(`/api/exercises?exerciseId=${encodeURIComponent(exerciseName)}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          })
          if (res.ok) {
            const { exercise } = await res.json()
            statuses[exerciseName] = !!exercise
          } else {
            statuses[exerciseName] = false
          }
        } catch (error) {
          console.error(`Error checking status for ${exerciseName}:`, error)
          statuses[exerciseName] = false
        }
      }
    }
    setExerciseStatuses(statuses)
    return statuses
  }

  useEffect(() => {
    if (Object.keys(workout).length) {
      fetchStatuses()
    }
  }, [workout])

  const addExercise = (modality: string) => {
    setWorkout(prev => {
      const currentList = prev[modality] ?? []
      const possible = exercises.filter(e => e.type === modality && !currentList.includes(e.name))
      if (!possible.length) return prev
      const newExercise = possible[Math.floor(Math.random() * possible.length)].name
      return { ...prev, [modality]: [...currentList, newExercise] }
    })
  }

  const removeExercise = (modality: string) => {
    setWorkout(prev => {
      const currentList = prev[modality] ?? []
      if (currentList.length <= 1) return prev
      return { ...prev, [modality]: currentList.slice(0, currentList.length - 1) }
    })
  }

  async function handleClick() {
    const today = getDateKey(new Date())
    const payload = { date: today, workout }
    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const cardioExercises = workout["cardio"] || []
        const cardioExercise = cardioExercises[0]
        if (cardioExercise) {
          router.push(`/gym/${encodeURIComponent(cardioExercise)}`)
        }
      } else {
        const data = await res.json()
        console.error("Error saving workout", data)
      }
    } catch (error) {
      console.error("Error saving workout:", error)
    }
  }

  return (
    <>
      <form className={styles.container}>
        {sortedModalities.map(m => (
          <div key={m.name} className={styles.row}>
            <div className={`${styles.cell} ${styles.modalityCell}`}>
              {m.name}
              <Modifier onAdd={() => addExercise(m.name)} onRemove={() => removeExercise(m.name)} />
            </div>
            <div className={`${styles.cell} ${styles.exerciseCell}`}>
              <div className={styles.exerciseList}>
                {(workout[m.name] ?? []).map((item, i) => (
                  <div
                    key={i}
                    className={styles.exerciseItem}
                    style={{
                      backgroundColor: exerciseStatuses[item] ? "lightgreen" : "inherit"
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </form>
      <div className={styles.submitWrapper}>
        <button type="button" onClick={handleClick} className={styles.submitButton}>
          Submit
        </button>
      </div>
    </>
  )
}

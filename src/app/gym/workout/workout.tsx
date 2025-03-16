"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import exercises, { modalities } from "../exercises"
import Modifier from "./modifier"
import styles from "./workout.module.css"
import { getDateKey } from "./utils"

// Use a fixed order for routing: first cardio, then weight, then stretch.
const modalityOrder = ["cardio", "weight", "stretch"]

export default function Workout() {
  const [workout, setWorkout] = useState<Record<string, string[]>>({})
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Sort modalities for display (if needed) using modalityOrder.
  const sortedModalities = modalityOrder.map(name => {
    return { name }
  })

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
      // Use the fixed modality order for building the workout
      modalityOrder.forEach(mod => {
        const required =
          mod === "cardio" ? 1 : mod === "weight" ? 4 : mod === "stretch" ? 5 : 1
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

  // Log the uncompleted exercise hierarchy once statuses are populated.
  useEffect(() => {
    if (Object.keys(exerciseStatuses).length === 0) return
    const uncompletedHierarchy: Record<string, string[]> = {}
    modalityOrder.forEach(mod => {
      uncompletedHierarchy[mod] = (workout[mod] ?? []).filter(
        exercise => !exerciseStatuses[exercise]
      )
    })
    console.log("Uncompleted exercises hierarchy:", uncompletedHierarchy)
  }, [workout, exerciseStatuses])

  function getUniqueRandomExercise(modality: string, existing: string[]) {
    const possible = exercises.filter(e => e.type === modality && !existing.includes(e.name))
    if (!possible.length) return ""
    return possible[Math.floor(Math.random() * possible.length)].name
  }

  function addExercise(modality: string) {
    setWorkout(prev => {
      const currentList = prev[modality] ?? []
      const newExercise = getUniqueRandomExercise(modality, currentList)
      if (!newExercise) return prev
      const updated = { ...prev, [modality]: [...currentList, newExercise] }
      console.log("After adding:", updated)
      return updated
    })
  }

  function removeExercise(modality: string) {
    setWorkout(prev => {
      const updatedList = [...(prev[modality] ?? [])]
      if (updatedList.length > 1) updatedList.pop()
      const updated = { ...prev, [modality]: updatedList }
      console.log("After removing:", updated)
      return updated
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
      const data = await res.json()
      if (res.ok) {
        // IMPORTANT: Log the current workout state as seen in the UI.
        console.log("Current workout state (display order):", workout)
        const statuses = await fetchStatuses()
        let firstUncompleted: string | undefined
        // Loop through the fixed modality order.
        for (const mod of modalityOrder) {
          const exercisesInModality = workout[mod] ?? []
          for (const exerciseName of exercisesInModality) {
            if (!statuses[exerciseName]) {
              firstUncompleted = exerciseName
              break
            }
          }
          if (firstUncompleted) break
        }
        console.log("Navigating to first uncompleted exercise:", firstUncompleted)
        if (firstUncompleted) {
          router.push(`/gym/${encodeURIComponent(firstUncompleted)}`)
        }
      } else {
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
              <Modifier
                onAdd={() => addExercise(m.name)}
                onRemove={() => removeExercise(m.name)}
              />
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

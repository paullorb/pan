"use client"
import { useState, useEffect } from "react"
import exercises, { modalities } from "../exercises"
import Modifier from "./modifier"
import styles from "./workout.module.css"

export default function Workout() {
  const [workout, setWorkout] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function loadWorkout() {
      const today = new Date().toISOString().split("T")[0]
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
      modalities.forEach(m => {
        const required =
          m.name === "cardio" ? 1 : m.name === "weight" ? 4 : m.name === "stretch" ? 5 : 1
        const saved = savedWorkout[m.name] || []
        const available = exercises.filter(e => e.type === m.name && !saved.includes(e.name))
        const randomCount = Math.max(required - saved.length, 0)
        const randomExercises = available
          .sort(() => 0.5 - Math.random())
          .slice(0, randomCount)
          .map(e => e.name)
        newWorkout[m.name] = [...saved, ...randomExercises]
      })
      setWorkout(newWorkout)
    }
    loadWorkout()
  }, [])

  function getUniqueRandomExercise(modality: string, existing: string[]) {
    const possible = exercises.filter(e => e.type === modality && !existing.includes(e.name))
    if (!possible.length) return ""
    return possible[Math.floor(Math.random() * possible.length)].name
  }

  function addExercise(modality: string) {
    setWorkout(prev => {
      const currentList = prev[modality] || []
      const newExercise = getUniqueRandomExercise(modality, currentList)
      if (!newExercise) return prev
      return { ...prev, [modality]: [...currentList, newExercise] }
    })
  }

  function removeExercise(modality: string) {
    setWorkout(prev => {
      const updated = [...(prev[modality] || [])]
      if (updated.length > 1) updated.pop()
      return { ...prev, [modality]: updated }
    })
  }

  async function handleClick() {
    console.log("Submitting workout:", workout)
    const today = new Date().toISOString().split("T")[0]
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
        console.log("Workout saved successfully!", data.message)
      } else {
        console.error("Error saving workout", data)
      }
    } catch (error) {
      console.error("Error saving workout:", error)
    }
  }

  const orderMap: Record<string, number> = { cardio: 1, weight: 2, stretch: 3 }
  const sortedModalities = [...modalities].sort(
    (a, b) => orderMap[a.name] - orderMap[b.name]
  )

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
                {workout[m.name]?.map((item, i) => (
                  <div key={i} className={styles.exerciseItem}>
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

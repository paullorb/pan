"use client"
import React, { useState, useEffect } from "react"
import { useCalendar } from "app/cal/calendarContext"
import { useExercise } from "app/gym/exercise/exerciseContext"
import styles from "./todaysExercises.module.css"

const TodaysExercises: React.FC = () => {
  const { selectedDate } = useCalendar()
  const { getMonthExercises } = useExercise()
  const [exercises, setExercises] = useState<any[]>([])

  const safeDate = selectedDate || new Date()
  const month = safeDate.getMonth()
  const year = safeDate.getFullYear()
  const dayKey = safeDate.toDateString()

  useEffect(() => {
    getMonthExercises(month, year).then((data) => setExercises(data))
  }, [getMonthExercises, month, year])

  const todaysExercises = exercises.filter((ex) => {
    return new Date(ex.date).toDateString() === dayKey
  })

  if (todaysExercises.length > 0) {
    return (
      <div className={styles.container}>
        <h4>Today&apos;s Exercises</h4>
        <div className={styles.exs}>
        {todaysExercises.map((ex, i) => (
          <div key={i} className={styles.ex}>
            {ex.exerciseId} ({ex.type})
          </div>
        ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4>Today&apos;s Exercises</h4>
      <p style={{ fontSize: "0.9rem" }}>No exercises done today</p>
    </div>
  )
}

export default TodaysExercises

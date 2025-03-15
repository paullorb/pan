"use client"

import { useState, useEffect } from "react"
import exercises, { modalities } from "../exercises"
import styles from "./workout.module.css"

export default function Workout() {
  const [workout, setWorkout] = useState<Record<string, string[]>>({})

  function getRandomCount(m: string) {
    if (m === "cardio") return 1
    if (m === "weight") return Math.floor(Math.random() * 2) + 4
    if (m === "stretch") return Math.floor(Math.random() * 2) + 5
    return 1
  }

  useEffect(() => {
    const newWorkout: Record<string, string[]> = {}
    modalities.forEach((m) => {
      const count = getRandomCount(m.name)
      const filtered = exercises.filter((e) => e.type === m.name)
      newWorkout[m.name] = filtered
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map((e) => e.name)
    })
    setWorkout(newWorkout)
  }, [])

  function handleClick() {
    console.log(workout)
  }

  return (
    <>
      <form className={styles.container}>
        {modalities.map((m) => (
          <div key={m.name} className={styles.row}>
            <div className={`${styles.cell} ${styles.modalityCell}`}>
              {m.name}
            </div>
            <div className={`${styles.cell} ${styles.exerciseCell}`}>
              <div className={styles.exerciseList}>
                {workout[m.name]?.map((item, i) => (
                  <div key={i} className={styles.exerciseItem}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </form>
      <div className={styles.submitWrapper}>
        <button type="button" onClick={handleClick} className={styles.submitButton}>Submit</button>
      </div>
    </>
  )
}

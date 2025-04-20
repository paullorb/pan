"use client"

import { useState } from "react"
import styles from "./details.module.css"

export default function Details({
  exerciseType,
  sets,
  updateSets,
  toggleSetComplete,
  exerciseCompleted
}: {
  exerciseType: string
  sets: any[]
  updateSets: (newSets: any[]) => void
  toggleSetComplete: (i: number) => void
  exerciseCompleted: boolean
}) {
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  const repsRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())
  const weightRange = Array.from({ length: 401 }, (_, i) => (i * 0.5).toString())
  const durationRange = Array.from({ length: 60 }, (_, i) => (i + 1).toString())
  const intensityRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())

  const updateSetField = (idx: number, field: string, val: string) => {
    if (sets[idx].completed || exerciseCompleted) return
    const newSets = sets.map((set, i) =>
      i === idx ? { ...set, [field]: val } : set
    )
    updateSets(newSets)
  }

  const renderSelect = (
    idx: number,
    field: string,
    options: string[],
    value: string,
    unit: string
  ) => {
    const key = `${idx}-${field}`
    return (
      <div className={styles.basicSelectWrapper}>
        <select
          value={value}
          disabled={sets[idx].completed || exerciseCompleted}
          size={openSelect === key ? 5 : 1}
          onFocus={() => setOpenSelect(key)}
          onBlur={() => setOpenSelect(null)}
          onChange={e => updateSetField(idx, field, e.target.value)}
          className={styles.basicSelect}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className={styles.unit}>{unit}</span>
      </div>
    )
  }

  return (
    <form className={styles.detailsForm}>
      {sets.map((set, idx) => (
        <div key={idx} className={styles.setContainer}>
          <div className={styles.setInner}>
            <div className={styles.leftPlaceholder} />
            <div className={styles.selectsWrapper}>
              {exerciseType === "weight" && (
                <>
                  {renderSelect(idx, "reps", repsRange, set.reps, "reps")}
                  {renderSelect(idx, "weight", weightRange, set.weight, "kg")}
                </>
              )}
              {exerciseType === "cardio" && (
                <>
                  {renderSelect(idx, "duration", durationRange, set.duration, "min")}
                  {renderSelect(idx, "intensity", intensityRange, set.intensity, "intensity")}
                </>
              )}
              {exerciseType === "stretch" && (
                <>
                  {renderSelect(idx, "reps", repsRange, set.reps, "reps")}
                  {renderSelect(idx, "intensity", intensityRange, set.intensity, "intensity")}
                </>
              )}
            </div>
            <div
              onClick={() => toggleSetComplete(idx)}
              className={`
                ${styles.setCompletionCircle}
                ${set.completed ? styles.completed : ""}
                ${exerciseCompleted ? styles.disabled : ""}
              `}
            />
          </div>
        </div>
      ))}
    </form>
  )
}

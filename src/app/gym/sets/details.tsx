"use client"

import React, { useState } from "react"
import styles from "./details.module.css"
import { SET_RANGES } from "./constants"

import { 
  ExerciseType, 
  ExerciseSet, 
} from "../../lib/types/exercise"

interface DetailsProps {
  exerciseType: ExerciseType;
  sets: ExerciseSet[];
  updateSets: (newSets: ExerciseSet[]) => void;
  toggleSetComplete: (i: number) => void;
  exerciseCompleted: boolean;
}

export default function Details({
  exerciseType,
  sets,
  updateSets,
  toggleSetComplete,
  exerciseCompleted
}: DetailsProps) {
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  const repsRange = SET_RANGES.reps
  const weightRange = SET_RANGES.weight
  const durationRange = SET_RANGES.duration
  const intensityRange = SET_RANGES.intensity

  const updateSetField = (
    idx: number, 
    field: keyof ExerciseSet, 
    val: string
  ) => {
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
          onChange={e => updateSetField(idx, field as keyof ExerciseSet, e.target.value)}
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
            <div
              className={`
                ${styles.setCompletionCircle} ${styles.placeholder}
              `}
            />
            <div className={styles.selectsWrapper}>
              {exerciseType === "weight" && (
                <>
                  {renderSelect(idx, "reps", repsRange, set.reps ?? "", "reps")}
                  {renderSelect(idx, "weight", weightRange, set.weight ?? "", "kg")}
                </>
              )}
              {exerciseType === "cardio" && (
                <>
                  {renderSelect(idx, "duration", durationRange, set.duration ?? "", "min")}
                  {renderSelect(idx, "intensity", intensityRange, set.intensity ?? "", "intensity")}
                </>
              )}
              {exerciseType === "stretch" && (
                <>
                  {renderSelect(idx, "reps", repsRange, set.reps ?? "", "reps")}
                  {renderSelect(idx, "intensity", intensityRange, set.intensity ?? "", "intensity")}
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

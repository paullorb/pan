"use client"
import React from "react"
import styles from "./details.module.css"
import { SET_RANGES } from "./constants"
import { ExerciseType, ExerciseSet } from "../../lib/types/exercise"

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
  const updateSetField = (idx: number, field: keyof ExerciseSet, val: string) => {
    if (sets[idx].completed || exerciseCompleted) return
    const newSets = sets.map((set, i) => i === idx ? { ...set, [field]: val } : set)
    updateSets(newSets)
  }

  const renderSelect = (idx: number, field: keyof ExerciseSet, options: string[], value: string, unit: string) => (
    <div className={styles.basicSelectWrapper}>
      <select
        value={value}
        disabled={sets[idx].completed || exerciseCompleted}
        onChange={e => updateSetField(idx, field, e.target.value)}
        className={styles.basicSelect}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <span className={styles.unit}>{unit}</span>
    </div>
  )

  return (
    <form className={styles.detailsForm}>
      {sets.map((set, idx) => (
        <div key={idx}>
          <div className={styles.setInner}>
            <div className={styles.selectsWrapper}>
              {exerciseType === "weight" && (
                <>
                  {renderSelect(idx, "reps", SET_RANGES.reps, set.reps ?? "", "reps")}
                  {renderSelect(idx, "weight", SET_RANGES.weight, set.weight ?? "", "kg")}
                </>
              )}
              {exerciseType === "cardio" && (
                <>
                  {renderSelect(idx, "duration", SET_RANGES.duration, set.duration ?? "", "min")}
                  {renderSelect(idx, "intensity", SET_RANGES.intensity, set.intensity ?? "", "intensity")}
                </>
              )}
              {exerciseType === "stretch" && (
                <>
                  {renderSelect(idx, "reps", SET_RANGES.reps, set.reps ?? "", "reps")}
                  {renderSelect(idx, "intensity", SET_RANGES.intensity, set.intensity ?? "", "intensity")}
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
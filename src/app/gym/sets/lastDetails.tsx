"use client"
import styles from "./details.module.css"
import { SET_RANGES } from "./constants"

type LastDetailsProps = {
  exerciseType: string
  lastDetails: {
    reps?: string
    weight?: string
    duration?: string
    intensity?: string
  } | null
}

export default function LastDetails({ exerciseType, lastDetails }: LastDetailsProps) {
  if (!lastDetails) return null

  // Prepare ranges
  const repsRange = SET_RANGES.reps
  const weightRange = SET_RANGES.weight
  const durationRange = SET_RANGES.duration
  const intensityRange = SET_RANGES.intensity

  // Helper to render a disabled select
  const renderSelect = (
    field: string,
    options: string[],
    value: string,
    unit: string
  ) => (
    <div className={styles.basicSelectWrapper}>
      <select
        value={value}
        disabled
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

  return (
    <div className={styles.setContainer} style={{ opacity: 0.5 }}>
      <div className={styles.setInner}>
        <div className={styles.selectsWrapper}>
          {exerciseType === "weight" && (
            <>
              {renderSelect("reps", repsRange, lastDetails.reps ?? "", "reps")}
              {renderSelect("weight", weightRange, lastDetails.weight ?? "", "kg")}
            </>
          )}
          {exerciseType === "cardio" && (
            <>
              {renderSelect("duration", durationRange, lastDetails.duration ?? "", "min")}
              {renderSelect("intensity", intensityRange, lastDetails.intensity ?? "", "intensity")}
            </>
          )}
          {exerciseType === "stretch" && (
            <>
              {renderSelect("reps", repsRange, lastDetails.reps ?? "", "reps")}
              {renderSelect("intensity", intensityRange, lastDetails.intensity ?? "", "intensity")}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

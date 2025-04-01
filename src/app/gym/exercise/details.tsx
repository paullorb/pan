"use client"
import styles from "./details.module.css"
import CustomSelect from "./customSelect"

export default function Details({ exerciseType, sets, updateSets }: { exerciseType: string, sets: any[], updateSets: (newSets: any[]) => void }) {
  const repsRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())
  const weightRange = Array.from({ length: 401 }, (_, i) => (i * 0.5).toString())
  const durationRange = Array.from({ length: 60 }, (_, i) => (i + 1).toString())
  const intensityRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())

  const updateSetField = (idx: number, field: string, val: string) => {
    const newSets = sets.map((set, i) => i === idx ? { ...set, [field]: val } : set)
    updateSets(newSets)
  }

  return (
    <form className={styles.detailsForm}>
      {sets.map((set, idx) => (
        <div key={idx} className={styles.setContainer}>
          {exerciseType === "weight" && (
            <>
              <CustomSelect options={repsRange} value={set.reps} onChange={val => updateSetField(idx, "reps", val)} unit="reps" />
              <CustomSelect options={weightRange} value={set.weight} onChange={val => updateSetField(idx, "weight", val)} unit="kg" />
            </>
          )}
          {exerciseType === "cardio" && (
            <>
              <CustomSelect options={durationRange} value={set.duration} onChange={val => updateSetField(idx, "duration", val)} unit="min" />
              <CustomSelect options={intensityRange} value={set.intensity} onChange={val => updateSetField(idx, "intensity", val)} unit="intensity" />
            </>
          )}
          {exerciseType === "stretch" && (
            <>
              <CustomSelect options={repsRange} value={set.reps} onChange={val => updateSetField(idx, "reps", val)} unit="reps" />
              <CustomSelect options={intensityRange} value={set.intensity} onChange={val => updateSetField(idx, "intensity", val)} unit="intensity" />
            </>
          )}
        </div>
      ))}
    </form>
  )
}

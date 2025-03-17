"use client"
import styles from "./details.module.css"

type SetType = { reps: string; weight: string }
export type DetailsType = {
  sets: SetType[]
  time: string
  intensity: string
  reps: string
}

type Props = {
  exerciseType: string
  exerciseDetails: DetailsType
  updateSet: (index: number, field: "reps" | "weight", value: string) => void
  addSet: () => void
  deleteSet: () => void
  updateDetailField: (field: "time" | "intensity" | "reps", value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void
}

export default function Details({
  exerciseType,
  exerciseDetails,
  updateSet,
  addSet,
  deleteSet,
  updateDetailField,
  handleKeyDown
}: Props) {
  const { sets, time, intensity, reps } = exerciseDetails
  const repsRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())
  const weightRange = Array.from({ length: 101 }, (_, i) => (i * 0.5).toString())
  const timeRange = Array.from({ length: 60 }, (_, i) => (i + 1).toString())
  const intensityRange = Array.from({ length: 20 }, (_, i) => (i + 1).toString())

  if (exerciseType === "weight") {
    return (
      <form onSubmit={e => e.preventDefault()} className={styles.detailsForm}>
        {sets.map((set, index) => (
          <div key={index} className={styles.setContainer}>
            <select
              value={set.reps}
              onChange={e => updateSet(index, "reps", e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.repsInput}
            >
              {repsRange.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className={styles.unit}>x</span>
            <select
              value={set.weight}
              onChange={e => updateSet(index, "weight", e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.weightsInput}
            >
              {weightRange.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className={styles.unit}>kg</span>
          </div>
        ))}
        <div className={styles.buttonContainer}>
          <button onClick={deleteSet} className={styles.deleteButton}>
            Delete Last Set
          </button>
          <button onClick={addSet} className={styles.addButton}>
            Add New Set
          </button>
        </div>
      </form>
    )
  }

  const isCardio = exerciseType === "cardio"
  return (
    <form onSubmit={e => e.preventDefault()} className={styles.detailsForm}>
      <div className={styles.inputContainer}>
        <label>{isCardio ? "Time (min):" : "Time (sec):"}</label>
        <select
          value={time}
          onChange={e => updateDetailField("time", e.target.value)}
          onKeyDown={handleKeyDown}
        >
          {timeRange.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label>{isCardio ? "Intensity:" : "Reps:"}</label>
        <select
          value={isCardio ? intensity : reps}
          onChange={e =>
            updateDetailField(isCardio ? "intensity" : "reps", e.target.value)
          }
          onKeyDown={handleKeyDown}
        >
          {(isCardio ? intensityRange : repsRange).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}

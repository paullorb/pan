"use client"
import styles from "./details.module.css"
import CustomSelect from "./customSelect"

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
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void
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
  const weightRange = Array.from({ length: 401 }, (_, i) => (i * 0.5).toString())
  const timeRange = Array.from({ length: 60 }, (_, i) => (i + 1).toString())
  const intensityRange = Array.from({ length: 50 }, (_, i) => (i + 1).toString())

  if (exerciseType === "weight") {
    return (
      <form onSubmit={e => e.preventDefault()} className={styles.detailsForm}>
        {sets.map((set, index) => (
          <div key={index} className={styles.setContainer}>
            <CustomSelect
              options={repsRange}
              value={set.reps}
              onChange={val => updateSet(index, "reps", val)}
              onKeyDown={handleKeyDown}
              className={styles.repsInput}
              unit="reps"
            />
            <CustomSelect
              options={weightRange}
              value={set.weight}
              onChange={val => updateSet(index, "weight", val)}
              onKeyDown={handleKeyDown}
              className={styles.weightsInput}
              unit="kg"
            />
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
        <CustomSelect
          options={timeRange}
          value={time}
          onChange={val => updateDetailField("time", val)}
          onKeyDown={handleKeyDown}
        />
        <label>{isCardio ? "Intensity:" : "Reps:"}</label>
        <CustomSelect
          options={isCardio ? intensityRange : repsRange}
          value={isCardio ? intensity : reps}
          onChange={val =>
            updateDetailField(isCardio ? "intensity" : "reps", val)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  )
}

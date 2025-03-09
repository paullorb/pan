"use client"
import styles from "./card.module.css"

type SetType = { reps: string; weight: string }
type DetailsType = {
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
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Details = ({
  exerciseType,
  exerciseDetails,
  updateSet,
  addSet,
  deleteSet,
  updateDetailField,
  handleKeyDown
}: Props) => {
  const { sets, time, intensity, reps } = exerciseDetails

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.detailsForm}>
      {exerciseType === "weight" && (
        <>
          {sets.map((set, index) => (
            <div key={index} className={styles.setContainer}>
              <input
                type="text"
                value={set.reps}
                onChange={(e) => updateSet(index, "reps", e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.repsInput}
              />
              <span className={styles.unit}>x</span>
              <input
                type="text"
                value={set.weight}
                onChange={(e) => updateSet(index, "weight", e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.weightsInput}
              />
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
        </>
      )}
      {exerciseType === "cardio" && (
        <div className={styles.inputContainer}>
          <label>Time (min):</label>
          <input
            type="text"
            value={time}
            onChange={(e) => updateDetailField("time", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label>Intensity:</label>
          <input
            type="text"
            value={intensity}
            onChange={(e) => updateDetailField("intensity", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      {exerciseType === "stretch" && (
        <div className={styles.inputContainer}>
          <label>Time (sec):</label>
          <input
            type="text"
            value={time}
            onChange={(e) => updateDetailField("time", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label>Reps:</label>
          <input
            type="text"
            value={reps}
            onChange={(e) => updateDetailField("reps", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </form>
  )
}

export default Details

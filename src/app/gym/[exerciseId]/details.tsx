"use client"
import styles from "./card.module.css"

type SetType = { reps: string; weight: string }

type DetailsProps = {
  exerciseType: string
  sets: SetType[]
  updateSet: (index: number, field: "reps" | "weight", value: string) => void
  addSet: () => void
  deleteSet: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Details = ({
  exerciseType,
  sets,
  updateSet,
  addSet,
  deleteSet,
  handleKeyDown
}: DetailsProps) => {
  if (exerciseType === "weight") {
    return (
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
    )
  }
  if (exerciseType === "cardio") {
    return <div>Cardio details here</div>
  }
  if (exerciseType === "stretch") {
    return <div>Stretch details here</div>
  }
  return null
}

export default Details

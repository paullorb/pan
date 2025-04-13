"use client"
import styles from "./completed.module.css"

type CompletedProps = {
  completedToday: boolean
  sets: { completed: boolean }[]
  onToggleCompletion: () => void
  onCompleteAndNext: () => void
}

export default function Completed({
  completedToday,
  sets,
  onToggleCompletion,
  onCompleteAndNext
}: CompletedProps) {
  const disabled = !sets.every(s => s.completed) && !completedToday

  return (
    <div className={styles.container}>
      <button className={styles.button} disabled={disabled} onClick={onToggleCompletion}>
        {completedToday ? "Mark as Incomplete" : "Mark as Completed"}
      </button>
      {!completedToday && (
        <button className={styles.button} disabled={disabled} onClick={onCompleteAndNext}>
          Mark as Completed & Next
        </button>
      )}
    </div>
  )
}

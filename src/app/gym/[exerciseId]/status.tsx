"use client"

import { daysBetween } from "./utils"
import styles from "./status.module.css"

type StatusProps = {
  exerciseName: string
  imageSrc?: string
  lastDoneDate?: string
}

export default function Status({ exerciseName, imageSrc, lastDoneDate }: StatusProps) {
  const containerStyle = { width: "250px", height: "250px", backgroundColor: "#eee" }

  let statusText = ""
  if (lastDoneDate) {
    const diff = daysBetween(new Date(lastDoneDate), new Date())
    statusText = diff === 0 ? "(done today)" : `(${diff} day${diff > 1 ? "s" : ""} since last done)`
  }

  return (
    <div className={styles.statusContainer}>
      <div style={containerStyle}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={exerciseName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div className={styles.statusText}>
        {exerciseName} {statusText}
      </div>
    </div>
  )
}

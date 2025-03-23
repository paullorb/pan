"use client"
import styles from "./progressLine.module.css"

export default function ProgressLine() {

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.lineContainer}>
          <div className={styles.lineBackground} />
          <div
            className={styles.lineCompleted}
          />
        </div>
          <div
            className={styles.item}
          >
            <div
              className={styles.itemContent}
            >
            </div>
          </div>
    </div>
    </div>
  )
}

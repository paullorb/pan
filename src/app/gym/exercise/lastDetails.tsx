"use client"

import styles from "./lastDetails.module.css"

type LastDetailsProps = {
  lastSet: { reps: string; weight: string } | null
}
export default function LastDetails({ lastSet }: LastDetailsProps) {
  if (!lastSet) return null
  return (
    <div className={styles.container}>
      <div className={styles.value}>{lastSet.reps} reps</div> 
      <div className={styles.value}>{lastSet.weight} kg</div>
    </div>
  )
}

"use client"
import styles from "./nextup.module.css"

type Props = {
  exercise: { name: string }
  isActive: boolean
  onClick: () => void
}

export default function NextUp({ exercise, isActive, onClick }: Props) {
  return (
    <div
      className={`
        ${styles.container}
        ${isActive ? styles.changingNext : ""}
      `}
      onClick={onClick}
    >
      &#x21B3;{exercise.name}
    </div>
  )
}

"use client"

import styles from "./workout.module.css"

type ModifierProps = {
  onAdd: () => void
  onRemove: () => void
}

export default function Modifier({ onAdd, onRemove }: ModifierProps) {
  return (
    <div className={styles.modifiers}>
      <button type="button" onClick={onAdd} className={styles.modifier}>
        +
      </button>
      <button type="button" onClick={onRemove} className={styles.modifier}>
        -
      </button>
    </div>
  )
}

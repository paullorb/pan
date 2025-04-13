"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import styles from "./list.module.css"

type ExerciseItem = {
  name: string
  type: string
  mainMuscle: string
  keyMovement?: string
  equipment?: string
  color?: string
}

type TileProps = {
  ex: ExerciseItem
  onSelectExercise: (exerciseName: string) => void
  showImages: boolean
}

export default function Tile({ ex, onSelectExercise, showImages }: TileProps) {
  const [imgError, setImgError] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    setImgError(false)
    // Same pattern as in your status/card:
    setImageUrl(`/${encodeURIComponent(ex.name)}.png`)
  }, [ex.name])

  return (
    <li
      className={styles.tile}
      onClick={() => onSelectExercise(ex.name)}
    >
      <span style={{ color: ex.color }}>{ex.type}</span>
      <span>{ex.name}</span>

      {showImages ? (
        !imgError ? (
          <Image
            src={imageUrl}
            alt={ex.name}
            width={50}
            height={50}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.placeholder}>no image</div>
        )
      ) : null}
    </li>
  )
}

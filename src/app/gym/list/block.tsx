"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import styles from "./list.module.css"

type ExerciseItem = {
  name: string
  type?: string
  mainMuscle?: string
  keyMovement?: string
  equipment?: string
  color?: string
}

type BlockProps = {
  ex: ExerciseItem
  onSelectExercise?: (exerciseName: string) => void
  showImages?: boolean
  isTimeline?: boolean
}

export default function Block({ ex, onSelectExercise, showImages = false, isTimeline = false }: BlockProps) {
  const [imgError, setImgError] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  
  // Data-URI for an SVG that says "no img"
  const placeholderDataUri =
    "data:image/svg+xml,%3Csvg%20width%3D%2250%22%20height%3D%2250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22white%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22black%22%20font-size%3D%2210%22%3Eno%20img%3C%2Ftext%3E%3C%2Fsvg%3E"

  useEffect(() => {
    setImgError(false)
    setImageUrl(`/${encodeURIComponent(ex.name)}.png`)
  }, [ex.name])

  const handleClick = () => {
    if (onSelectExercise) {
      onSelectExercise(ex.name)
    }
  }

  return (
    <div 
      className={`${styles.block} ${isTimeline ? styles.timelineBlock : ''}`} 
      onClick={handleClick}
    >
      <div className={styles.blockContent}>
        <span className={styles.blockType} style={{ color: ex.color }}>{ex.type}</span>
        <span className={styles.blockName}>{ex.name}</span>
        {showImages && (
          !imgError ? (
            <Image
              src={imageUrl}
              alt={ex.name}
              width={50}
              height={50}
              onError={() => setImgError(true)}
            />
          ) : (
            <Image
              src={placeholderDataUri}
              alt="no img"
              width={50}
              height={50}
            />
          )
        )}
      </div>
    </div>
  )
} 
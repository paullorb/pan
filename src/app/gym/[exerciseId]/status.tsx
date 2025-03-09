"use client"
import styles from "./status.module.css"

type StatusProps = {
  imageSrc?: string
  lastDoneDate?: string
}

export default function Status({ imageSrc, lastDoneDate }: StatusProps) {
  return (
    <div className={styles.statusContainer}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          className={styles.responsiveImage}
        />
      )}
    </div>
  )
}

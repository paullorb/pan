"use client"
import { useState, useEffect } from "react"
import styles from "./status.module.css"

type StatusProps = {
  imageSrc?: string
  lastDoneDate?: string
}

export default function Status({ imageSrc }: StatusProps) {
  const [imgError, setImgError] = useState(false)
  
  useEffect(() => {
    setImgError(false)
  }, [imageSrc])

  return (
    <div className={styles.statusContainer}>
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt=""
          className={styles.responsiveImage}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.placeholder}>no image</div>
      )}
    </div>
  )
}

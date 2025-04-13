'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './status.module.css'

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
        <Image
          src={imageSrc}
          alt=""
          fill
          className={styles.responsiveImage}
          onError={() => setImgError(true)}
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <div className={styles.placeholder}>no image</div>
      )}
    </div>
  )
}

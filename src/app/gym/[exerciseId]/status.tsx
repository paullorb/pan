// status.tsx
"use client"
import styles from "./status.module.css"

type StatusProps = {
  imageSrc?: string
  lastDoneDate?: string
}

export default function Status({ imageSrc, lastDoneDate }: StatusProps) {
  const containerStyle = {
    width: "250px",
    height: "250px",
    backgroundColor: "#eee"
  }

  return (
    <div className={styles.statusContainer}>
      <div style={containerStyle}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      {/* If you wanted, you could still show something about lastDoneDate here */}
    </div>
  )
}

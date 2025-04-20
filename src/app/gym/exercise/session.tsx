"use client"
import { useState } from "react"
import { useSession } from "./sessionContext"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function Session() {
  const { state, time, start, pause, end } = useSession()
  const [showControls, setShowControls] = useState(false)

  const handleClick = () => {
    if (state === "idle") start()
    else setShowControls(prev => !prev)
  }

  return (
    <div onClick={handleClick} style={{ textAlign: "center", marginBottom: "1rem" }}>
      <div style={{ fontSize: "2rem", fontWeight: "bold", cursor: "pointer" }}>
        {state === "idle" ? "Start Workout" : formatTime(time)}
      </div>
      {showControls && state !== "idle" && state !== "ended" && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          {state === "running" && <button onClick={pause}>Pause</button>}
          {state === "paused" && <button onClick={start}>Resume</button>}
          <button onClick={end}>End</button>
        </div>
      )}
    </div>
  )
}

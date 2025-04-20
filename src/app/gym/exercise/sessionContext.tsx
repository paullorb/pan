"use client"
import { createContext, useContext, useState, useEffect } from "react"

type SessionState = "idle" | "running" | "paused" | "ended"

type SessionContextType = {
  state: SessionState
  time: number
  start: () => void
  pause: () => void
  end: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>("idle")
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (state === "running") {
      const id = setInterval(() => setTime(t => t + 1), 1000)
      setIntervalId(id)
    } else if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }, [state])

  const start = () => {
    if (state === "idle" || state === "paused") setState("running")
  }

  const pause = () => {
    if (state === "running") setState("paused")
  }

  const end = () => {
    setState("ended")
    setTime(0)
  }

  return (
    <SessionContext.Provider value={{ state, time, start, pause, end }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error("useSession must be used within SessionProvider")
  return context
}

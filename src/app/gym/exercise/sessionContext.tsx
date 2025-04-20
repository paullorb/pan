// sessionContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'

type SessionState = 'idle' | 'running' | 'paused' | 'ended'
type SessionContextType = {
  state: SessionState
  time: number
  start: () => void
  pause: () => void
  end: () => void
}

const SessionContext = createContext<SessionContextType|undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>('idle')
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => setTime(t => t + 1), 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state])

  const start = () => {
    if (state === 'idle' || state === 'paused') setState('running')
  }
  const pause = () => {
    if (state === 'running') setState('paused')
  }
  const end = () => {
    setState('ended')
    setTime(0)
  }

  return (
    <SessionContext.Provider value={{ state, time, start, pause, end }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

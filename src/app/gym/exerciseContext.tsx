"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useAuth } from "../auth/authContext"

export type WorkoutPayload = {
  exerciseId: string
  type: string
  details: any
  date: string
}

type ExerciseContextType = {
  workoutLogs: any[]
  fetchWorkouts: (startDate: string, endDate: string) => Promise<void>
  completeWorkout: (payload: WorkoutPayload) => Promise<void>
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined)

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([])
  const { user } = useAuth()

  const fetchWorkouts = useCallback(async (startDate: string, endDate: string) => {
    if (!user || !user.token) return
    const res = await fetch(
      `/api/workout?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      }
    )
    if (res.ok) {
      const data = await res.json()
      setWorkoutLogs(data)
    }
  }, [user])

  const completeWorkout = useCallback(async (payload: WorkoutPayload) => {
    if (!user || !user.token) return
    await fetch(`/api/workout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    })
  }, [user])

  return (
    <ExerciseContext.Provider value={{ workoutLogs, fetchWorkouts, completeWorkout }}>
      {children}
    </ExerciseContext.Provider>
  )
}

export const useExercise = () => {
  const context = useContext(ExerciseContext)
  if (!context) throw new Error("useExercise must be used within an ExerciseProvider")
  return context
}

"use client"
import { createContext, useContext, ReactNode, useCallback } from "react"
import { useAuth } from "../../auth/authContext"

export type ExercisePayload = {
  exerciseId: string
  type: string
  details: any
  date: string
}

type ExerciseContextType = {
  createExercise: (payload: ExercisePayload) => Promise<void>
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined)

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  const createExercise = useCallback(async (payload: ExercisePayload) => {
    if (!user?.token) return
    await fetch(`/api/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    })
  }, [user])

  return (
    <ExerciseContext.Provider value={{ createExercise }}>
      {children}
    </ExerciseContext.Provider>
  )
}

export const useExercise = () => {
  const context = useContext(ExerciseContext)
  if (!context) throw new Error("useExercise must be used within an ExerciseProvider")
  return context
}

"use client"
import { createContext, useContext, ReactNode, useCallback } from "react"
import { useAuth } from "../../auth/authContext"

export type ExercisePayload = {
  exerciseId: string
  type: string
  sets: { reps?: string; weight?: string; duration?: string; intensity?: string }[]
  date: string
}

type ExerciseContextType = {
  createExercise: (payload: ExercisePayload) => Promise<void>
  deleteExercise: (exerciseId: string) => Promise<void>
  getExercise: (exerciseId: string) => Promise<any>
  getLastExercise: (exerciseId: string) => Promise<any>
  getMonthExercises: (month: number, year: number) => Promise<any[]>
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined)

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  const createExercise = useCallback(async (payload: ExercisePayload) => {
    if (!user?.token) return
    await fetch("/api/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    })
  }, [user])

  const deleteExercise = useCallback(async (exerciseId: string) => {
    if (!user?.token) return
    await fetch(`/api/exercises?exerciseId=${exerciseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` }
    })
  }, [user])

  const getExercise = useCallback(async (exerciseId: string) => {
    if (!user?.token) return null
    const res = await fetch(`/api/exercises?exerciseId=${exerciseId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      return data.exercise
    }
    return null
  }, [user])

  const getLastExercise = useCallback(async (exerciseId: string) => {
    if (!user?.token) return null
    const res = await fetch(`/api/exercises?exerciseId=${exerciseId}&last=true`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      return data.exercise
    }
    return null
  }, [user])

  const getMonthExercises = useCallback(async (month: number, year: number) => {
    if (!user?.token) return []
    const res = await fetch(`/api/exercises?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      return data.exercises || []
    }
    return []
  }, [user])

  return (
    <ExerciseContext.Provider value={{
      createExercise,
      deleteExercise,
      getExercise,
      getLastExercise,
      getMonthExercises
    }}>
      {children}
    </ExerciseContext.Provider>
  )
}

export const useExercise = () => {
  const context = useContext(ExerciseContext)
  if (!context) throw new Error("useExercise must be used within an ExerciseProvider")
  return context
}

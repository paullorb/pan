"use client"
import { createContext, useContext, useState, ReactNode } from "react"

type WorkoutContextType = {
  exercises: string[]
  setExercises: (exercises: string[]) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  return (
    <WorkoutContext.Provider value={{ exercises, setExercises, currentIndex, setCurrentIndex }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export const useWorkout = () => {
  const context = useContext(WorkoutContext)
  if (!context) throw new Error("useWorkout must be used within a WorkoutProvider")
  return context
}

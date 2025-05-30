"use client"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "../../auth/authContext"
import styles from "./timeline.module.css"
import Block from "../list/block"
import React from "react"

type Exercise = {
  exerciseId: string
  type: string
  sets: any[]
  date: string
  name: string
  color?: string
  mainMuscle?: string
}
type CurrentExercise = {
  name: string
  slug: string
  completed: boolean
  type?: string
  color?: string
}
type TimelineProps = {
  currentExercise?: CurrentExercise
  completedExercises: string[]
}
export default function Timeline({ currentExercise, completedExercises }: TimelineProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    fetch("/api/exercises?today=true", { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => setExercises(data.exercises || []))
  }, [user])
  let timelineItems = exercises
  if (currentExercise && !exercises.find(ex => ex.exerciseId === currentExercise.slug)) {
    timelineItems = [
      ...exercises,
      { 
        exerciseId: currentExercise.slug, 
        type: currentExercise.type || "", 
        sets: [], 
        date: new Date().toISOString(),
        name: currentExercise.name,
        color: currentExercise.color
      }
    ]
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [timelineItems])

  return (
    <div className={styles.container} ref={containerRef}>
      {timelineItems.map((ex, idx) => {
        const isCompleted = completedExercises.includes(ex.exerciseId)
        const statusClass = isCompleted ? styles.completed : styles.incomplete

        
        const exerciseData = exercises.find(e => e.exerciseId === ex.exerciseId) || {
          name: ex.exerciseId,
          type: ex.type,
          mainMuscle: ex.mainMuscle || "",
          color: ex.color
        }
        
        return (
          <div key={ex.exerciseId} className={`${styles.item} ${statusClass}`}>
            <Block
              ex={{
                name: exerciseData.name,
                type: exerciseData.type,
                mainMuscle: exerciseData.mainMuscle || "",
                color: exerciseData.color
              }}
              isTimeline={true}
            />
          </div>
        )
      })}
    </div>
  )
}

"use client"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "../../auth/authContext"
import styles from "./timeline.module.css"
import React from "react"

type Exercise = {
  exerciseId: string
  type: string
  sets: any[]
  date: string
}
type CurrentExercise = {
  name: string
  slug: string
  completed: boolean
}
type TimelineProps = {
  currentExercise?: CurrentExercise
}
export default function Timeline({ currentExercise }: TimelineProps) {
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
      { exerciseId: currentExercise.slug, type: "", sets: [], date: new Date().toISOString() }
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
        const isCurrent = currentExercise && ex.exerciseId === currentExercise.slug
        const statusClass = isCurrent
          ? currentExercise.completed
            ? styles.completed
            : styles.incomplete
          : styles.completed
        return (
          <div key={idx} className={`${styles.item} ${statusClass}`}>
            <span>{ex.exerciseId}</span>
            <div className={`${styles.line} ${statusClass}`}></div>
          </div>
        )
      })}
    </div>
  )
}

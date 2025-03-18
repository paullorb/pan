"use client"
import { useState, useMemo } from "react"
import styles from "./list.module.css"

type ExerciseItem = {
  name: string
  type: string
  mainMuscle: string
  keyMovement?: string
}

type ListProps = {
  exercises: ExerciseItem[]
  onSelectExercise: (exercise: string) => void
}

const List = ({ exercises, onSelectExercise }: ListProps) => {
  const [selectedModality, setSelectedModality] = useState("")
  const [selectedMainMuscle, setSelectedMainMuscle] = useState("")
  const [selectedMovement, setSelectedMovement] = useState("")

  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => a.name.localeCompare(b.name))
  }, [exercises])

  const filteredExercises = useMemo(() => {
    return sortedExercises.filter(ex => {
      return (selectedModality ? ex.type === selectedModality : true) &&
             (selectedMainMuscle ? ex.mainMuscle === selectedMainMuscle : true) &&
             (selectedMovement ? ex.keyMovement === selectedMovement : true)
    })
  }, [sortedExercises, selectedModality, selectedMainMuscle, selectedMovement])

  const modalities = useMemo(() => {
    const set = new Set(sortedExercises.map(ex => ex.type))
    return Array.from(set).sort()
  }, [sortedExercises])

  const mainMuscles = useMemo(() => {
    const set = new Set(sortedExercises.map(ex => ex.mainMuscle))
    return Array.from(set).sort()
  }, [sortedExercises])

  const movements = useMemo(() => {
    const set = new Set(sortedExercises.map(ex => ex.keyMovement).filter(Boolean))
    return Array.from(set).sort()
  }, [sortedExercises])

  return (
    <div>
      <div>
        <select value={selectedModality} onChange={e => setSelectedModality(e.target.value)}>
          <option value="">All Modalities</option>
          {modalities.map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>
        <select value={selectedMainMuscle} onChange={e => setSelectedMainMuscle(e.target.value)}>
          <option value="">All Main Muscles</option>
          {mainMuscles.map(mm => (
            <option key={mm} value={mm}>{mm}</option>
          ))}
        </select>
        <select value={selectedMovement} onChange={e => setSelectedMovement(e.target.value)}>
          <option value="">All Movements</option>
          {movements.map(mv => (
            <option key={mv} value={mv}>{mv}</option>
          ))}
        </select>
      </div>
      <ul className={styles.dropdown}>
        {filteredExercises.map((ex, i) => (
          <li key={i} onClick={() => onSelectExercise(ex.name)}>
            <span className={styles.type}>{ex.type}</span>
            <span>{ex.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List

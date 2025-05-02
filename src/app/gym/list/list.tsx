"use client"
import React, { useState, useMemo } from "react"
import styles from "./list.module.css"
import Tile from "./tile"
import Block from "./block"

type ExerciseItem = {
  name: string
  type: string
  mainMuscle: string
  keyMovement?: string
  equipment?: string
  color?: string
}

type ListProps = {
  exercises: ExerciseItem[]
  onSelectExercise: (exerciseName: string) => void
}

export default function List({ exercises = [], onSelectExercise }: ListProps) {
  const [selectedModality, setSelectedModality] = useState("")
  const [selectedMainMuscle, setSelectedMainMuscle] = useState("")
  const [selectedMovement, setSelectedMovement] = useState("")
  const [isTileView, setIsTileView] = useState(false)
  const [sortField, setSortField] = useState<keyof ExerciseItem | null>(null)
  const [showImages, setShowImages] = useState(false)
  const [columns, setColumns] = useState(2)

  const filteredExercises = useMemo(() => {
    const filtered = exercises.filter(ex =>
      (!selectedModality || ex.type === selectedModality) &&
      (!selectedMainMuscle || ex.mainMuscle === selectedMainMuscle) &&
      (!selectedMovement || ex.keyMovement === selectedMovement)
    )
    if (sortField) {
      filtered.sort((a, b) => (a[sortField] ?? "").localeCompare(b[sortField] ?? ""))
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
    return filtered
  }, [exercises, selectedModality, selectedMainMuscle, selectedMovement, sortField])

  if (!exercises.length) {
    return <div>No exercises found</div>
  }

  const uniqueValues = (field: keyof ExerciseItem) =>
    Array.from(new Set(exercises.map(ex => ex[field]).filter(Boolean))).sort()

  const toggleSort = (field: keyof ExerciseItem) => {
    setSortField(prev => (prev === field ? null : field))
  }

  return (
    <>
      <div className={styles.header}>
              <button 
          onClick={() => setIsTileView(x => !x)} 
          className={styles.toggleView}
          title={isTileView ? "Switch to cell view" : "Switch to tile view"}
        >
          {isTileView ? "📊" : "🧩"}
        </button>

        <button 
          onClick={() => setShowImages(x => !x)}
          title={showImages ? "Hide images" : "Show images"}
        >
          {showImages ? "🖼️" : "📷"}
        </button>

          <button 
            onClick={() => setColumns(columns === 2 ? 3 : 2)}
            title={`Switch to ${columns === 2 ? 3 : 2} columns`}
          >
            {columns === 2 ? "📑" : "📋"}
          </button>
      </div>
      <div className={styles.filters}>
        <div className={styles.filterLabel}>
          <select
            value={selectedModality}
            onChange={e => setSelectedModality(e.target.value)}
          >
            <option value="">All Modalities</option>
            {uniqueValues("type").map(m => <option key={m}>{m}</option>)}
          </select>
          <button onClick={() => toggleSort("type")} className={styles.sortBtn}>
            ⇅
          </button>
        </div>

        <div className={styles.filterLabel}>
          <select
            value={selectedMainMuscle}
            onChange={e => setSelectedMainMuscle(e.target.value)}
          >
            <option value="">All Muscles</option>
            {uniqueValues("mainMuscle").map(mm => <option key={mm}>{mm}</option>)}
          </select>
          <button onClick={() => toggleSort("mainMuscle")} className={styles.sortBtn}>
            ⇅
          </button>
        </div>

        <div className={styles.filterLabel}>
          <select
            value={selectedMovement}
            onChange={e => setSelectedMovement(e.target.value)}
          >
            <option value="">All Movements</option>
            {uniqueValues("keyMovement").map(km => <option key={km}>{km}</option>)}
          </select>
          <button onClick={() => toggleSort("keyMovement")} className={styles.sortBtn}>
            ⇅
          </button>
        </div>
      </div>

      {!filteredExercises.length && <div>No exercises match your filters</div>}

      {filteredExercises.length > 0 && (
        <div className={styles.listScroll}>
          {isTileView ? (
            <div className={`${styles.blockContainer} ${styles[`columns${columns}`]}`}>
              {filteredExercises.map((ex, idx) => (
                <Block
                  key={idx}
                  ex={ex}
                  onSelectExercise={onSelectExercise}
                  showImages={showImages}
                />
              ))}
            </div>
          ) : (
            <table className={styles.cellTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Main Muscle</th>
                  <th>Movement</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map((ex, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectExercise(ex.name)}
                    className={styles.cellRow}
                  >
                    <td>{ex.name}</td>
                    <td>{ex.type}</td>
                    <td>{ex.mainMuscle}</td>
                    <td>{ex.keyMovement || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  )
}

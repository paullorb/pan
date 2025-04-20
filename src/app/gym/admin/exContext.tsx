// /context/exContext.tsx
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Exercise {
  _id: string
  name: string
  mainMuscle: string
  type: string
  bestPractice: string
  keyMovement: string
  color?: string
}

type ExContextType = {
  defs: Exercise[]
  add: (d: Omit<Exercise, '_id'>) => Promise<void>
  update: (id: string, u: Partial<Exercise>) => Promise<void>
  remove: (id: string) => Promise<void>
}

const ExContext = createContext<ExContextType | undefined>(undefined)

export function ExProvider({ children }: { children: ReactNode }) {
  const [defs, setDefs] = useState<Exercise[]>([])

  useEffect(() => {
    async function loadDefs() {
      const res = await fetch('/api/admin/exercises')
      if (!res.ok) return
      const data = (await res.json()) as Exercise[]
      setDefs(data)
    }
    loadDefs()
  }, [])

  const add = async (data: Omit<Exercise, '_id'>): Promise<void> => {
    const res = await fetch('/api/admin/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to add exercise')
    const newDef = (await res.json()) as Exercise
    setDefs(ds => [...ds, newDef])
  }

  const update = async (id: string, u: Partial<Exercise>): Promise<void> => {
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u)
    })
    if (!res.ok) throw new Error('Failed to update exercise')
    const updated = (await res.json()) as Exercise
    setDefs(ds => ds.map(x => (x._id === id ? updated : x)))
  }

  const remove = async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/exercises/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete exercise')
    setDefs(ds => ds.filter(x => x._id !== id))
  }

  return (
    <ExContext.Provider value={{ defs, add, update, remove }}>
      {children}
    </ExContext.Provider>
  )
}

export function useEx() {
  const context = useContext(ExContext)
  if (!context) throw new Error('useEx must be used within ExProvider')
  return context
}

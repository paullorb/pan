'use client'
import React, { createContext, useContext, useState, ReactNode } from "react"
import { useAuth } from "../nav/authContext"

export interface Item {
  text: string
  context: string | null
  userId: string
  date: string
}

interface ItemsContextType {
  items: { [date: string]: Item[] }
  addItem: (date: string, text: string) => Promise<void>
  updateItemContext: (date: string, index: number, context: string | null) => void
  fetchMonthEntries: (month: number, year: number) => Promise<void>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState<{ [date: string]: Item[] }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = async (date: string, text: string) => {
    if (!user) return
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const newEntry = { date, text, context: null }
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(newEntry),
      })
      if (!res.ok) throw new Error("Failed to save entry")
      setItems((prev) => {
        const prevList = prev[date] || []
        return { 
          ...prev, 
          [date]: [
            ...prevList, 
            { text, context: null, userId: user.id, date }
          ] 
        }
      })
    } catch (error) {
      console.error("Error in addItem:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateItemContext = (date: string, index: number, context: string | null) => {
    setItems((prev) => {
      const prevList = prev[date] || []
      const newList = [...prevList]
      if (newList[index]) newList[index] = { ...newList[index], context }
      return { ...prev, [date]: newList }
    })
  }

  const fetchMonthEntries = async (month: number, year: number) => {
    if (!user) return
    try {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]
      const res = await fetch(`/api/entry?startDate=${startStr}&endDate=${endStr}`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch entries')
      const data: Item[] = await res.json()
      // Group entries by date. Assume each entry.date is a string in YYYY-MM-DD format.
      const grouped: { [date: string]: Item[] } = {}
      data.forEach((entry) => {
        const key = entry.date
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(entry)
      })
      setItems(grouped)
    } catch (error) {
      console.error("Error fetching month entries:", error)
    }
  }

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItemContext, fetchMonthEntries }}>
      {children}
    </ItemsContext.Provider>
  )
}

export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext)
  if (!context) throw new Error("useItems must be used within an ItemsProvider")
  return context
}

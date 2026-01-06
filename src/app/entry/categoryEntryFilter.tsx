'use client'
import React, { useState } from "react"
import Categories from "app/category/categories"
import Entry from "../entry/entry"
import CalendarTable from "app/cal/calendarTable"
import CalendarWeek from "app/cal/calendarWeek"

const CategoryEntryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(prev => (prev === cat ? null : cat))
  }

  return (
    <>
      <Categories
        selectedCategory={selectedCategory}
        onlyOpen={onlyOpen}
        onSelectCategory={handleCategoryClick}
        onToggleOnlyOpen={() => setOnlyOpen(prev => !prev)}
      />
      <div>
        {viewMode === "month" ? (
          <button onClick={() => setViewMode("week")}>Weekly</button>
        ) : (
          <button onClick={() => setViewMode("month")}>Monthly</button>
        )}
      </div>
      {viewMode === "month" && <CalendarTable selectedCategory={selectedCategory} />}
      {viewMode === "week" && <CalendarWeek selectedCategory={selectedCategory} />}
      <Entry selectedCategory={selectedCategory} onlyOpen={onlyOpen} />
    </>
  )
}

export default CategoryEntryFilter

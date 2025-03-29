'use client'
import React, { useState } from "react"
import Categories from "app/category/categories"
import Entry from "../entry/entry"
import CalendarTable from "app/cal/calendarTable"

const CategoryEntryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false)
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
      <CalendarTable selectedCategory={selectedCategory} />
      <Entry selectedCategory={selectedCategory} onlyOpen={onlyOpen} />
    </>
  )
}

export default CategoryEntryFilter

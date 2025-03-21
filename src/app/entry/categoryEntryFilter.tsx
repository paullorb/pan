"use client"
import React, { useState } from "react"
import Categories from "app/category/categories"
import Entry from "../entry/entry"

const CategoryEntryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <>
      <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <Entry selectedCategory={selectedCategory} />
    </>
  )
}

export default CategoryEntryFilter

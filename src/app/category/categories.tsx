"use client"
import React from "react"
import { useCategory, Category } from "./categoryContext"
import styles from "./categories.module.css"

interface CategoriesProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = useCategory()

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${selectedCategory === null ? styles.active : ""}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((cat: Category) => (
        <button
          key={cat.name}
          className={`${styles.button} ${selectedCategory === cat.name ? styles.active : ""}`}
          style={{ backgroundColor: cat.backgroundColor }}
          onClick={() => onSelectCategory(cat.name)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default Categories

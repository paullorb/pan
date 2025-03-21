"use client"
import React from "react"
import { useCategory, Category } from "../category/categoryContext"
import styles from "./categories.module.css"

interface CategoriesProps {
  selectedCategory: string | null
  onlyOpen: boolean
  onSelectCategory: (category: string) => void
  onToggleOnlyOpen: () => void
}

const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onlyOpen,
  onSelectCategory,
  onToggleOnlyOpen,
}) => {
  const categories = useCategory()

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${onlyOpen ? styles.active : ""}`}
        onClick={onToggleOnlyOpen}
      >
        ✔
      </button>
      {categories.map((cat: Category) => (
        <button
          key={cat.name}
          className={`${styles.button} ${
            selectedCategory === cat.name ? styles.active : ""
          }`}
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

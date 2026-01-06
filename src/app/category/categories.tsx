"use client"
import React from "react"
import { useCategory, Category } from "../category/categoryContext"
import { darkenColor } from "../category/utils"
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
        className={styles.button}
        onClick={onToggleOnlyOpen}
        style={{
          backgroundColor: "#e0e0e0",
          border: onlyOpen ? "1px solid #333" : "1px solid transparent",
          color: "#333",
        }}
      >
        ✔
      </button>
      {categories.map((cat: Category) => {
        const isSelected = selectedCategory === cat.name
        return (
          <button
            key={cat.name}
            className={`${styles.button} ${isSelected ? styles.selected : ""}`}
            style={{
              backgroundColor: cat.backgroundColor,
              border: `1px solid ${darkenColor(cat.backgroundColor, 10)}`,
              color: darkenColor(cat.backgroundColor, 50),
            }}
            onClick={() => onSelectCategory(cat.name)}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}

export default Categories

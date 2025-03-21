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
        style={
          onlyOpen
            ? {
                backgroundColor: "#e0e0e0",
                border: "1px solid #333",
                color: "#333",
              }
            : {}
        }
      >
        ✔
      </button>
      {categories.map((cat: Category) => {
        const isSelected = selectedCategory === cat.name
        const inlineStyle = isSelected
          ? {
              backgroundColor: cat.backgroundColor,
              border: `1px solid ${darkenColor(cat.backgroundColor, 10)}`,
              color: darkenColor(cat.backgroundColor, 50),
            }
          : {
              backgroundColor: "#e0e0e0",
              border: "1px solid transparent",
              color: "#333",
            }
        return (
          <button
            key={cat.name}
            className={styles.button}
            style={inlineStyle}
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

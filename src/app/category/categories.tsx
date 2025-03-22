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
          "--default-bg-color": "#e0e0e0",
          "--default-border": "1px solid transparent",
          "--default-color": "#333",
          // Set hover variables to the same values so the border doesn't change on hover.
          "--bg-color": "#e0e0e0",
          "--border-color": onlyOpen ? "1px solid #333" : "1px solid transparent",
          "--text-color": "#333",
          ...(onlyOpen
            ? {
                backgroundColor: "#e0e0e0",
                border: "1px solid #333",
                color: "#333",
              }
            : {}),
        } as React.CSSProperties}
      >
        ✔
      </button>
      {categories.map((cat: Category) => {
        const isSelected = selectedCategory === cat.name
        const styleVars = {
          "--bg-color": cat.backgroundColor,
          "--border-color": `1px solid ${darkenColor(cat.backgroundColor, 10)}`,
          "--text-color": darkenColor(cat.backgroundColor, 50),
          "--default-bg-color": "#e0e0e0",
          "--default-border": "1px solid transparent",
          "--default-color": "#333",
        }
        return (
          <button
            key={cat.name}
            className={`${styles.button} ${isSelected ? styles.selected : ""}`}
            style={styleVars as React.CSSProperties}
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

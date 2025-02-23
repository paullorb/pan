'use client';
import React from "react";
import { useCategory } from "./categoryContext";
import styles from "./Category.module.css";

const Category: React.FC = () => {
  const categories = useCategory();
  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <div
          key={category.name}
          className={styles.item}
          style={{
            backgroundColor: category.backgroundColor,
            borderColor: category.borderColor,
          }}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Category;

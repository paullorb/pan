'use client';
import React, { createContext, useContext } from "react";

export interface Category {
  name: string;
  backgroundColor: string;
  borderColor: string;
}

const defaultCategories: Category[] = [
  { name: "Gym", backgroundColor: "#D4EDDA", borderColor: "#A3D9A5" },
  { name: "Personal", backgroundColor: "#D1ECF1", borderColor: "#A8D8DF" },
  { name: "Work", backgroundColor: "#FFF3CD", borderColor: "#FFEC99" },
];

const CategoryContext = createContext<Category[]>(defaultCategories);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CategoryContext.Provider value={defaultCategories}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);

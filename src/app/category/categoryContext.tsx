'use client';
import React, { createContext, useContext } from 'react';

export interface Category {
  name: string;
  backgroundColor: string;
}

const defaultCategories: Category[] = [
  { name: 'Gym', backgroundColor: '#D4EDDA' },
  { name: 'Personal', backgroundColor: '#D1ECF1' },
  { name: 'Work', backgroundColor: '#FFF3CD' },
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

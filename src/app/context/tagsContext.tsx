// context/tagsContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a Tag
interface Tag {
  id: string;
  name: string;
  color?: string;
  count: number; // Count of items using the tag
}

// Define the context type
interface TagsContextType {
  tags: Tag[];
  addTag: (name: string, color?: string) => void;
  deleteTag: (id: string) => void;
  incrementTagCount: (id: string) => void;
  decrementTagCount: (id: string) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const addTag = (name: string, color?: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
      count: 0,
    };
    setTags([...tags, newTag]);
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const incrementTagCount = (id: string) => {
    setTags(tags.map(tag => tag.id === id ? { ...tag, count: tag.count + 1 } : tag));
  };

  const decrementTagCount = (id: string) => {
    setTags(tags.map(tag => tag.id === id ? { ...tag, count: Math.max(0, tag.count - 1) } : tag));
  };

  return (
    <TagsContext.Provider value={{ tags, addTag, deleteTag, incrementTagCount, decrementTagCount }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};

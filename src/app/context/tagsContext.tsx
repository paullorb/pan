"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './authContext';

interface Tag {
  id: string;
  name: string;
}

interface TagsContextType {
  tags: Tag[];
  addTag: (name: string) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTags();
    }
  }, [isAuthenticated, token]);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const formattedTags = data.data.map((tag: any) => ({
            id: tag._id,
            name: tag.name
          }));
          setTags(formattedTags);
        }
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]); // Reset to empty array on error
    }
  };

  const addTag = async (name: string) => {
    if (!name.trim() || !token) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setTags(prev => [...prev, {
            id: data.data._id,
            name: data.data.name
          }]);
        }
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  return (
    <TagsContext.Provider value={{ tags, addTag }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};
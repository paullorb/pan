"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './authContext';

interface Tag {
  id: string;
  name: string;
  color?: string;
  count: number;
}

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
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, isLoading, token, logout } = useAuth();

  // Fetch tags when the user is authenticated
  useEffect(() => {
    if (isLoading) return; // Wait until authentication state is initialized

    if (isAuthenticated) {
      const fetchTags = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/tags', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Map tags to include 'id' from MongoDB's '_id'
            const fetchedTags = data.tags.map((tag: any) => ({
              id: tag._id, // MongoDB's default '_id' field
              name: tag.name,
              color: tag.color,
              count: tag.count,
            }));
            setTags(fetchedTags);
          } else if (response.status === 401) {
            console.error('Unauthorized access. Logging out.');
            logout();
          } else {
            console.error('Failed to fetch tags');
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTags();
    } else {
      setTags([]);
    }
  }, [isAuthenticated, isLoading, token, logout]);

  // Save tags when they change
  useEffect(() => {
    if (isAuthenticated && !loading && !isLoading) {
      const saveTags = async () => {
        try {
          await fetch('/api/tags', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tags }),
          });
        } catch (error) {
          console.error('Error saving tags:', error);
        }
      };
      saveTags();
    }
  }, [tags, isAuthenticated, loading, isLoading, token]);

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
    setTags(
      tags.map(tag =>
        tag.id === id ? { ...tag, count: tag.count + 1 } : tag
      )
    );
  };

  const decrementTagCount = (id: string) => {
    setTags(
      tags.map(tag =>
        tag.id === id ? { ...tag, count: Math.max(0, tag.count - 1) } : tag
      )
    );
  };

  return (
    <TagsContext.Provider
      value={{ tags, addTag, deleteTag, incrementTagCount, decrementTagCount }}
    >
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

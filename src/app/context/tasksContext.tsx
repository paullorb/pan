// tasksContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { useDate } from './dateContext';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  date: string; // Store date as 'YYYY-MM-DD'
}

interface TasksContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedDate } = useDate(); // Get selected date from dateContext
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to add a new task
  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now(),
      text: `✅ ${text}`,
      completed: false,
      date: selectedDate.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task
  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

/* eslint-disable react-hooks/exhaustive-deps */
// tasksContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useDate } from './dateContext';
import { useAuth } from './authContext';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // Store date as 'YYYY-MM-DD'
}

interface TasksContextType {
  tasks: Task[];
  addTask: (text: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedDate } = useDate(); // Get selected date from dateContext
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const selectedDateString = selectedDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  // Fetch tasks when the selected date changes or on initial render
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [selectedDate, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks?date=${selectedDateString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(
          data.tasks.map((task: any) => ({
            id: task._id,
            text: task.text,
            completed: task.completed,
            date: task.date,
          }))
        );
      } else {
        console.error('Failed to fetch tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to add a new task
  const addTask = async (text: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'add',
          task: {
            text,
            date: selectedDateString,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((prevTasks) => [
          ...prevTasks,
          {
            id: data.task._id,
            text: data.task.text,
            completed: data.task.completed,
            date: data.task.date,
          },
        ]);
      } else {
        console.error('Failed to add task:', data.error);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'update',
          task: {
            id,
            completed: !task.completed,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      } else {
        console.error('Failed to update task:', data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'delete',
          task: {
            id,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        console.error('Failed to delete task:', data.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}
    >
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

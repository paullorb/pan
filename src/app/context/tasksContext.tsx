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
  loading?: boolean; // Optional loading flag
}

interface TasksContextType {
  tasks: Task[];
  tasksByDate: { [date: string]: Task[] };
  loading: boolean;
  addTask: (text: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedDate } = useDate(); // Get selected date from dateContext
  const { isAuthenticated, token, isLoading, logout } = useAuth();
  const [tasksByDate, setTasksByDate] = useState<{ [date: string]: Task[] }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const selectedDateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

  // Fetch tasks when the selected date changes or on initial render
  useEffect(() => {
    if (isLoading) return; // Wait until authentication state is initialized

    if (isAuthenticated && selectedDate) {
      fetchTasks();
    } else {
      setTasksByDate({});
    }
  }, [isAuthenticated, isLoading, selectedDate, token, logout]);

  const fetchTasks = async () => {
    if (!selectedDate) return; // Ensure selectedDate is available

    setLoading(true);
    try {
      const month = selectedDate.getMonth() + 1; // Months are zero-based in JavaScript
      const year = selectedDate.getFullYear();

      const response = await fetch(`/api/tasks?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Group tasks by date
        const tasksByDateData = data.tasks.reduce((acc: any, task: any) => {
          const date = task.date; // 'YYYY-MM-DD'
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            id: task._id,
            text: task.text,
            completed: task.completed,
            date: task.date,
          });
          return acc;
        }, {});

        setTasksByDate(tasksByDateData);
      } else if (response.status === 401) {
        console.error('Unauthorized access. Logging out.');
        logout();
      } else {
        console.error('Failed to fetch tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new task
  const addTask = async (text: string) => {
    // Generate a temporary ID
    const tempId = 'temp-' + Date.now();

    // Create a temporary task object
    const tempTask: Task = {
      id: tempId,
      text,
      completed: false,
      date: selectedDateString,
      loading: true,
    };

    // Optimistically update tasksByDate
    setTasksByDate((prev) => {
      const updated = { ...prev };
      if (!updated[selectedDateString]) {
        updated[selectedDateString] = [];
      }
      updated[selectedDateString] = [...updated[selectedDateString], tempTask];
      return updated;
    });

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
        // Replace the temporary task with the real task
        setTasksByDate((prev) => {
          const updated = { ...prev };
          updated[selectedDateString] = updated[selectedDateString].map((task) =>
            task.id === tempId
              ? { ...task, id: data.task._id, loading: false }
              : task
          );
          return updated;
        });
      } else {
        // Remove the temporary task on failure
        setTasksByDate((prev) => {
          const updated = { ...prev };
          updated[selectedDateString] = updated[selectedDateString].filter(
            (task) => task.id !== tempId
          );
          return updated;
        });
        console.error('Failed to add task:', data.error);
      }
    } catch (error) {
      // Remove the temporary task on error
      setTasksByDate((prev) => {
        const updated = { ...prev };
        updated[selectedDateString] = updated[selectedDateString].filter(
          (task) => task.id !== tempId
        );
        return updated;
      });
      console.error('Error adding task:', error);
    }
  };


  // Function to toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const taskDate = selectedDateString;
    const tasksForDate = tasksByDate[taskDate] || [];
    const task = tasksForDate.find((t) => t.id === id);
    if (!task) return;

    // Optimistically update
    setTasksByDate((prev) => {
      const updated = { ...prev };
      updated[taskDate] = tasksForDate.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      return updated;
    });

    try {
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

      if (!response.ok) {
        // Revert optimistic update on failure
        setTasksByDate((prev) => {
          const updated = { ...prev };
          updated[taskDate] = tasksForDate;
          return updated;
        });
        const data = await response.json();
        console.error('Failed to update task:', data.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setTasksByDate((prev) => {
        const updated = { ...prev };
        updated[taskDate] = tasksForDate;
        return updated;
      });
      console.error('Error updating task:', error);
    }
  };


  // Function to delete a task
  const deleteTask = async (id: string) => {
    const taskDate = selectedDateString;
    const tasksForDate = tasksByDate[taskDate] || [];
    const taskExists = tasksForDate.some((t) => t.id === id);
    if (!taskExists) return;

    // Optimistically remove the task
    setTasksByDate((prev) => {
      const updated = { ...prev };
      updated[taskDate] = tasksForDate.filter((task) => task.id !== id);
      return updated;
    });

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

      if (!response.ok) {
        // Revert optimistic removal on failure
        setTasksByDate((prev) => {
          const updated = { ...prev };
          updated[taskDate] = tasksForDate;
          return updated;
        });
        const data = await response.json();
        console.error('Failed to delete task:', data.error);
      }
    } catch (error) {
      // Revert optimistic removal on error
      setTasksByDate((prev) => {
        const updated = { ...prev };
        updated[taskDate] = tasksForDate;
        return updated;
      });
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: tasksByDate[selectedDateString] || [],
        tasksByDate,
        loading,
        addTask,
        toggleTaskCompletion,
        deleteTask,
      }}
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
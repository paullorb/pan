// hoursContext.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

interface HourActivity {
  [key: string]: string;
}

interface HoursContextType {
  activities: HourActivity;
  from: number;
  until: number;
  loading: boolean; // Add loading state
  handleActivityChange: (hourKey: string, value: string) => void;
  setFrom: (from: number) => void;
  setUntil: (until: number) => void;
}

const HoursContext = createContext<HoursContextType | undefined>(undefined);

export const useHours = () => {
  const context = useContext(HoursContext);
  if (!context) {
    throw new Error('useHours must be used within a HoursProvider');
  }
  return context;
};

interface HoursProviderProps {
  children: ReactNode;
}

export const HoursProvider: React.FC<HoursProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { selectedDate } = useDate(); // Get selectedDate from DateContext
  const [activities, setActivities] = useState<HourActivity>({});
  const [from, setFrom] = useState<number>(5); // Default starting hour
  const [until, setUntil] = useState<number>(23); // Default ending hour
  const [loading, setLoading] = useState<boolean>(false); // Initialize loading state

  // Fetch activities when selectedDate or isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      const fetchActivities = async () => {
        setLoading(true); // Start loading
        try {
          // Fetch activities for the current date
          const response = await fetch(`/api/activities?date=${selectedDate.toDateString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (Object.keys(data.activities).length === 0) {
              // No activities for today, fetch activities for the previous day
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);

              const prevResponse = await fetch(`/api/activities?date=${prevDate.toDateString()}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });

              if (prevResponse.ok) {
                const prevData = await prevResponse.json();

                if (Object.keys(prevData.activities).length > 0) {
                  // Copy activities from the previous day
                  const newActivities: HourActivity = {};

                  for (const key in prevData.activities) {
                    // Extract the time part from the key
                    const timePart = key.substring(key.indexOf('_') + 1);
                    // Create a new key for today's date
                    const newKey = `${selectedDate.toDateString()}_${timePart}`;
                    newActivities[newKey] = prevData.activities[key];
                  }

                  setActivities(newActivities);
                } else {
                  setActivities({});
                }
              } else {
                console.error('Failed to fetch previous day activities');
                setActivities({});
              }
            } else {
              // Activities exist for today
              setActivities(data.activities);
            }
          } else {
            console.error('Failed to fetch activities');
            setActivities({});
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
          setActivities({});
        } finally {
          setLoading(false); // End loading
        }
      };
      fetchActivities();
    } else {
      setActivities({});
    }
  }, [selectedDate, isAuthenticated]);

  // Save activities when they change
  useEffect(() => {
    if (isAuthenticated) {
      const saveActivities = async () => {
        try {
          await fetch('/api/activities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              date: selectedDate.toDateString(),
              activities,
            }),
          });
        } catch (error) {
          console.error('Error saving activities:', error);
        }
      };
      saveActivities();
    }
  }, [activities, isAuthenticated, selectedDate]);

  const handleActivityChange = (hourKey: string, value: string): void => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [hourKey]: value,
    }));
  };

  return (
    <HoursContext.Provider value={{ activities, from, until, loading, handleActivityChange, setFrom, setUntil }}>
      {children}
    </HoursContext.Provider>
  );
};

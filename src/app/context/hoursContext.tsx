// /context/hoursContext.tsx
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
  loading: boolean;
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
  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const { selectedDate } = useDate();
  const [activities, setActivities] = useState<HourActivity>({});
  const [from, setFrom] = useState<number>(5);
  const [until, setUntil] = useState<number>(23);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch activities when selectedDate or isAuthenticated changes
  useEffect(() => {
    if (isLoading) return; // Wait until authentication state is initialized

    if (isAuthenticated) {
      const fetchActivities = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/activities?date=${selectedDate.toDateString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
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
                  Authorization: `Bearer ${token}`,
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
              } else if (prevResponse.status === 401) {
                console.error('Unauthorized access. Logging out.');
                logout();
              } else {
                console.error('Failed to fetch previous day activities');
                setActivities({});
              }
            } else {
              // Activities exist for today
              setActivities(data.activities);
            }
          } else if (response.status === 401) {
            console.error('Unauthorized access. Logging out.');
            logout();
          } else {
            console.error('Failed to fetch activities');
            setActivities({});
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
          setActivities({});
        } finally {
          setLoading(false);
        }
      };
      fetchActivities();
    } else {
      setActivities({});
    }
  }, [selectedDate, isAuthenticated, isLoading, token, logout]);

  // Save activities when they change
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const saveActivities = async () => {
        try {
          await fetch('/api/activities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
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
  }, [activities, isAuthenticated, selectedDate, loading, token]);

  const handleActivityChange = (hourKey: string, value: string): void => {
    setActivities((prevActivities) => ({
      ...prevActivities,
      [hourKey]: value,
    }));
  };

  return (
    <HoursContext.Provider
      value={{ activities, from, until, loading, handleActivityChange, setFrom, setUntil }}
    >
      {children}
    </HoursContext.Provider>
  );
};

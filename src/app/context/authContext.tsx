// /context/authContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // New state
  userEmail: string | null;
  token: string | null; // Expose the token if needed
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize as loading

  // Separate auto-login logic
  useEffect(() => {
    const autoLogin = async () => {
      const storedToken = localStorage.getItem('token');
      const storedEmail = localStorage.getItem('userEmail');

      if (storedToken) {
        // Optionally, verify the token with the server here
        setToken(storedToken);
        setIsAuthenticated(true);
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      }
      setIsLoading(false); // Authentication check is complete
    };

    autoLogin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in state and localStorage
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);

        setIsAuthenticated(true);
        setUserEmail(email);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in state and localStorage
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);

        setIsAuthenticated(true);
        setUserEmail(email);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
    }
  };

  const logout = () => {
    // Clear authentication state and localStorage
    setToken(null);
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userEmail, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

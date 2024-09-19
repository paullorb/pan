"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Clear localStorage on app start (use with caution)
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }, []);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/validateToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        // Token is invalid or expired
        return false;
      } else {
        // Handle other server errors
        console.error('Server error during token validation');
        return false;
      }
    } catch (error) {
      console.error('Network error during token validation:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (token && email) {
        const isValid = await validateToken(token);
        if (isValid) {
          setIsAuthenticated(true);
          setUserEmail(email);
        } else {
          // Token is invalid or expired, log the user out
          logout();
        }
      } else {
        // No token found, ensure the user is logged out
        logout();
      }
    };

    initializeAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear any existing tokens
        localStorage.removeItem('token');
        localStorage.removeItem('email');

        // Store the new token and email
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and email
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
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
    // Remove the token and email from storage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, signup }}>
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

// src/context/authContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Function to validate token with the server
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

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/refreshToken', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.accessToken;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          setAccessToken(newAccessToken);
          return true;
        }
      } else {
        console.error('Failed to refresh access token');
      }
      return false;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const email = localStorage.getItem('email');

      if (token && email) {
        let isValid = await validateToken(token);
        if (!isValid) {
          // Try to refresh the access token
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            const newToken = localStorage.getItem('accessToken');
            isValid = await validateToken(newToken!);
          }
        }

        if (isValid) {
          setIsAuthenticated(true);
          setUserEmail(email);
          setAccessToken(token);
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
        credentials: 'include', // Include cookies (refresh token)
      });

      const data = await response.json();

      if (response.ok) {
        // Clear any existing tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');

        // Store the new access token and email
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('email', email);
        setIsAuthenticated(true);
        setUserEmail(email);
        setAccessToken(data.accessToken);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  const signup = async (email: string, password: string) => {
    // Implement similar to login, ensuring accessToken and refreshToken are handled
  };

  const logout = () => {
    // Remove the access token and email from storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setUserEmail(null);
    setAccessToken(null);

    // Optionally, clear the refresh token cookie by expiring it
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, accessToken, login, logout, signup }}>
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

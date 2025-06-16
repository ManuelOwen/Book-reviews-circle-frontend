import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

const API_URL = 'http://localhost:3000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Move useAuth hook outside of the file to fix Fast Refresh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle API requests with automatic token refresh
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // This enables sending cookies
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (refreshResponse.ok) {
          // Retry the original request with new token
          return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              ...options.headers,
              'Content-Type': 'application/json',
            },
          });
        } else {
          // Refresh failed, user needs to login again
          setUser(null);
          throw new Error('Session expired. Please login again.');
        }
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  // Get current user from token
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await apiRequest(`${API_URL}/auth/me`);

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const { user } = await response.json();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      return null;
    }
  };

  // Sign up a new user
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await apiRequest(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginResponse = await signIn(email, password);
      if (loginResponse.error) {
        return loginResponse;
      }

      toast.success('Account created successfully!');
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: errorMessage };
    }
  };

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const errorMessage = data.errors
            .map((err: { field: string; message: string }) => `${err.field}: ${err.message}`)
            .join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Set the token in the Authorization header for future requests
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${data.token}`);
      }

      setUser(data.user);
      toast.success('Welcome back!');
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: errorMessage };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      await apiRequest(`${API_URL}/auth/logout`, {
        method: 'POST',
      });
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear the local state
      setUser(null);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

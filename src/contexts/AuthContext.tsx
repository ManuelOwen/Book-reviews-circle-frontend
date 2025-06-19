import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "../types";

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the hook separately to fix HMR
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on mount
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://backend-bookcircle-klee.onrender.com";

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Helper function for API requests
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  // Get current user from token
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const response = await apiRequest(`${API_URL}/auth/me`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh the token
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                localStorage.setItem("token", refreshData.token);
                if (refreshData.refreshToken) {
                  localStorage.setItem(
                    "refreshToken",
                    refreshData.refreshToken
                  );
                }
                // Retry the getCurrentUser request with new token
                return getCurrentUser();
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
            }
          }
          // If refresh failed or no refresh token, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
          return null;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success || !data.user) {
        throw new Error("Invalid user data received");
      }

      // Update user state and persist to localStorage
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  // Sign up a new user
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await apiRequest(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const errorMessage = data.errors
            .map(
              (err: { field: string; message: string }) =>
                `${err.field}: ${err.message}`
            )
            .join(", ");
          throw new Error(errorMessage);
        }
        throw new Error(data.message || "Registration failed");
      }

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      if (!data.token) {
        throw new Error("No authentication token received");
      }

      // Store tokens in localStorage
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Update user state
      setUser(data.user);

      toast.success("Account created successfully!");
      return {};
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessage = data.errors
            .map(
              (err: { field: string; message: string }) =>
                `${err.field}: ${err.message}`
            )
            .join(", ");
          throw new Error(errorMessage);
        }
        throw new Error(data.message || "Login failed");
      }

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Check for token in the response body
      if (!data.token) {
        throw new Error("No authentication token received");
      }

      if (!data.user) {
        throw new Error("No user data received");
      }

      // Store tokens in localStorage
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Update user state
      setUser(data.user);

      toast.success("Welcome back!");
      return {};
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      await apiRequest(`${API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Successfully logged out");
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // getCurrentUser already handles 401 and token clearing if refresh fails
          await getCurrentUser();
        }
      } catch (error) {
        // Only log the error, do not clear localStorage here.
        // getCurrentUser or signIn/signUp will handle clearing on explicit auth failures (401).
        console.error("Error during AuthProvider initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  const token = localStorage.getItem("token");
  const value = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

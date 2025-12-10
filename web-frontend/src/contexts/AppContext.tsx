"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";

interface AppContextType {
  // Add your app-wide state here
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize state from localStorage using lazy initialization
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          return null;
        }
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("cookies");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AppContextType = {
    isAuthenticated,
    user,
    setUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

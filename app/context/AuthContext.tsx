"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void; 
  logout: () => Promise<void>;   
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We still store the user PROFILE in localStorage for UI purposes (name, image)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 1. Tell the backend to clear the HttpOnly cookie
      await fetch('http://localhost:3000/api/v1/customers/logout', { 
        method: 'POST',
        credentials: 'include' // Crucial: tells browser to send the cookie to be cleared
      });
    } catch (error) {
      console.error("Logout failed to notify server", error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
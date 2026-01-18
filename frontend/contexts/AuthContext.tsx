"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  companyId?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'admin' | 'client' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: 'admin' | 'client') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'admin' | 'client' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = api.getToken();
    if (!token) {
      setUser(null);
      setUserType(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.getMe();
      if (response.success && response.data) {
        // The API returns user data directly with type at same level
        const data = response.data as Record<string, unknown>;
        const type = data.type as 'admin' | 'client';
        setUser({
          id: data.id as string,
          email: data.email as string,
          name: data.name as string,
          role: data.role as string | undefined,
          companyId: data.company_id as string | undefined,
          companyName: data.company_name as string | undefined,
        });
        setUserType(type);
      } else {
        setUser(null);
        setUserType(null);
        api.setToken(null);
      }
    } catch {
      setUser(null);
      setUserType(null);
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string, type: 'admin' | 'client') => {
    setIsLoading(true);
    try {
      const response = type === 'admin'
        ? await api.adminLogin(email, password)
        : await api.clientLogin(email, password);

      if (response.success) {
        await refreshUser();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

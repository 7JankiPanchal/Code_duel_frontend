import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';
import { currentUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, leetcodeUsername: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(currentUser);
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, leetcodeUsername: string) => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ ...currentUser, name, email, leetcodeUsername });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
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

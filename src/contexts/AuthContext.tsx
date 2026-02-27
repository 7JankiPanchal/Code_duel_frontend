import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    leetcodeUsername: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // ✅ MOCK LOGIN (no backend)
  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);

    try {
      // accept anything
      const mockUser: User = {
        id: "1",
        name: emailOrUsername,
        email: emailOrUsername.includes("@") ? emailOrUsername : `${emailOrUsername}@demo.com`,
        leetcodeUsername: emailOrUsername,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailOrUsername}`,
      };

      localStorage.setItem('auth_token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch {
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ MOCK REGISTER
  const register = async (
    username: string,
    email: string,
    password: string,
    leetcodeUsername: string
  ) => {
    setIsLoading(true);

    try {
      const mockUser: User = {
        id: "1",
        name: username,
        email,
        leetcodeUsername,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      localStorage.setItem('auth_token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch {
      return { success: false, message: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
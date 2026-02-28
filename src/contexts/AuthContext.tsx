// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api'; // Assume this is your backend API wrapper

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

/**
 * Map backend API user response to frontend User type
 */
const mapApiUserToUser = (userData: any): User => ({
  id: userData.id,
  name: userData.username,
  email: userData.email,
  leetcodeUsername: userData.leetcodeUsername,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage or validate token with backend
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Optionally: call backend to validate token
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            const mappedUser = mapApiUserToUser(response.data);
            localStorage.setItem('user', JSON.stringify(mappedUser));
            setUser(mappedUser);
          } else {
            logout();
          }
        } catch (error: any) {
          // Fallback: restore user from localStorage
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            logout();
          }
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    try {
      // Backend call
      const response = await authApi.login(emailOrUsername, password);

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        const mappedUser = mapApiUserToUser(userData);

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        setUser(mappedUser);

        return { success: true };
      }

      // Mock fallback for dev if backend unavailable
      if (!response.success) throw new Error(response.message || 'Login failed');
    } catch (err: any) {
      // Mock login fallback
      if (err.message === 'Network Error') {
        const mockUser: User = {
          id: 'mock-id',
          name: emailOrUsername,
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@example.com`,
          leetcodeUsername: emailOrUsername,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailOrUsername}`,
        };
        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      }

      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, leetcodeUsername: string) => {
    setIsLoading(true);
    try {
      // Backend call
      const response = await authApi.register(username, email, password, leetcodeUsername);

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        const mappedUser = mapApiUserToUser(userData);

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        setUser(mappedUser);

        return { success: true };
      }

      throw new Error(response.message || 'Registration failed');
    } catch (err: any) {
      // Mock fallback for dev
      if (err.message === 'Network Error') {
        const mockUser: User = {
          id: 'mock-id',
          name: username,
          email,
          leetcodeUsername,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        };
        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      }

      return { success: false, message: err.message || 'Registration failed' };
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
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}
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
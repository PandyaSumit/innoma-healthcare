import React, { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_USERS } from '../data/dummyUsers';
import type { User, UserRole } from '../data/dummyUsers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('innoma_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('innoma_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check patient credentials
    if (
      email === DUMMY_USERS.patient.email &&
      password === DUMMY_USERS.patient.password
    ) {
      const userData: User = {
        email: DUMMY_USERS.patient.email,
        role: DUMMY_USERS.patient.role as UserRole,
        profile: DUMMY_USERS.patient.profile,
      };
      setUser(userData);
      localStorage.setItem('innoma_user', JSON.stringify(userData));
      return { success: true };
    }

    // Check therapist credentials
    if (
      email === DUMMY_USERS.therapist.email &&
      password === DUMMY_USERS.therapist.password
    ) {
      const userData: User = {
        email: DUMMY_USERS.therapist.email,
        role: DUMMY_USERS.therapist.role as UserRole,
        profile: DUMMY_USERS.therapist.profile,
      };
      setUser(userData);
      localStorage.setItem('innoma_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('innoma_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
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

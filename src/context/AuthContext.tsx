import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { clearTokens } from '../services/api';
import type { RegisterPayload } from '../services/authService';

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'therapist';

export interface User {
  email: string;
  role: UserRole;
  profile: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build a User object from a login response */
function userFromLoginData(data: any): User {
  return {
    email: data.user.email,
    role: data.user.role as UserRole,
    profile: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatar ?? undefined,
    },
  };
}

/** Build a User object from a register response (name comes from the form) */
function userFromRegisterData(data: any, fullName: string): User {
  return {
    email: data.email,
    role: (data.role ?? 'patient') as UserRole,
    profile: {
      id: data.userId,
      name: fullName,
      email: data.email,
    },
  };
}

function persistUser(user: User) {
  localStorage.setItem('innoma_user', JSON.stringify(user));
}

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem('innoma_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('innoma_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await authService.login({ email, password, rememberMe });
      const userData = userFromLoginData(data);
      setUser(userData);
      persistUser(userData);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message ?? 'Login failed. Please try again.',
      };
    }
  };

  const register = async (
    payload: RegisterPayload,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await authService.register(payload);
      const userData = userFromRegisterData(data, payload.fullName);
      setUser(userData);
      persistUser(userData);
      return { success: true };
    } catch (err: any) {
      if (err.status === 409) {
        return {
          success: false,
          error: 'An account with this email already exists.',
        };
      }
      return {
        success: false,
        error: err.message ?? 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    // Fire-and-forget — invalidates the token on the server
    authService.logout().catch(() => {});
    setUser(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

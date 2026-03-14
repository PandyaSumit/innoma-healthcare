import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setLoggingOut } from "../api/axios";
import type { AuthUser, RegisterPayload } from "../types/auth";

// ── Context type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(
    email: string,
    password: string,
    rememberMe?: boolean,
  ): Promise<{ success: boolean; error?: string; role?: string }>;
  register(
    payload: RegisterPayload,
  ): Promise<{ success: boolean; error?: string; userId?: string; email?: string; role?: string }>;
  logout(): Promise<void>;
  refreshAccessToken(): Promise<string>;
  updateUser(updatedUser: AuthUser): void;
}

function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        clearAuthStorage();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      const { accessToken, refreshToken, user: u } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const authUser: AuthUser = {
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name,
        avatar: u.avatar ?? null,
      };
      localStorage.setItem("authUser", JSON.stringify(authUser));
      setUser(authUser);
      return { success: true, role: u.role as string };
    } catch (err: any) {
      return {
        success: false,
        error: err.message ?? "Login failed. Please try again.",
      };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      const { userId, email, role } = data.data;
      return { success: true, userId, email, role };
    } catch (err: any) {
      if (err.status === 409)
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      return {
        success: false,
        error: err.message ?? "Registration failed. Please try again.",
      };
    }
  };

  const loginAfterOtp = (u: { id: string; email: string; role: string; name: string; avatar?: string }, accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const authUser: AuthUser = {
      id: u.id,
      email: u.email,
      role: u.role,
      name: u.name,
      avatar: u.avatar ?? null,
    };
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = async (): Promise<void> => {
    setLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken)
        await api.post("/auth/logout", { refreshToken }).catch(() => {});
    } finally {
      setUser(null);
      clearAuthStorage();
      setLoggingOut(false);
    }
  };

  const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");
    const { data } = await api.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefresh } = data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefresh);
    return accessToken;
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAfterOtp,
        logout,
        refreshAccessToken,
        updateUser,
      } as any}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

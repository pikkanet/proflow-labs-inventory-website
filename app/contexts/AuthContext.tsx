"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "../shared/services/axiosInstance";
import { ILoginRequest, ILoginResponse } from "../login/types/login";
import { clearAuthData, isValidToken } from "../shared/utils/auth";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: ILoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    // Validate token
    if (storedToken && storedUser) {
      try {
        if (isValidToken(storedToken)) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          clearAuthData();
          setToken(null);
          setUser(null);
        }
      } catch {
        clearAuthData();
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [router]);

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === "/login";
      const isAuthenticated = !!token;

      if (!isAuthenticated && !isLoginPage) {
        router.push("/login");
      } else if (isAuthenticated && isLoginPage) {
        router.push("/inventory");
      }
    }
  }, [loading, token, pathname, router]);

  const login = useCallback(
    async (data: ILoginRequest) => {
      try {
        const response = await axiosInstance.post<ILoginResponse>(
          "/auth/login",
          data
        );

        const { data: responseData, status } = response;

        if (status !== 200) {
          const errorMessage = responseData?.message || "Login failed";

          throw new Error(errorMessage);
        }

        // Store token
        const accessToken = responseData?.access_token;
        setToken(accessToken);
        localStorage.setItem("access_token", accessToken);
        document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

        // TODO: Recheck after integrate
        // Store user Info
        const tokenParts = accessToken.split(".");
        if (tokenParts.length >= 2) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const userData: User = payload;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        router.push("/inventory");
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuthData();
    router.push("/login");
  }, [router]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      loading,
    }),
    [user, token, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "../services/auth.api";
import type { User } from "../services/auth.api";

interface AuthState {
  token: string | null;
  user: User | null;
  mustChangeCredentials: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem("token"),
    user: null,
    mustChangeCredentials: false,
    isLoading: true,
  });

useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .getMe()
        .then((user) => setState((prev) => ({ ...prev, user, isLoading: false })))
        .catch(() => {
          localStorage.removeItem("token");
          setState({ token: null, user: null, mustChangeCredentials: false, isLoading: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, mustChangeCredentials } = await authApi.login({ email, password });
    localStorage.setItem("token", token);
    const user = await authApi.getMe();
    setState({ token, user, mustChangeCredentials, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ token: null, user: null, mustChangeCredentials: false, isLoading: false });
  };

  const refreshUser = async () => {
    const user = await authApi.getMe();
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
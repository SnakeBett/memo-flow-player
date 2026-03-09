import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authLib from "@/lib/auth";
import type { User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(authLib.getCachedUser);
  const [token, setToken] = useState<string | null>(authLib.getCachedToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authLib.getSession().then((session) => {
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authLib.signIn(email, password);
    if (result.error) return result.error;
    if (result.user) {
      setUser(result.user);
      setToken(result.token || result.user.id);
    }
    return null;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    const result = await authLib.signUp(name, email, password);
    if (result.error) return result.error;
    if (result.user) {
      setUser(result.user);
      setToken(result.token || result.user.id);
    }
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await authLib.signOut();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

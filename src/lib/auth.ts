const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL as string;

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user?: User;
  token?: string;
  error?: string;
}

function getStoredToken(): string | null {
  return localStorage.getItem("proto10x-token");
}

function getStoredUser(): User | null {
  try {
    const s = localStorage.getItem("proto10x-user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function storeSession(user: User, token: string) {
  localStorage.setItem("proto10x-token", token);
  localStorage.setItem("proto10x-user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("proto10x-token");
  localStorage.removeItem("proto10x-user");
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || data.error) return { error: data.message || data.error || "Erro ao criar conta" };
    if (data.user && data.token) {
      storeSession(data.user, data.token);
      return { user: data.user, token: data.token };
    }
    if (data.user) {
      storeSession(data.user, data.user.id);
      return { user: data.user, token: data.user.id };
    }
    return { error: "Resposta inesperada do servidor" };
  } catch (e: any) {
    return { error: e.message || "Erro de conexão" };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${AUTH_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || data.error) return { error: data.message || data.error || "Email ou senha incorretos" };
    if (data.user && data.token) {
      storeSession(data.user, data.token);
      return { user: data.user, token: data.token };
    }
    if (data.user) {
      storeSession(data.user, data.user.id);
      return { user: data.user, token: data.user.id };
    }
    return { error: "Resposta inesperada" };
  } catch (e: any) {
    return { error: e.message || "Erro de conexão" };
  }
}

export async function signOut() {
  try {
    await fetch(`${AUTH_URL}/api/auth/sign-out`, { method: "POST", credentials: "include" });
  } catch { /* ignore */ }
  clearSession();
}

export async function getSession(): Promise<{ user: User; token: string } | null> {
  const storedUser = getStoredUser();
  const storedToken = getStoredToken();
  if (storedUser && storedToken) {
    return { user: storedUser, token: storedToken };
  }

  try {
    const res = await fetch(`${AUTH_URL}/api/auth/get-session`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.user) {
      const token = data.session?.token || data.user.id;
      storeSession(data.user, token);
      return { user: data.user, token };
    }
  } catch { /* offline */ }
  return null;
}

export function getCachedUser(): User | null {
  return getStoredUser();
}

export function getCachedToken(): string | null {
  return getStoredToken();
}

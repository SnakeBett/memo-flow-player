import { getCachedToken } from "./auth";

const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getCachedToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Settings
export const fetchSettings = () => request<{ volume: number; last_track_id: string | null }>("/settings");
export const updateSettings = (data: { volume?: number; last_track_id?: string }) =>
  request("/settings", { method: "PUT", body: JSON.stringify(data) });

// Favorites
export const fetchFavorites = () => request<string[]>("/favorites");
export const addFavorite = (trackId: string) =>
  request("/favorites", { method: "POST", body: JSON.stringify({ track_id: trackId }) });
export const removeFavorite = (trackId: string) =>
  request(`/favorites/${trackId}`, { method: "DELETE" });

// Completed
export const fetchCompleted = () => request<string[]>("/completed");
export const markCompleted = (trackId: string) =>
  request("/completed", { method: "POST", body: JSON.stringify({ track_id: trackId }) });

// History
export const fetchHistory = () => request<{ trackId: string; timestamp: number }[]>("/history");
export const addHistory = (trackId: string) =>
  request("/history", { method: "POST", body: JSON.stringify({ track_id: trackId }) });

// Streaks
export const fetchStreaks = () => request<{
  currentStreak: number; longestStreak: number;
  lastStudyDate: string | null; totalDays: number; studyDates: string[];
}>("/streaks");
export const updateStreaks = (data: {
  currentStreak: number; longestStreak: number;
  lastStudyDate: string; totalDays: number; studyDates: string[];
}) => request("/streaks", { method: "PUT", body: JSON.stringify(data) });

// Reset
export const resetAllData = () => request("/reset", { method: "DELETE" });

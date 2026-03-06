import { useState, useCallback, useEffect } from "react";
import { tracks, type Track } from "@/data/audioData";

export interface HistoryEntry {
  trackId: string;
  timestamp: number;
}

const STORAGE_KEY = "proto10x-history";
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function useListeningHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((trackId: string) => {
    setHistory((prev) => {
      const entry: HistoryEntry = { trackId, timestamp: Date.now() };
      return [entry, ...prev].slice(0, MAX_ENTRIES);
    });
  }, []);

  const getHistoryWithTracks = useCallback(() => {
    return history
      .map((entry) => {
        const track = tracks.find((t) => t.id === entry.trackId);
        return track ? { ...entry, track } : null;
      })
      .filter(Boolean) as (HistoryEntry & { track: Track })[];
  }, [history]);

  return { history, addEntry, getHistoryWithTracks };
}

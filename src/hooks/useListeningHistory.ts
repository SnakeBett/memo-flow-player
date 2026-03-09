import { useState, useCallback, useEffect, useRef } from "react";
import { tracks, type Track } from "@/data/audioData";
import * as api from "@/lib/api";
import { getCachedToken } from "@/lib/auth";

export interface HistoryEntry {
  trackId: string;
  timestamp: number;
}

const STORAGE_KEY = "proto10x-history";
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function useListeningHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const syncedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (getCachedToken() && !syncedRef.current) {
      syncedRef.current = true;
      api.fetchHistory().then((dbHistory) => {
        if (dbHistory.length > 0) setHistory(dbHistory);
      }).catch(() => {});
    }
  }, []);

  const addEntry = useCallback((trackId: string) => {
    if (getCachedToken()) api.addHistory(trackId).catch(() => {});
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

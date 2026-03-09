import { useState, useCallback, useEffect, useRef } from "react";
import { tracks } from "@/data/audioData";
import * as api from "@/lib/api";
import { getCachedToken } from "@/lib/auth";

interface ProgressData {
  completedTracks: string[];
}

const STORAGE_KEY = "proto10x-progress";

function loadProgress(): ProgressData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { completedTracks: [] };
  } catch { return { completedTracks: [] }; }
}

export function useListeningProgress() {
  const [data, setData] = useState<ProgressData>(loadProgress);
  const syncedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (getCachedToken() && !syncedRef.current) {
      syncedRef.current = true;
      api.fetchCompleted().then((dbCompleted) => {
        if (dbCompleted.length > 0) {
          setData((prev) => {
            const merged = Array.from(new Set([...prev.completedTracks, ...dbCompleted]));
            return { completedTracks: merged };
          });
        }
      }).catch(() => {});
    }
  }, []);

  const markCompleted = useCallback((trackId: string) => {
    setData((prev) => {
      if (prev.completedTracks.includes(trackId)) return prev;
      if (getCachedToken()) api.markCompleted(trackId).catch(() => {});
      return { completedTracks: [...prev.completedTracks, trackId] };
    });
  }, []);

  const isCompleted = useCallback(
    (trackId: string) => data.completedTracks.includes(trackId),
    [data.completedTracks]
  );

  const getDisciplineProgress = useCallback(
    (discipline: string) => {
      const disciplineTracks = tracks.filter((t) => t.discipline === discipline);
      const completed = disciplineTracks.filter((t) => data.completedTracks.includes(t.id)).length;
      return { completed, total: disciplineTracks.length };
    },
    [data.completedTracks]
  );

  return { markCompleted, isCompleted, getDisciplineProgress, completedTracks: data.completedTracks };
}

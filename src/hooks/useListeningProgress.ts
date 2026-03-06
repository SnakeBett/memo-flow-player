import { useState, useCallback, useEffect } from "react";
import { tracks } from "@/data/audioData";

interface ProgressData {
  completedTracks: string[];
}

const STORAGE_KEY = "proto10x-progress";

function loadProgress(): ProgressData {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { completedTracks: [] };
}

export function useListeningProgress() {
  const [data, setData] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const markCompleted = useCallback((trackId: string) => {
    setData((prev) => {
      if (prev.completedTracks.includes(trackId)) return prev;
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
      const completed = disciplineTracks.filter((t) =>
        data.completedTracks.includes(t.id)
      ).length;
      return { completed, total: disciplineTracks.length };
    },
    [data.completedTracks]
  );

  return { markCompleted, isCompleted, getDisciplineProgress, completedTracks: data.completedTracks };
}

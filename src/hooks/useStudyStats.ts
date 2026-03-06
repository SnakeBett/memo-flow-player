import { useMemo } from "react";
import { tracks } from "@/data/audioData";
import type { HistoryEntry } from "@/hooks/useListeningHistory";

export function useStudyStats(history: HistoryEntry[], completedTracks: string[]) {
  return useMemo(() => {
    // Total minutes listened (estimate: each play = track duration)
    let totalSeconds = 0;
    const disciplineCount: Record<string, number> = {};
    const uniqueTrackIds = new Set<string>();

    history.forEach((entry) => {
      const track = tracks.find((t) => t.id === entry.trackId);
      if (track) {
        totalSeconds += track.duration;
        disciplineCount[track.discipline] = (disciplineCount[track.discipline] || 0) + 1;
        uniqueTrackIds.add(track.id);
      }
    });

    // Daily average
    const dates = new Set(history.map((e) => new Date(e.timestamp).toISOString().split("T")[0]));
    const daysStudied = Math.max(dates.size, 1);
    const avgMinutesPerDay = Math.round(totalSeconds / 60 / daysStudied);

    // Top discipline
    const topDiscipline = Object.entries(disciplineCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      totalMinutes: Math.round(totalSeconds / 60),
      avgMinutesPerDay,
      topDiscipline,
      uniqueTracks: uniqueTrackIds.size,
      daysStudied,
    };
  }, [history, completedTracks]);
}

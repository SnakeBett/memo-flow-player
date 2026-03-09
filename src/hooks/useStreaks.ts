import { useState, useEffect, useCallback, useRef } from "react";
import * as api from "@/lib/api";
import { getCachedToken } from "@/lib/auth";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalDays: number;
  studyDates: string[];
}

const STORAGE_KEY = "proto10x-streaks";

function getToday(): string {
  return new Date().toLocaleDateString("sv-SE");
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("sv-SE");
}

function loadStreakData(): StreakData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data: StreakData = JSON.parse(saved);
      const today = getToday();
      const yesterday = getYesterday();
      if (data.lastStudyDate !== today && data.lastStudyDate !== yesterday) {
        return { ...data, currentStreak: 0 };
      }
      return data;
    }
  } catch { /* corrupted */ }
  return { currentStreak: 0, longestStreak: 0, lastStudyDate: null, totalDays: 0, studyDates: [] };
}

export function useStreaks() {
  const [data, setData] = useState<StreakData>(loadStreakData);
  const syncedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (getCachedToken() && !syncedRef.current) {
      syncedRef.current = true;
      api.fetchStreaks().then((dbStreaks) => {
        if (dbStreaks.totalDays > 0) {
          setData(dbStreaks);
        }
      }).catch(() => {});
    }
  }, []);

  const recordStudySession = useCallback(() => {
    setData((prev) => {
      const today = getToday();
      if (prev.lastStudyDate === today) return prev;

      const yesterday = getYesterday();
      const newStreak = prev.lastStudyDate === yesterday ? prev.currentStreak + 1 : 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newDates = prev.studyDates.includes(today) ? prev.studyDates : [...prev.studyDates, today];

      const updated = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastStudyDate: today,
        totalDays: newDates.length,
        studyDates: newDates.slice(-90),
      };

      if (getCachedToken()) {
        api.updateStreaks(updated).catch(() => {});
      }

      return updated;
    });
  }, []);

  const hasStudiedToday = data.lastStudyDate === getToday();

  return { ...data, recordStudySession, hasStudiedToday };
}

export type BadgeIconName = "sprout" | "flame" | "zap" | "gem" | "trophy" | "book" | "rocket" | "crown";

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: BadgeIconName;
  color: string;
  requirement: number;
  unlocked: boolean;
  type: "streak" | "total";
}

export function getBadges(currentStreak: number, longestStreak: number, totalDays: number): Badge[] {
  const best = Math.max(currentStreak, longestStreak);
  return [
    { id: "first", name: "Primeiro Passo", description: "Estudou 1 dia", iconName: "sprout", color: "text-emerald-400", requirement: 1, unlocked: totalDays >= 1, type: "total" },
    { id: "streak3", name: "Tripla Chama", description: "3 dias seguidos", iconName: "flame", color: "text-orange-400", requirement: 3, unlocked: best >= 3, type: "streak" },
    { id: "streak7", name: "Semana 10X", description: "7 dias seguidos", iconName: "zap", color: "text-yellow-400", requirement: 7, unlocked: best >= 7, type: "streak" },
    { id: "streak14", name: "Duas Semanas", description: "14 dias seguidos", iconName: "gem", color: "text-cyan-400", requirement: 14, unlocked: best >= 14, type: "streak" },
    { id: "streak30", name: "Mês Completo", description: "30 dias seguidos", iconName: "trophy", color: "text-amber-400", requirement: 30, unlocked: best >= 30, type: "streak" },
    { id: "total10", name: "Dedicado", description: "10 dias de estudo", iconName: "book", color: "text-blue-400", requirement: 10, unlocked: totalDays >= 10, type: "total" },
    { id: "streak60", name: "Imparável", description: "60 dias seguidos", iconName: "rocket", color: "text-purple-400", requirement: 60, unlocked: best >= 60, type: "streak" },
    { id: "total50", name: "Mestre 10X", description: "50 dias de estudo", iconName: "crown", color: "text-yellow-300", requirement: 50, unlocked: totalDays >= 50, type: "total" },
  ];
}

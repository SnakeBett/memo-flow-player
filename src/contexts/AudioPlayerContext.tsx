import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { Track } from "@/data/audioData";
import { useListeningProgress } from "@/hooks/useListeningProgress";
import { useListeningHistory } from "@/hooks/useListeningHistory";
import { useStreaks } from "@/hooks/useStreaks";
import { toast } from "sonner";

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isRepeat: boolean;
  isShuffle: boolean;
  volume: number;
  favorites: string[];
  playlist: Track[];
  isExpanded: boolean;
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (vol: number) => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  playNext: () => void;
  playPrevious: () => void;
  setExpanded: (expanded: boolean) => void;
  playAll: (tracks: Track[]) => void;
  isCompleted: (trackId: string) => boolean;
  getDisciplineProgress: (discipline: string) => { completed: number; total: number };
  completedTracks: string[];
  history: { trackId: string; timestamp: number }[];
  getHistoryWithTracks: () => any[];
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("proto10x-volume");
    return saved ? parseFloat(saved) : 1;
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("proto10x-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isExpanded, setExpanded] = useState(false);
  const { markCompleted, isCompleted, getDisciplineProgress, completedTracks } = useListeningProgress();
  const { history, addEntry, getHistoryWithTracks } = useListeningHistory();
  const { recordStudySession } = useStreaks();
  const progressCheckedRef = useRef<string | null>(null);

  const playNextRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextRef.current();
      }
    };
    const onError = () => {
      toast.error("Erro ao reproduzir áudio. Verifique sua conexão.");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [isRepeat]);

  useEffect(() => {
    localStorage.setItem("proto10x-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("proto10x-volume", String(volume));
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem("proto10x-last-track", JSON.stringify(currentTrack));
      recordStudySession();
    }
  }, [currentTrack, recordStudySession]);

  useEffect(() => {
    if (currentTrack && duration > 0 && currentTime / duration >= 0.9) {
      if (progressCheckedRef.current !== currentTrack.id) {
        progressCheckedRef.current = currentTrack.id;
        markCompleted(currentTrack.id);
      }
    }
  }, [currentTime, duration, currentTrack, markCompleted]);

  const playTrack = useCallback((track: Track, pl?: Track[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => toast.error("Não foi possível reproduzir."));
        setIsPlaying(true);
      }
      return;
    }
    audio.src = track.audioUrl;
    audio.playbackRate = playbackRate;
    audio.play().catch(() => toast.error("Não foi possível reproduzir."));
    setCurrentTrack(track);
    setIsPlaying(true);
    if (pl) setPlaylist(pl);
    addEntry(track.id);
    progressCheckedRef.current = null;
  }, [currentTrack, isPlaying, playbackRate, addEntry]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => toast.error("Não foi possível reproduzir."));
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.currentTime + 15, audio.duration || 0);
  }, []);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  const toggleRepeat = useCallback(() => setIsRepeat((r) => !r), []);
  const toggleShuffle = useCallback(() => setIsShuffle((s) => !s), []);
  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const isFavorite = useCallback((trackId: string) => favorites.includes(trackId), [favorites]);

  const playNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    let next: Track;
    if (isShuffle) {
      const otherTracks = playlist.filter((t) => t.id !== currentTrack.id);
      next = otherTracks.length > 0
        ? otherTracks[Math.floor(Math.random() * otherTracks.length)]
        : playlist[0];
    } else {
      const idx = playlist.findIndex((t) => t.id === currentTrack.id);
      next = playlist[(idx + 1) % playlist.length];
    }

    audio.src = next.audioUrl;
    audio.playbackRate = playbackRate;
    audio.play().catch(() => toast.error("Não foi possível reproduzir."));
    setCurrentTrack(next);
    setIsPlaying(true);
    addEntry(next.id);
    progressCheckedRef.current = null;
  }, [currentTrack, playlist, playbackRate, isShuffle, addEntry]);

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const playPrevious = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const audio = audioRef.current;
    if (!audio) return;
    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
    audio.src = prev.audioUrl;
    audio.playbackRate = playbackRate;
    audio.play().catch(() => toast.error("Não foi possível reproduzir."));
    setCurrentTrack(prev);
    setIsPlaying(true);
    addEntry(prev.id);
    progressCheckedRef.current = null;
  }, [currentTrack, playlist, playbackRate, addEntry]);

  const playAll = useCallback((tracks: Track[]) => {
    if (tracks.length === 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    const ordered = isShuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks;
    setPlaylist(ordered);
    audio.src = ordered[0].audioUrl;
    audio.playbackRate = playbackRate;
    audio.play().catch(() => toast.error("Não foi possível reproduzir."));
    setCurrentTrack(ordered[0]);
    setIsPlaying(true);
    addEntry(ordered[0].id);
    progressCheckedRef.current = null;
  }, [playbackRate, isShuffle, addEntry]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack, isPlaying, currentTime, duration, playbackRate,
        isRepeat, isShuffle, volume, favorites, playlist, isExpanded,
        playTrack, togglePlay, seek, skipForward, skipBackward,
        setPlaybackRate, toggleRepeat, toggleShuffle, setVolume,
        toggleFavorite, isFavorite, playNext, playPrevious, setExpanded, playAll,
        isCompleted, getDisciplineProgress, completedTracks,
        history, getHistoryWithTracks,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { getPlaylists, formatDuration, tracks } from "@/data/audioData";
import { Play, Flame, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Track } from "@/data/audioData";
import { useStreaks } from "@/hooks/useStreaks";
import DisciplineCover, { getDisciplineConfig } from "@/components/DisciplineCover";
import { motion } from "framer-motion";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  const { playTrack, currentTrack, isPlaying, getDisciplineProgress } = useAudioPlayer();
  const navigate = useNavigate();
  const playlists = getPlaylists();
  const [lastTrack, setLastTrack] = useState<Track | null>(null);
  const { currentStreak } = useStreaks();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("proto10x-last-track");
      if (saved) setLastTrack(JSON.parse(saved));
    } catch { /* corrupted */ }
  }, []);

  const continueTrack = currentTrack || lastTrack;

  return (
    <div className="page-container px-5 pt-14">
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1 tracking-wide uppercase">{getGreeting()}</p>
            <h1 className="text-3xl font-bold font-display tracking-tight">AprovaCast</h1>
          </div>
          <button
            onClick={() => navigate("/account")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium transition-all active:scale-95"
          >
            <Flame size={14} className={currentStreak > 0 ? "text-orange-400" : "text-muted-foreground"} />
            <span>{currentStreak}</span>
          </button>
        </div>
      </header>

      {continueTrack && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Continue ouvindo</h2>
          <button
            onClick={() => {
              const disciplineTracks = tracks.filter((t) => t.discipline === continueTrack.discipline);
              playTrack(continueTrack, disciplineTracks);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-muted-foreground/30 transition-all active:scale-[0.98] group"
          >
            <DisciplineCover
              discipline={continueTrack.discipline}
              size="md"
              playing={currentTrack?.id === continueTrack.id && isPlaying}
            />
            <div className="text-left min-w-0 flex-1">
              <p className="font-semibold truncate">{continueTrack.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{continueTrack.discipline}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play size={16} className="text-background ml-0.5" />
            </div>
          </button>
        </motion.section>
      )}

      <section>
        <h2 className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Disciplinas</h2>
        <div className="space-y-2">
          {playlists.map((pl, i) => {
            const progress = getDisciplineProgress(pl.discipline);
            const pct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            const config = getDisciplineConfig(pl.discipline);
            return (
              <motion.button
                key={pl.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-muted-foreground/30 transition-all active:scale-[0.98] text-left group overflow-hidden relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: config.accent }} />
                <DisciplineCover discipline={pl.discipline} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{pl.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pl.tracks.length} faixas · {formatDuration(pl.tracks.reduce((a, t) => a + t.duration, 0))}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 3)}%`, background: config.accent }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

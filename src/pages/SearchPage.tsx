import { useState, useMemo } from "react";
import { Search, Heart, X, ChevronRight } from "lucide-react";
import { tracks, formatDuration, getPlaylists } from "@/data/audioData";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Input } from "@/components/ui/input";
import DisciplineCover, { getDisciplineConfig } from "@/components/DisciplineCover";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const { playTrack, currentTrack, isPlaying, toggleFavorite, isFavorite } = useAudioPlayer();
  const navigate = useNavigate();

  const disciplines = useMemo(() => getPlaylists(), []);

  const filtered = useMemo(() => {
    let results = tracks;
    if (selectedDiscipline) results = results.filter((t) => t.discipline === selectedDiscipline);
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter((t) => t.title.toLowerCase().includes(q) || t.discipline.toLowerCase().includes(q));
    }
    return results;
  }, [query, selectedDiscipline]);

  const showBrowse = !query.trim() && !selectedDiscipline;

  return (
    <div className="page-container px-5 pt-14">
      <h1 className="text-3xl font-bold font-display tracking-tight mb-6">Buscar</h1>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Título ou disciplina..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-11 bg-card border-0 rounded-xl text-sm placeholder:text-muted-foreground/50"
          autoFocus
        />
        {(query || selectedDiscipline) && (
          <button onClick={() => { setQuery(""); setSelectedDiscipline(null); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {disciplines.map((pl) => {
          const config = getDisciplineConfig(pl.discipline);
          const active = selectedDiscipline === pl.discipline;
          return (
            <button
              key={pl.id}
              onClick={() => setSelectedDiscipline(active ? null : pl.discipline)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
              style={active ? { background: `${config.accent}20`, color: config.accent } : {}}
            >
              <span className={active ? "" : "text-muted-foreground"}>{pl.discipline}</span>
            </button>
          );
        })}
      </div>

      {showBrowse ? (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Explorar</p>
          {disciplines.map((pl, i) => {
            const config = getDisciplineConfig(pl.discipline);
            return (
              <motion.button
                key={pl.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                className="w-full flex items-center gap-3 py-3.5 border-b border-border/30 last:border-0 active:scale-[0.98] transition-transform group"
              >
                <DisciplineCover discipline={pl.discipline} size="sm" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium group-hover:text-foreground transition-colors">{pl.discipline}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pl.tracks.length} faixas · {formatDuration(pl.tracks.reduce((a, t) => a + t.duration, 0))}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-muted-foreground">Nenhum resultado</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Tente outro termo</p>
            </div>
          ) : (
            <div>
              {filtered.map((track) => {
                const active = currentTrack?.id === track.id;
                const config = getDisciplineConfig(track.discipline);
                return (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track, filtered)}
                    className="w-full flex items-center gap-3 py-3 border-b border-border/30 last:border-0 transition-colors active:scale-[0.99]"
                  >
                    <DisciplineCover discipline={track.discipline} size="sm" playing={active && isPlaying} />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate" style={active ? { color: config.accent } : {}}>
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{track.discipline} · {formatDuration(track.duration)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      className="p-2 rounded-full hover:bg-secondary transition-all active:scale-90"
                    >
                      <Heart size={14} className={isFavorite(track.id) ? "fill-foreground text-foreground" : "text-muted-foreground/30"} />
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

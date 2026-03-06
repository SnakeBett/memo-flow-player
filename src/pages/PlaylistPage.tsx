import { useParams, useNavigate } from "react-router-dom";
import { getPlaylists, formatDuration } from "@/data/audioData";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, ArrowLeft, Heart, CheckCircle2, Shuffle } from "lucide-react";
import DisciplineCover, { getDisciplineConfig } from "@/components/DisciplineCover";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, playAll, currentTrack, isPlaying, toggleFavorite, isFavorite, isCompleted, getDisciplineProgress, toggleShuffle, isShuffle } = useAudioPlayer();
  const playlists = getPlaylists();
  const playlist = playlists.find((p) => p.id === id);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentTrack]);

  if (!playlist) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] px-5">
        <p className="text-muted-foreground mb-4">Playlist não encontrada</p>
        <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold">
          Voltar ao início
        </button>
      </div>
    );
  }

  const config = getDisciplineConfig(playlist.discipline);
  const progress = getDisciplineProgress(playlist.discipline);
  const totalDuration = playlist.tracks.reduce((a, t) => a + t.duration, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="px-5 pt-12 pb-8 relative">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.accent}, transparent 70%)` }}
        />
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <DisciplineCover discipline={playlist.discipline} size="lg" className="mb-5" />
            <h1 className="text-2xl font-bold font-display tracking-tight">{playlist.name}</h1>
            <p className="text-sm text-muted-foreground mt-2 space-x-2">
              <span>{playlist.tracks.length} faixas</span>
              <span className="text-border">/</span>
              <span>{formatDuration(totalDuration)}</span>
              <span className="text-border">/</span>
              <span style={{ color: config.accent }}>{progress.completed}/{progress.total} completas</span>
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-6 flex gap-3">
        <button
          onClick={() => playAll(playlist.tracks)}
          className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <Play size={18} /> Reproduzir
        </button>
        <button
          onClick={toggleShuffle}
          className={`w-12 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
            isShuffle ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Shuffle size={18} />
        </button>
      </div>

      {/* Track list */}
      <div className="px-5">
        {playlist.tracks.map((track, i) => {
          const active = currentTrack?.id === track.id;
          return (
            <motion.button
              key={track.id}
              ref={active ? activeRef : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => playTrack(track, playlist.tracks)}
              className={`w-full flex items-center gap-4 py-3.5 border-b border-border/50 last:border-0 transition-colors active:scale-[0.99] ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-7 text-center shrink-0">
                {active && isPlaying ? (
                  <div className="flex items-end justify-center gap-[2px] h-4">
                    <span className="w-[3px] h-2 rounded-full animate-bounce" style={{ background: config.accent, animationDuration: "0.6s" }} />
                    <span className="w-[3px] h-3.5 rounded-full animate-bounce" style={{ background: config.accent, animationDelay: "150ms", animationDuration: "0.6s" }} />
                    <span className="w-[3px] h-2.5 rounded-full animate-bounce" style={{ background: config.accent, animationDelay: "300ms", animationDuration: "0.6s" }} />
                  </div>
                ) : isCompleted(track.id) ? (
                  <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                ) : (
                  <span className="text-sm tabular-nums" style={active ? { color: config.accent } : {}}>{i + 1}</span>
                )}
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm font-medium truncate ${active ? "text-foreground" : ""}`} style={active ? { color: config.accent } : {}}>
                  {track.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDuration(track.duration)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                className="p-2 rounded-full hover:bg-secondary transition-all active:scale-90"
              >
                <Heart size={15} className={isFavorite(track.id) ? "fill-foreground text-foreground" : "text-muted-foreground/40"} />
              </button>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

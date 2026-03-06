import { Heart, Clock, CheckCircle2 } from "lucide-react";
import { tracks, formatDuration } from "@/data/audioData";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import DisciplineCover, { getDisciplineConfig } from "@/components/DisciplineCover";
import { useState } from "react";
import { motion } from "framer-motion";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

const TABS = [
  { id: "favorites" as const, label: "Favoritos" },
  { id: "completed" as const, label: "Concluídas" },
  { id: "history" as const, label: "Histórico" },
];

export default function LibraryPage() {
  const { favorites, playTrack, currentTrack, isPlaying, toggleFavorite, isFavorite, getHistoryWithTracks, completedTracks } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState<"favorites" | "completed" | "history">("favorites");

  const favoriteTracks = tracks.filter((t) => favorites.includes(t.id));
  const historyEntries = getHistoryWithTracks();
  const completedTracksList = tracks.filter((t) => completedTracks.includes(t.id));

  const emptyConfig = {
    favorites: { icon: Heart, title: "Nenhum favorito", sub: "Toque no coração para salvar" },
    completed: { icon: CheckCircle2, title: "Nenhuma concluída", sub: "Ouça 90% de uma faixa" },
    history: { icon: Clock, title: "Sem histórico", sub: "Ouça faixas para registrar" },
  };

  const renderList = () => {
    let items: { track: typeof tracks[0]; showTime?: boolean; timestamp?: number }[] = [];

    if (activeTab === "favorites") items = favoriteTracks.map((t) => ({ track: t }));
    else if (activeTab === "completed") items = completedTracksList.map((t) => ({ track: t }));
    else items = historyEntries.map((e) => ({ track: e.track, showTime: true, timestamp: e.timestamp }));

    if (items.length === 0) {
      const cfg = emptyConfig[activeTab];
      const Icon = cfg.icon;
      return (
        <div className="text-center mt-20 space-y-2">
          <Icon size={36} className="mx-auto text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">{cfg.title}</p>
          <p className="text-xs text-muted-foreground/60">{cfg.sub}</p>
        </div>
      );
    }

    return items.map(({ track, showTime, timestamp }, i) => {
      const active = currentTrack?.id === track.id;
      const config = getDisciplineConfig(track.discipline);
      const pl = activeTab === "favorites" ? favoriteTracks : activeTab === "completed" ? completedTracksList : historyEntries.map((e) => e.track);
      return (
        <button
          key={`${track.id}-${timestamp || i}`}
          onClick={() => playTrack(track, pl)}
          className="w-full flex items-center gap-3 py-3 border-b border-border/30 last:border-0 transition-colors active:scale-[0.99]"
        >
          <DisciplineCover discipline={track.discipline} size="sm" playing={active && isPlaying} />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate" style={active ? { color: config.accent } : {}}>
              {track.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {track.discipline} · {showTime && timestamp ? timeAgo(timestamp) : formatDuration(track.duration)}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
            className="p-2 rounded-full hover:bg-secondary transition-all active:scale-90"
          >
            <Heart size={14} className={isFavorite(track.id) ? "fill-foreground text-foreground" : "text-muted-foreground/30"} />
          </button>
        </button>
      );
    });
  };

  return (
    <div className="page-container px-5 pt-14">
      <h1 className="text-3xl font-bold font-display tracking-tight mb-6">Biblioteca</h1>

      {/* Custom tabs */}
      <div className="flex gap-6 mb-6 border-b border-border/30">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative pb-3 text-sm font-medium transition-colors"
          >
            <span className={activeTab === tab.id ? "text-foreground" : "text-muted-foreground"}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="lib-tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {renderList()}
    </div>
  );
}

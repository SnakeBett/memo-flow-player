import {
  Headphones, Zap, Clock, TrendingUp, Award, BarChart3, BookOpen,
  Settings, RotateCcw, ChevronRight, Target, Download, X, LogOut, User,
} from "lucide-react";
import StreakCard from "@/components/StreakCard";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useAuth } from "@/contexts/AuthContext";
import { useStudyStats } from "@/hooks/useStudyStats";
import { getPlaylists, tracks } from "@/data/audioData";
import DisciplineCover, { getDisciplineConfig } from "@/components/DisciplineCover";
import * as api from "@/lib/api";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const { history, completedTracks, getDisciplineProgress } = useAudioPlayer();
  const { user, signOut } = useAuth();
  const stats = useStudyStats(history, completedTracks);
  const playlists = getPlaylists();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const trackCount = tracks.length;
  const completionPct = trackCount > 0 ? Math.round((completedTracks.length / trackCount) * 100) : 0;
  const hasActivity = history.length > 0;

  const formatTime = (min: number) => {
    if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
    return `${min}m`;
  };

  const toggleSettings = () => {
    const next = !showSettings;
    setShowSettings(next);
    if (next) setTimeout(() => settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
  };

  const resetProgress = () => {
    toast("Tem certeza?", {
      action: {
        label: "Resetar tudo",
        onClick: async () => {
          localStorage.removeItem("proto10x-progress");
          localStorage.removeItem("proto10x-history");
          localStorage.removeItem("proto10x-streaks");
          localStorage.removeItem("proto10x-favorites");
          localStorage.removeItem("proto10x-last-track");
          try { await api.resetAllData(); } catch { /* offline */ }
          toast.success("Progresso resetado.");
          setTimeout(() => window.location.reload(), 600);
        },
      },
      duration: 5000,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const exportData = () => {
    const data = {
      progress: localStorage.getItem("proto10x-progress"),
      history: localStorage.getItem("proto10x-history"),
      streaks: localStorage.getItem("proto10x-streaks"),
      favorites: localStorage.getItem("proto10x-favorites"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocolo10x-backup-${new Date().toLocaleDateString("sv-SE")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exportado.");
  };

  return (
    <div className="page-container px-5 pt-14">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center">
            <User size={18} className="text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight">{user?.name || "Conta"}</h1>
            <p className="text-xs text-muted-foreground">{user?.email || "Seu progresso"}</p>
          </div>
        </div>
        <button
          onClick={toggleSettings}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
            showSettings ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
          }`}
        >
          {showSettings ? <X size={16} /> : <Settings size={16} />}
        </button>
      </div>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            ref={settingsRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="rounded-2xl bg-card border border-border p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Configurações</p>
              <button onClick={exportData} className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-sm active:scale-[0.98]">
                <Download size={16} className="text-muted-foreground" />
                <span className="flex-1 text-left">Exportar backup</span>
                <ChevronRight size={14} className="text-muted-foreground/40" />
              </button>
              <button onClick={resetProgress} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-sm text-destructive active:scale-[0.98]">
                <RotateCcw size={16} />
                <span className="flex-1 text-left">Resetar progresso</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>

              <div className="border-t border-border/50 pt-2 mt-1">
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground active:scale-[0.98]">
                  <LogOut size={16} />
                  <span className="flex-1 text-left">Sair da conta</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="text-center py-4 rounded-2xl bg-card border border-border">
          <p className="text-2xl font-bold font-display">{completedTracks.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Completas</p>
        </div>
        <div className="text-center py-4 rounded-2xl bg-card border border-border">
          <p className="text-2xl font-bold font-display">{completionPct}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Progresso</p>
        </div>
        <div className="text-center py-4 rounded-2xl bg-card border border-border">
          <p className="text-2xl font-bold font-display">{formatTime(stats.totalMinutes)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Estudado</p>
        </div>
      </div>

      <div className="space-y-5">
        <StreakCard />

        {/* Study Stats */}
        {hasActivity && (
          <div className="rounded-2xl bg-card border border-border p-6">
            <h2 className="font-semibold font-display mb-4">Estatísticas</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: "Tempo total", value: formatTime(stats.totalMinutes) },
                { icon: TrendingUp, label: "Média diária", value: `${stats.avgMinutesPerDay}m` },
                { icon: Award, label: "Mais estudada", value: stats.topDiscipline === "—" ? "—" : stats.topDiscipline },
                { icon: Headphones, label: "Faixas únicas", value: String(stats.uniqueTracks) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="py-3 px-4 rounded-xl bg-secondary/30">
                  <p className="text-sm font-bold font-display truncate">{value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discipline progress */}
        <div className="rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold font-display">Por disciplina</h2>
            <span className="text-[11px] text-muted-foreground tabular-nums">{completedTracks.length}/{trackCount}</span>
          </div>
          <div className="space-y-4">
            {playlists.map((pl) => {
              const progress = getDisciplineProgress(pl.discipline);
              const pct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
              const config = getDisciplineConfig(pl.discipline);
              return (
                <button
                  key={pl.id}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  className="flex items-center gap-3 w-full group active:scale-[0.98] transition-transform"
                >
                  <DisciplineCover discipline={pl.discipline} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium truncate group-hover:text-foreground transition-colors">{pl.discipline}</span>
                      <span className={`text-[11px] tabular-nums ${pct === 100 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 3)}%`, background: pct === 100 ? "#34d399" : config.accent }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-[11px] text-muted-foreground/40">AprovaCast · v1.0</p>
        </div>
      </div>
    </div>
  );
}

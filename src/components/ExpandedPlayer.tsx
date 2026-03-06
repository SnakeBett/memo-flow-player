import { Play, Pause, SkipBack, SkipForward, Repeat, Heart, ChevronDown, Shuffle } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { formatDuration } from "@/data/audioData";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import DisciplineCover, { getDisciplineConfig } from "./DisciplineCover";

const RATES = [0.75, 1, 1.25, 1.5, 2];

export default function ExpandedPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, playbackRate,
    isRepeat, isShuffle, togglePlay, seek, setPlaybackRate,
    toggleRepeat, toggleShuffle, toggleFavorite, isFavorite,
    playNext, playPrevious, isExpanded, setExpanded, playlist,
  } = useAudioPlayer();

  if (!currentTrack || !isExpanded) return null;

  const config = getDisciplineConfig(currentTrack.discipline);
  const currentIdx = playlist.findIndex((t) => t.id === currentTrack.id);
  const nextTrack = playlist[(currentIdx + 1) % playlist.length];

  return (
    <AnimatePresence>
      <motion.div
        key="expanded-player"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col"
      >
        {/* Ambient color */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${config.accent}, transparent 70%)` }}
        />

        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <button
              onClick={() => setExpanded(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            >
              <ChevronDown size={24} />
            </button>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] font-medium">Reproduzindo</p>
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <Heart size={18} className={isFavorite(currentTrack.id) ? "fill-foreground text-foreground" : "text-muted-foreground"} />
            </button>
          </div>

          {/* Cover */}
          <div className="flex-1 flex items-center justify-center px-10">
            <motion.div
              animate={{ scale: isPlaying ? 1 : 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <DisciplineCover discipline={currentTrack.discipline} size="xl" playing={isPlaying} />
            </motion.div>
          </div>

          {/* Track info */}
          <div className="px-8 mb-5">
            <h2 className="text-2xl font-bold font-display tracking-tight truncate">{currentTrack.title}</h2>
            <p className="text-sm mt-1" style={{ color: config.accent }}>{currentTrack.discipline}</p>
          </div>

          {/* Seek */}
          <div className="px-8 mb-3">
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={1}
              onValueChange={([v]) => seek(v)}
              className="mb-2"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
              <span>{formatDuration(currentTime)}</span>
              <span>-{formatDuration(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-10 px-8 mb-5">
            <button onClick={playPrevious} className="text-foreground/70 hover:text-foreground p-2 transition-colors active:scale-90">
              <SkipBack size={26} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-background hover:opacity-90 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
            </button>
            <button onClick={playNext} className="text-foreground/70 hover:text-foreground p-2 transition-colors active:scale-90">
              <SkipForward size={26} />
            </button>
          </div>

          {/* Secondary */}
          <div className="flex items-center justify-center gap-6 px-8 pb-6">
            <button onClick={toggleShuffle} className={`p-2 rounded-full transition-all ${isShuffle ? "text-foreground" : "text-muted-foreground/40"}`}>
              <Shuffle size={16} />
            </button>
            <button onClick={toggleRepeat} className={`p-2 rounded-full transition-all ${isRepeat ? "text-foreground" : "text-muted-foreground/40"}`}>
              <Repeat size={16} />
            </button>
            <button
              onClick={() => {
                const idx = RATES.indexOf(playbackRate);
                setPlaybackRate(RATES[(idx + 1) % RATES.length]);
              }}
              className="px-2.5 py-1 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors tabular-nums"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Up next */}
          {nextTrack && nextTrack.id !== currentTrack.id && (
            <div className="px-8 pb-10">
              <div className="flex items-center gap-3 py-3 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">A seguir</span>
                <p className="text-sm truncate flex-1 text-muted-foreground">{nextTrack.title}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

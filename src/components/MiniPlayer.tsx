import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import DisciplineCover, { getDisciplineConfig } from "./DisciplineCover";

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration, setExpanded } = useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const config = getDisciplineConfig(currentTrack.discipline);

  return (
    <AnimatePresence>
      <motion.div
        key={currentTrack.id}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-[4.5rem] left-0 right-0 z-50 safe-area-bottom"
      >
        <div className="max-w-lg mx-auto">
          <div className="h-1 bg-border">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, background: config.accent }}
            />
          </div>

          <div
            className="bg-card border-t border-border px-4 py-3 flex items-center gap-3 cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            <DisciplineCover discipline={currentTrack.discipline} size="sm" playing={isPlaying} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.discipline}</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background hover:opacity-90 transition-all active:scale-95"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

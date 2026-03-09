import { Flame, Trophy, Star, Calendar, Sprout, Zap, Gem, BookOpen, Rocket, Crown } from "lucide-react";
import { useStreaks, getBadges, type BadgeIconName } from "@/hooks/useStreaks";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const badgeIcons: Record<BadgeIconName, typeof Flame> = {
  sprout: Sprout, flame: Flame, zap: Zap, gem: Gem,
  trophy: Trophy, book: BookOpen, rocket: Rocket, crown: Crown,
};

export default function StreakCard() {
  const { currentStreak, longestStreak, totalDays, hasStudiedToday, studyDates } = useStreaks();
  const badges = getBadges(currentStreak, longestStreak, totalDays);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const nextBadge = badges.find((b) => !b.unlocked);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString("sv-SE");
    const dayName = d.toLocaleDateString("pt-BR", { weekday: "narrow" });
    const isToday = i === 6;
    return { date: dateStr, day: dayName, studied: studyDates.includes(dateStr), isToday };
  });

  const nextBadgeProgress = nextBadge
    ? Math.min(100, ((nextBadge.type === "streak" ? Math.max(currentStreak, longestStreak) : totalDays) / nextBadge.requirement) * 100)
    : 100;

  return (
    <div className="space-y-5">
      {/* Streak */}
      <div className="rounded-2xl border border-border p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ background: currentStreak > 0
            ? "linear-gradient(135deg, #f97316 0%, #f59e0b 50%, transparent 80%)"
            : "linear-gradient(135deg, hsl(225 12% 20%) 0%, transparent 80%)"
          }}
        />
        <div className="relative flex items-center gap-5 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            currentStreak > 0 ? "bg-orange-500/20" : "bg-secondary"
          }`}>
            <Flame size={26} className={currentStreak > 0 ? "text-orange-400" : "text-muted-foreground"} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-display tracking-tight">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">{currentStreak === 1 ? "dia" : "dias"}</span>
            </div>
            <p className={`text-xs font-medium mt-1 ${hasStudiedToday ? "text-emerald-400" : "text-amber-400"}`}>
              {hasStudiedToday ? "Você já estudou hoje" : "Estude hoje para manter"}
            </p>
          </div>
        </div>

        {/* Weekly */}
        <div className="relative flex justify-between mb-6">
          {last7Days.map(({ date, day, studied, isToday }) => (
            <div key={date} className="flex flex-col items-center gap-2">
              <span className="text-[11px] text-muted-foreground uppercase">{day}</span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                studied
                  ? "bg-foreground text-background"
                  : isToday
                    ? "ring-1 ring-foreground/30 text-foreground"
                    : "bg-secondary/60 text-muted-foreground"
              }`}>
                {new Date(date + "T12:00:00").getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {[
            { icon: Flame, value: currentStreak, label: "Atual" },
            { icon: Trophy, value: longestStreak, label: "Recorde" },
            { icon: Calendar, value: totalDays, label: "Total" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center py-3 rounded-xl bg-secondary/50">
              <p className="text-lg font-bold font-display">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-muted-foreground" />
            <h3 className="font-semibold font-display">Conquistas</h3>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{unlockedCount}/{badges.length}</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => {
            const Icon = badgeIcons[badge.iconName];
            const isSelected = selectedBadge === badge.id;
            return (
              <button
                key={badge.id}
                onClick={() => {
                  setSelectedBadge(isSelected ? null : badge.id);
                  toast(badge.unlocked ? `${badge.name} — ${badge.description}` : `${badge.name} — ${badge.description}`, { duration: 2000 });
                }}
                className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all active:scale-95 ${
                  badge.unlocked
                    ? isSelected ? "bg-foreground/10 ring-1 ring-foreground/20" : "bg-secondary/50"
                    : "opacity-30"
                }`}
              >
                <Icon size={20} className={badge.unlocked ? badge.color : "text-muted-foreground"} strokeWidth={1.5} />
                <p className="text-[11px] font-medium text-center mt-2 leading-tight">{badge.name}</p>
              </button>
            );
          })}
        </div>

        {nextBadge && (() => {
          const NextIcon = badgeIcons[nextBadge.iconName];
          return (
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <NextIcon size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-xs font-medium">{nextBadge.name}</p>
                  <p className="text-[11px] text-muted-foreground">{nextBadge.description}</p>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{Math.round(nextBadgeProgress)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nextBadgeProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-foreground/60"
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

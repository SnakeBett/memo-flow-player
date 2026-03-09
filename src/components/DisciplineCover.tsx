import { Scale, BookOpen, Landmark, FileText, PenTool, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const disciplineConfig: Record<string, {
  icon: typeof Scale;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
}> = {
  "Direito Penal": {
    icon: Scale,
    color: "text-red-400",
    bg: "bg-red-500/20",
    accent: "#f87171",
    gradient: "from-red-500 to-rose-600",
  },
  "Direito Constitucional": {
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    accent: "#60a5fa",
    gradient: "from-blue-500 to-cyan-500",
  },
  "Direito Administrativo": {
    icon: Landmark,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    accent: "#fbbf24",
    gradient: "from-amber-500 to-orange-500",
  },
  "Direito Civil": {
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    accent: "#34d399",
    gradient: "from-emerald-500 to-green-500",
  },
  "Português": {
    icon: PenTool,
    color: "text-violet-400",
    bg: "bg-violet-500/20",
    accent: "#a78bfa",
    gradient: "from-violet-500 to-purple-500",
  },
};

const defaultConfig = {
  icon: GraduationCap,
  color: "text-zinc-400",
  bg: "bg-zinc-500/20",
  accent: "#a1a1aa",
  gradient: "from-zinc-500 to-zinc-600",
};

export function getDisciplineConfig(discipline: string) {
  return disciplineConfig[discipline] || defaultConfig;
}

interface DisciplineCoverProps {
  discipline: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  playing?: boolean;
}

const sizeMap = {
  sm: { container: "w-11 h-11 rounded-xl", icon: 18, ring: 48 },
  md: { container: "w-13 h-13 rounded-xl", icon: 22, ring: 56 },
  lg: { container: "w-24 h-24 rounded-2xl", icon: 40, ring: 104 },
  xl: { container: "w-52 h-52 rounded-3xl", icon: 60, ring: 220 },
};

export default function DisciplineCover({ discipline, size = "md", className, playing }: DisciplineCoverProps) {
  const config = getDisciplineConfig(discipline);
  const Icon = config.icon;
  const s = sizeMap[size];
  const isLarge = size === "lg" || size === "xl";

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      {playing && (
        <div
          className="absolute animate-spin-slow rounded-full"
          style={{
            width: s.ring,
            height: s.ring,
            border: `2px solid transparent`,
            borderTopColor: config.accent,
            borderRightColor: `${config.accent}55`,
          }}
        />
      )}
      <div
        className={cn(
          s.container,
          "flex items-center justify-center",
          isLarge ? `bg-gradient-to-br ${config.gradient}` : config.bg,
        )}
        style={!isLarge ? { width: size === "sm" ? 44 : 52, height: size === "sm" ? 44 : 52 } : {}}
      >
        <Icon
          size={s.icon}
          className={isLarge ? "text-white" : config.color}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

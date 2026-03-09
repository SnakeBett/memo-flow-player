import { Home, Search, Library, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Início", icon: Home, match: (p: string) => p === "/" || p.startsWith("/playlist") },
  { path: "/search", label: "Buscar", icon: Search, match: (p: string) => p === "/search" },
  { path: "/library", label: "Biblioteca", icon: Library, match: (p: string) => p === "/library" },
  { path: "/account", label: "Conta", icon: User, match: (p: string) => p === "/account" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-[4.5rem] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.match(location.pathname);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 px-4 py-2 transition-all active:scale-90"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={`transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
              <span className={`text-[11px] font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

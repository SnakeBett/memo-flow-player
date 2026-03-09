import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AmbientBackground from "@/components/Particles";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import ExpandedPlayer from "@/components/ExpandedPlayer";
import AnimatedRoutes from "@/components/AnimatedRoutes";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <AudioPlayerProvider>
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AmbientBackground />
            <main className="relative z-10 max-w-lg mx-auto min-h-screen">
              <AnimatedRoutes />
            </main>
            <MiniPlayer />
            <ExpandedPlayer />
            <BottomNav />
          </ErrorBoundary>
        </BrowserRouter>
      </AudioPlayerProvider>
    </AuthProvider>
  </TooltipProvider>
);

export default App;

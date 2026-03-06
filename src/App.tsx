import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Particles from "@/components/Particles";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import ExpandedPlayer from "@/components/ExpandedPlayer";
import AnimatedRoutes from "@/components/AnimatedRoutes";

const App = () => (
  <TooltipProvider>
    <AudioPlayerProvider>
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Particles />
          <main className="relative z-10 max-w-lg mx-auto min-h-screen">
            <AnimatedRoutes />
          </main>
          <MiniPlayer />
          <ExpandedPlayer />
          <BottomNav />
        </ErrorBoundary>
      </BrowserRouter>
    </AudioPlayerProvider>
  </TooltipProvider>
);

export default App;

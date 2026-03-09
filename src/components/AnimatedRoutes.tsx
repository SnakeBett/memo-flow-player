import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ProtectedRoute from "./ProtectedRoute";
import Index from "@/pages/Index";
import SearchPage from "@/pages/SearchPage";
import LibraryPage from "@/pages/LibraryPage";
import AccountPage from "@/pages/AccountPage";
import PlaylistPage from "@/pages/PlaylistPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><PageTransition><Index /></PageTransition></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><PageTransition><SearchPage /></PageTransition></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><PageTransition><LibraryPage /></PageTransition></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><PageTransition><AccountPage /></PageTransition></ProtectedRoute>} />
        <Route path="/playlist/:id" element={<ProtectedRoute><PageTransition><PlaylistPage /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

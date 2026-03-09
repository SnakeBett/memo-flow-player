import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (mode === "register" && !name.trim()) {
      toast.error("Preencha seu nome");
      return;
    }

    setLoading(true);
    const error = mode === "login"
      ? await signIn(email, password)
      : await signUp(name, email, password);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Protocolo 10X</h1>
          <p className="text-sm text-muted-foreground mt-1">Memorização acelerada por áudio</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 justify-center">
          <button
            onClick={() => setMode("login")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              mode === "login" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              mode === "register" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-[11px] text-muted-foreground uppercase tracking-wide block mb-1.5">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wide block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wide block mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              mode === "login" ? "Entrar" : "Criar conta"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            {mode === "login" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

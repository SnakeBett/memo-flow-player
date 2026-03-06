import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
      <p className="text-7xl font-bold font-display tracking-tighter text-foreground/10 mb-4">404</p>
      <h1 className="text-xl font-bold font-display mb-2">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Voltar ao início
      </Link>
    </div>
  );
}

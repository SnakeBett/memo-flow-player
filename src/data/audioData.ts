export interface Track {
  id: string;
  title: string;
  discipline: string;
  duration: number; // in seconds
  cover: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  discipline: string;
  cover: string;
  tracks: Track[];
}

const BASE_URL = "https://seudominio.com/audios";

export const tracks: Track[] = [
  // Direito Penal
  { id: "dp-01", title: "Princípio da Legalidade", discipline: "Direito Penal", duration: 312, cover: "", audioUrl: `${BASE_URL}/direito-penal/principio-da-legalidade.mp3` },
  { id: "dp-02", title: "Tipicidade e Antijuridicidade", discipline: "Direito Penal", duration: 287, cover: "", audioUrl: `${BASE_URL}/direito-penal/tipicidade-antijuridicidade.mp3` },
  { id: "dp-03", title: "Culpabilidade", discipline: "Direito Penal", duration: 245, cover: "", audioUrl: `${BASE_URL}/direito-penal/culpabilidade.mp3` },
  { id: "dp-04", title: "Crimes contra a Pessoa", discipline: "Direito Penal", duration: 398, cover: "", audioUrl: `${BASE_URL}/direito-penal/crimes-contra-pessoa.mp3` },
  { id: "dp-05", title: "Excludentes de Ilicitude", discipline: "Direito Penal", duration: 356, cover: "", audioUrl: `${BASE_URL}/direito-penal/excludentes-ilicitude.mp3` },

  // Direito Constitucional
  { id: "dc-01", title: "Princípios Fundamentais", discipline: "Direito Constitucional", duration: 423, cover: "", audioUrl: `${BASE_URL}/direito-constitucional/principios-fundamentais.mp3` },
  { id: "dc-02", title: "Direitos e Garantias", discipline: "Direito Constitucional", duration: 367, cover: "", audioUrl: `${BASE_URL}/direito-constitucional/direitos-garantias.mp3` },
  { id: "dc-03", title: "Organização do Estado", discipline: "Direito Constitucional", duration: 290, cover: "", audioUrl: `${BASE_URL}/direito-constitucional/organizacao-estado.mp3` },
  { id: "dc-04", title: "Poder Legislativo", discipline: "Direito Constitucional", duration: 334, cover: "", audioUrl: `${BASE_URL}/direito-constitucional/poder-legislativo.mp3` },
  { id: "dc-05", title: "Controle de Constitucionalidade", discipline: "Direito Constitucional", duration: 412, cover: "", audioUrl: `${BASE_URL}/direito-constitucional/controle-constitucionalidade.mp3` },

  // Direito Administrativo
  { id: "da-01", title: "Princípios Administrativos", discipline: "Direito Administrativo", duration: 278, cover: "", audioUrl: `${BASE_URL}/direito-administrativo/principios-administrativos.mp3` },
  { id: "da-02", title: "Atos Administrativos", discipline: "Direito Administrativo", duration: 345, cover: "", audioUrl: `${BASE_URL}/direito-administrativo/atos-administrativos.mp3` },
  { id: "da-03", title: "Licitações e Contratos", discipline: "Direito Administrativo", duration: 389, cover: "", audioUrl: `${BASE_URL}/direito-administrativo/licitacoes-contratos.mp3` },
  { id: "da-04", title: "Servidores Públicos", discipline: "Direito Administrativo", duration: 301, cover: "", audioUrl: `${BASE_URL}/direito-administrativo/servidores-publicos.mp3` },

  // Direito Civil
  { id: "dci-01", title: "Pessoa Natural e Jurídica", discipline: "Direito Civil", duration: 267, cover: "", audioUrl: `${BASE_URL}/direito-civil/pessoa-natural-juridica.mp3` },
  { id: "dci-02", title: "Obrigações", discipline: "Direito Civil", duration: 312, cover: "", audioUrl: `${BASE_URL}/direito-civil/obrigacoes.mp3` },
  { id: "dci-03", title: "Contratos em Espécie", discipline: "Direito Civil", duration: 378, cover: "", audioUrl: `${BASE_URL}/direito-civil/contratos-especie.mp3` },
  { id: "dci-04", title: "Responsabilidade Civil", discipline: "Direito Civil", duration: 295, cover: "", audioUrl: `${BASE_URL}/direito-civil/responsabilidade-civil.mp3` },

  // Português
  { id: "pt-01", title: "Concordância Verbal", discipline: "Português", duration: 234, cover: "", audioUrl: `${BASE_URL}/portugues/concordancia-verbal.mp3` },
  { id: "pt-02", title: "Regência Verbal", discipline: "Português", duration: 256, cover: "", audioUrl: `${BASE_URL}/portugues/regencia-verbal.mp3` },
  { id: "pt-03", title: "Crase", discipline: "Português", duration: 198, cover: "", audioUrl: `${BASE_URL}/portugues/crase.mp3` },
  { id: "pt-04", title: "Interpretação de Texto", discipline: "Português", duration: 345, cover: "", audioUrl: `${BASE_URL}/portugues/interpretacao-texto.mp3` },
];

const disciplineColors: Record<string, string> = {
  "Direito Penal": "from-red-500/20 to-purple-600/20",
  "Direito Constitucional": "from-blue-500/20 to-cyan-500/20",
  "Direito Administrativo": "from-amber-500/20 to-orange-500/20",
  "Direito Civil": "from-green-500/20 to-emerald-500/20",
  "Português": "from-pink-500/20 to-rose-500/20",
};

const disciplineIcons: Record<string, string> = {
  "Direito Penal": "⚖️",
  "Direito Constitucional": "📜",
  "Direito Administrativo": "🏛️",
  "Direito Civil": "📋",
  "Português": "📝",
};

export function getPlaylists(): Playlist[] {
  const grouped = tracks.reduce((acc, track) => {
    if (!acc[track.discipline]) acc[track.discipline] = [];
    acc[track.discipline].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

  return Object.entries(grouped).map(([discipline, disciplineTracks]) => ({
    id: discipline.toLowerCase().replace(/\s+/g, "-"),
    name: discipline,
    discipline,
    cover: disciplineIcons[discipline] || "📚",
    tracks: disciplineTracks,
  }));
}

export function getDisciplineGradient(discipline: string): string {
  return disciplineColors[discipline] || "from-purple-500/20 to-blue-500/20";
}

export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

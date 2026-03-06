

# Melhorias do Protocolo 10X - 4 Novas Funcionalidades

## 1. Sistema de Progresso por Disciplina
Adicionar rastreamento de faixas ouvidas por disciplina com barra de progresso visual.

- Criar hook `useListeningProgress` que salva no `localStorage` quais faixas foram ouvidas (marcadas como "concluidas" quando atingem 90% da duracao)
- No `AudioPlayerContext`, disparar evento quando uma faixa atinge 90% do tempo total
- Exibir na **Home** uma barra de progresso abaixo de cada card de disciplina (ex: "3/5 faixas")
- Exibir na **Conta** um resumo geral de progresso com porcentagem por disciplina
- Na **PlaylistPage**, marcar visualmente as faixas ja concluidas com um check

## 2. Historico de Reproducao
Registrar as ultimas faixas ouvidas com data/hora.

- Criar hook `useListeningHistory` que salva no `localStorage` (maximo 50 entradas) com `{trackId, timestamp}`
- No `AudioPlayerContext`, registrar no historico toda vez que uma nova faixa comeca a tocar
- Adicionar uma aba ou secao "Historico" na pagina **Biblioteca**, usando tabs (Favoritos | Historico)
- Cada item mostra titulo, disciplina, e "ha X minutos/horas/dias"

## 3. Melhoria da Pagina de Busca
Tornar a busca mais util quando o campo esta vazio.

- Quando `query` esta vazio, exibir:
  - Chips clicaveis com nomes das disciplinas (ao clicar, filtra por disciplina)
  - Secao "Todas as Faixas" listando todas as tracks organizadas
- Ao clicar num chip de disciplina, preencher o campo de busca ou filtrar diretamente
- Adicionar icone de limpar (X) no campo de busca

## 4. Estatisticas de Tempo de Estudo
Exibir metricas detalhadas na pagina de Conta.

- Criar hook `useStudyStats` que calcula a partir do historico de reproducao:
  - Total de minutos/horas ouvidos
  - Media diaria de estudo
  - Disciplina mais estudada
  - Total de faixas unicas ouvidas
- Adicionar card de estatisticas na **AccountPage** com icones e numeros destacados
- Reutilizar dados do `useListeningHistory` e `useListeningProgress`

---

## Detalhes Tecnicos

### Novos arquivos
- `src/hooks/useListeningProgress.ts` - rastreia faixas concluidas (>90% ouvido)
- `src/hooks/useListeningHistory.ts` - historico de reproducao com timestamps
- `src/hooks/useStudyStats.ts` - calcula estatisticas agregadas

### Arquivos modificados
- `src/contexts/AudioPlayerContext.tsx` - adicionar dispatch para progresso e historico
- `src/pages/Index.tsx` - barra de progresso nos cards de disciplina
- `src/pages/SearchPage.tsx` - chips de disciplina e listagem quando vazio
- `src/pages/LibraryPage.tsx` - tabs Favoritos/Historico
- `src/pages/AccountPage.tsx` - cards de estatisticas e progresso por disciplina
- `src/pages/PlaylistPage.tsx` - indicador de faixa concluida

### Armazenamento (localStorage)
- `proto10x-progress`: `{ completedTracks: string[] }` - IDs de faixas concluidas
- `proto10x-history`: `{ trackId, timestamp }[]` - ultimas 50 reproducoes


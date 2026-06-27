# Missão Final — Consolidação do Frontend 123Vendido

Esta é a última grande mudança estrutural antes da integração com o FastAPI. Identidade visual, landing, motion de abertura, design tokens (navy + laranja, Sora) e responsividade ficam **intactos**.

## 1. Limpeza de template e mocks

- Remover qualquer página/arquivo de exemplo remanescente (rotas órfãs, demos, README de template).
- Auditar `src/components/**` e `src/routes/**` — eliminar todo `import { ... } from "@/lib/mock"` em componentes/rotas. Mocks passam a viver **apenas** dentro de `src/services/mock/`.
- Toda leitura/escrita de dados nas telas passa por `services.*` (que já roteia entre `mock` e `rest` via `VITE_API_PROVIDER`).
- Nenhum componente faz `fetch`/`axios` diretamente, nem conhece URLs.

## 2. Estrutura completa de rotas

### Públicas (fora de `_authenticated`)

`/`, `/sobre`, `/como-funciona`, `/planos`, `/contato`, `/ajuda`, `/lgpd`, `/termos`, `/privacidade`, `/auth` (login + cadastro + recuperar — tabs), `/reset-password`.

Cada rota pública ganha `head()` próprio (title + description + og).

### Autenticadas (`/_authenticated/app/*`)

Reorganizar para refletir hierarquia real, com **layouts pai + Outlet** e abas internas onde fizer sentido:

```
/app                      Dashboard
/app/perfil               Meu Perfil
/app/conta                Minha Conta
/app/preferencias
/app/notificacoes
/app/favoritos
/app/radar
/app/resultados
/app/relatorios
/app/documentos
/app/uploads              (Upload Center)
/app/assets
/app/configuracoes

/app/organizadores                       lista
/app/organizadores/$slug                 (abas: leiloes | documentos | estatisticas)

/app/leiloes                             lista
/app/leiloes/$id                         (abas: lotes | cronograma | documentos | erratas | mapa)

/app/lotes                               lista
/app/lotes/$id                           (abas: galeria | historico | analise | financeiro | imagens | documentos)

/app/veiculos                            lista
/app/veiculos/$id                        (abas: fotos | documentacao | avaliacao | mercado | liquidez | fipe)

/app/inteligencia                        (subrotas: dashboard, opportunity, risk, pricing, liquidity, vision, document-intelligence, recommendations, knowledge)

/app/financeiro                          (subrotas: dashboard, pagamentos, faturas, assinaturas, cupons, produtos, planos)

/app/admin                               (subrotas: dashboard, usuarios, roles, permissoes, configuracoes, connectors, jobs, monitoring, developer-center, billing, juridico, auditoria, logs, feature-flags, prompts, providers, storage)
```

Implementação via TanStack file-based routing (`_authenticated.app.<modulo>.tsx` + `_authenticated.app.<modulo>.$id.tsx` + layouts com `<Outlet />` para abas internas). Detalhes em **Notas técnicas**.

## 3. Template padrão de página

Cada rota usa uma `PageShell` reutilizável com: Breadcrumb, Header, Toolbar (pesquisa + filtros + ações), conteúdo (Cards/Tabela/Form/Detalhe), Skeleton, Empty State, Error State, Paginação. CRUD (criar/editar/excluir) via Drawer/Modal padronizados.

Componentes genéricos a criar/consolidar em `src/components/app/`:

- `PageShell.tsx` (header + breadcrumbs + toolbar slot)
- `DataTable.tsx`, `DataCards.tsx`, `Paginator.tsx`
- `EmptyState.tsx`, `ErrorState.tsx`, `LoadingState.tsx`
- `FilterBar.tsx`, `SearchBar.tsx`
- `EntityDrawer.tsx` (criar/editar)
- `ConfirmDialog.tsx` (excluir)
- `TabsLayout.tsx` (abas de detalhe)

`ModuleListPage` / `ModuleDetailPage` / `ModuleFormPage` existentes passam a usar esses primitivos e consumir `services.*` exclusivamente.

## 4. Upload Center (`/app/uploads`)

Telas (UI only, sem processar nada no front):

- Upload de Editais, Lotes, Imagens, CSV, XLSX
- Histórico de Uploads
- Fila de Processamento + Status + Logs
- Pré-visualização

Tudo via `services.uploads` (novo serviço com mock + rest stub).

## 5. Vision AI (`/app/inteligencia/vision`)

Interface preparada e **desabilitada** até backend:

- Upload de imagens, link do lote, observações, "informações adicionais"
- Preview, histórico, resultado (estimativa de reparo + grau de confiança)
- Aviso legal de estimativa

Botão de análise desabilitado com tooltip "Disponível após integração com backend".

## 6. Camada de serviços

Expandir `src/services/interfaces.ts`, `mock/`, `rest/` para cobrir todos os módulos novos: `uploads`, `vision`, `notifications`, `radar`, `resultados`, `documentos`, `assets`, `roles`, `permissoes`, `featureFlags`, `prompts`, `providers`, `storage`, `juridico`, `developerCenter`, `knowledge`, `recommendations`, `opportunity`, `risk`, `pricing`, `liquidity`, `documentIntelligence`, `cupons`, `produtos`, `planos`, `faturas`.

Contrato continua: `Page<T>`, `ListQuery`, `CrudService<T>` / `ReadService<T>`. Endpoint REST derivado por convenção (`/{resource}`), trocável caso o FastAPI exponha caminho diferente.

Mantém: `http-client.ts` (JWT + refresh interceptor + AbortController), `config.ts` (`VITE_API_BASE_URL`, `VITE_API_PROVIDER`).

## 7. Navegação e shell

- `AppShell` ganha sidebar agrupada refletindo a nova hierarquia (Plataforma, Organizadores, Leilões, Lotes, Veículos, Inteligência, Financeiro, Admin), com colapso `icon`.
- Breadcrumbs dinâmicos a partir do match atual do router.
- Topbar mantém search global, notificações, UserMenu.
- RBAC: itens de admin/financeiro escondidos via `useAuth().hasRole(...)` (flags já existentes).

## 8. Documentação

Atualizar `docs/API_INTEGRATION.md` com:

- Lista completa de recursos REST esperados
- Convenção de endpoints (`GET/POST/PATCH/DELETE /{resource}`)
- Contrato `Page<T>` e `ListQuery`
- Fluxo JWT + refresh
- Como trocar `VITE_API_PROVIDER=mock → rest`

## 9. Entrega / aceitação

- Nenhum componente importa `@/lib/mock` diretamente.
- Nenhuma chamada `fetch`/`axios` fora de `http-client.ts`.
- Todas as rotas listadas existem e renderizam algo significativo (não placeholder cru).
- Sidebar + breadcrumbs cobrem todas as rotas.
- Trocar `VITE_API_PROVIDER=rest` + setar `VITE_API_BASE_URL` → app passa a chamar FastAPI sem mudança de UI.
- Identidade visual, landing e motion intocados.

---

## Notas técnicas

- **Escala**: ~80+ rotas novas. Para evitar arquivo-por-rota explodindo, módulos com muitas subseções homogêneas (Inteligência, Financeiro, Admin) usam **um layout pai + um componente de subrota genérico** (`ModuleSubPage`) parametrizado por chave de seção, mantendo file-based routing mas com pouco boilerplate por arquivo.
- **Abas de detalhe** (`/leiloes/$id/lotes`, etc.): implementadas como rotas filhas `_authenticated.app.leiloes.$id.lotes.tsx` para que cada aba tenha URL própria (deep link, SSR-friendly) e use `<Outlet />` no layout `_authenticated.app.leiloes.$id.tsx`.
- `**MODULES_BY_KEY**` existente é expandido para descrever todos os novos módulos (label, ícone, colunas padrão, schema de form) — assim a criação de uma rota nova é configuração, não código.
- **Vision AI**: feature flag local `vision.enabled = false` por enquanto.
- **Sem mudanças de backend Lovable Cloud** — auth/perfil/preferências/storage continuam como estão. Toda a lógica de negócio é mock até `VITE_API_PROVIDER=rest`.

---

## Escopo / esforço

Trabalho grande (muitos arquivos novos + refactor de componentes existentes). Vou executar em uma sequência só, mas em lotes paralelos: (1) services + interfaces, (2) primitivos de página, (3) rotas públicas, (4) rotas autenticadas + sidebar/breadcrumbs, (5) Upload Center + Vision AI, (6) docs + limpeza de mocks residuais. Verificação final com build + smoke visual.

Confirma que posso prosseguir com este plano?  
  
Remova o texto e icone no inicio da páina: **Plataforma de inteligência para leilões**  
  
**Revise a responsividade, gabarito e espaçamento para que estejam de forma profissional e no padrão figma e behance  como os modelos validados e premiados**  

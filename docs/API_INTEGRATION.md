# 123Vendido — Guia de Integração da API

Este documento descreve como o frontend está estruturado para consumir
serviços e como ligar o backend **FastAPI** sem alterar nenhum componente de UI.

---

## 1. Visão geral da arquitetura

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Frontend (Lovable)                           │
│                                                                           │
│  Páginas / Rotas                                                          │
│      │                                                                    │
│      ▼                                                                    │
│  Hooks (useAuth, useQuery)                                                │
│      │                                                                    │
│      ▼                                                                    │
│  Service Registry  ──►  Interfaces (Repository pattern)                   │
│      │                       │                                            │
│      ▼                       ▼                                            │
│   Mock Provider          REST Provider ──► HTTP client (JWT, refresh)     │
│   (dados em memória)         │                                            │
│                              ▼                                            │
│                         FastAPI Backend  (auctions / lots / vehicles…)    │
│                                                                           │
│  Lovable Cloud (apenas plano frontend):                                   │
│    • Auth (Email + Google)                                                │
│    • Sessão, refresh token, route guards                                  │
│    • Tabelas: profiles · user_roles · user_preferences                    │
│    • Storage buckets: avatars · logos · assets                            │
└──────────────────────────────────────────────────────────────────────────┘
```

O **Lovable Cloud** cuida exclusivamente de autenticação, perfil, preferências
e storage de assets. Toda a lógica de negócio (leilões, lotes, veículos,
parsing, OCR, IA, scoring, billing operacional, integrações externas) virá do
**FastAPI**, atrás do `VITE_API_BASE_URL`.

---

## 2. Estrutura de pastas

```
src/
├─ integrations/
│  ├─ supabase/           # Cliente Cloud (auto-gerado, não editar)
│  └─ lovable/            # OAuth helper (auto-gerado)
├─ lib/
│  ├─ api/
│  │  ├─ config.ts        # API_BASE_URL, API_PROVIDER
│  │  └─ http-client.ts   # fetch centralizado + JWT + refresh
│  ├─ storage.ts          # upload helpers (avatars/logos/assets)
│  ├─ mock.ts             # dataset em memória (será descartado)
│  └─ modules.tsx         # config genérica dos módulos CRUD
├─ services/
│  ├─ types.ts            # Page<T>, ListQuery, ID
│  ├─ interfaces.ts       # Contratos por domínio (Read/Crud)
│  ├─ mock/index.ts       # Implementação mock
│  ├─ rest/index.ts       # Implementação REST (FastAPI)
│  └─ index.ts            # Factory: services = mock | rest
├─ hooks/
│  └─ useAuth.ts          # session + profile + roles + preferences
├─ routes/
│  ├─ index.tsx                       # Landing pública
│  ├─ auth.tsx                        # Login / Signup / Forgot
│  ├─ reset-password.tsx              # Definir nova senha
│  ├─ _authenticated.tsx              # Gate de autenticação (ssr:false)
│  └─ _authenticated.app.*            # Toda a plataforma protegida
└─ components/
   ├─ brand/              # Identidade 123Vendido (intocável)
   ├─ app/                # Shell, primitives, tabela/form genéricos
   └─ ui/                 # shadcn
```

---

## 3. Variáveis de ambiente

Veja `.env.example`. As três que importam:

| Variável | Função |
|----------|--------|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable Cloud (auto) |
| `VITE_API_BASE_URL` | URL da FastAPI (ex.: `https://api.123vendido.com`) |
| `VITE_API_PROVIDER` | `mock` (default) ou `rest` para usar a FastAPI |

Nenhuma URL é hardcoded — tudo passa por `src/lib/api/config.ts`.

---

## 4. HTTP client centralizado

`src/lib/api/http-client.ts` é o único ponto de saída HTTP para a FastAPI:

- Anexa `Authorization: Bearer <jwt>` lendo a sessão do Lovable Cloud.
- Em `401`, chama `supabase.auth.refreshSession()` e refaz a chamada uma vez.
- Lança `ApiError(status, payload)` padronizado.
- Timeout de 30 s, abortável via `signal`.

```ts
import { http } from "@/lib/api/http-client";
const data = await http.get<Page<Auction>>("/auctions", { query: { page: 1 } });
```

---

## 5. Interfaces de serviço (Repository)

Arquivo: `src/services/interfaces.ts`

| Serviço | Tipo | Uso |
|---------|------|-----|
| `organizadores` | `CrudService` | Leiloeiros e instituições |
| `leiloes` | `CrudService` | Editais |
| `auctionNotices` | `CrudService` | Avisos / atas |
| `lotes` | `CrudService` | Lotes |
| `veiculos` | `CrudService` | Catálogo de veículos |
| `favorites` | `CrudService` | Favoritos do usuário |
| `relatorios` | `ReadService` | Relatórios gerados |
| `dashboard` | custom | KPIs e leilões recentes |
| `billing` | `ReadService` | Assinaturas |
| `pagamentos` | `ReadService` | Transações |
| `monitoring` | `ReadService` | Health-check dos serviços |
| `jobs` | `CrudService` | Workers / scheduler |
| `connectors` | `CrudService` | Integrações externas |
| `intelligence` | `ReadService` | Pipelines parser/OCR |
| `alertas` | `CrudService` | Radar |
| `auditoria` | `ReadService` | Log de eventos |

Cada `CrudService<T>` expõe `list`, `getById`, `create`, `update`, `remove`.
Cada `ReadService<T>` expõe apenas `list` e `getById`.

---

## 6. Providers

### Mock — `src/services/mock/index.ts`

- Lê o dataset de `src/lib/mock.ts`.
- Implementa paginação, busca e filtros em memória.
- Adiciona latência artificial pequena para refletir estados de loading reais.

### REST — `src/services/rest/index.ts`

Convenção REST padrão:

```
GET    /{resource}              → Page<T>
GET    /{resource}/{id}         → T
POST   /{resource}              → T
PATCH  /{resource}/{id}         → T
DELETE /{resource}/{id}         → void
```

Os prefixes por recurso são declarados no arquivo (`organizers`, `auctions`,
`lots`, `vehicles`, `auction-notices`, `favorites`, `reports`, `jobs`,
`connectors`, `alerts`, `audit`, `billing/subscriptions`, `billing/payments`,
`monitoring/services`, `intelligence/pipelines`, `dashboard/kpis`,
`dashboard/recent-auctions`).

### Factory — `src/services/index.ts`

```ts
import { services } from "@/services";

const page = await services.leiloes.list({ page: 1, pageSize: 25, search: "São Paulo" });
```

Trocar de mock para REST é uma única variável: `VITE_API_PROVIDER=rest`.

---

## 7. Autenticação (frontend ↔ backend)

| Responsabilidade | Lovable | FastAPI |
|------------------|---------|---------|
| Login (Email + Google) | ✅ | — |
| Signup / Forgot password | ✅ | — |
| Refresh token / sessão | ✅ | — |
| Route guards (`/app/*`) | ✅ | — |
| `Authorization: Bearer <jwt>` | injetado pelo http-client | valida o JWT do Supabase |
| Autorização de negócio (escopos) | UI hints via `roles` | regra final |
| Gestão de usuários / convites | — | ✅ |
| Permissões finas / billing | — | ✅ |

O JWT emitido pelo Lovable Cloud é o que chega na FastAPI. O backend deve
validar usando a JWKS pública do projeto Supabase (Lovable Cloud roda em
Supabase por baixo dos panos) e mapear `sub` para o usuário interno.

---

## 8. Storage

Buckets públicos provisionados:

| Bucket | Uso |
|--------|-----|
| `avatars` | Foto do usuário |
| `logos` | Logos de organizações / leiloeiros |
| `assets` | Demais imagens públicas |

RLS: leitura pública; escrita restrita a `auth.uid()/...` (cada usuário
escreve dentro da sua própria pasta). Helper: `uploadUserFile()` em
`src/lib/storage.ts`.

---

## 9. Checklist de integração com a FastAPI

- [ ] **Endpoints REST** seguindo a convenção do item 6 (ou ajustar
      `src/services/rest/index.ts` para os caminhos reais).
- [ ] **Resposta de listagem** no formato `{ data, total, page, pageSize }`.
- [ ] **Validação JWT** com a JWKS do projeto Lovable Cloud.
- [ ] **CORS** liberando o domínio do frontend (preview + produção + custom).
- [ ] **Health check** público em `GET /healthz` para o módulo Monitoring.
- [ ] **Mapeamento `sub` → user_id** interno; sincronizar `display_name` /
      `avatar_url` a partir do `profiles` do Lovable se necessário.
- [ ] **Refresh token** — nada a fazer no backend: o frontend trata.
- [ ] **Rate limit** por `sub` ou IP, com 429 padronizado.
- [ ] **Erros**: corpo JSON `{ "message": "...", "code": "..." }`.
- [ ] **Setar** `VITE_API_BASE_URL` e `VITE_API_PROVIDER=rest` no ambiente
      após a FastAPI estar pública.
- [ ] **Testes E2E** módulo a módulo: trocar para `rest` e verificar que
      nenhuma tela quebra.

---

## 10. Próximos passos (opcional, sem mudar UI)

- Adicionar React Query (`@tanstack/react-query` já instalado) por módulo,
  encapsulando `services.<x>.list()` para cache + revalidação SWR.
- Gerar tipos TS do OpenAPI da FastAPI e substituir `GenericRow` pelos
  tipos reais nos métodos `list`/`getById`.
- Internacionalização baseada em `preferences.language`.

---

_Frontend pronto para receber a FastAPI sem refatoração de UI._

---

## Consolidação final do frontend (pré-integração)

A versão consolidada do frontend remove todos os mocks dispersos e padroniza o consumo:

- **Único ponto de acesso a dados**: todos os componentes leem via `import { services } from "@/services"`. Nenhum componente importa `@/lib/mock` diretamente nem faz `fetch`/`axios`.
- **ServiceRegistry** (`src/services/interfaces.ts`): exporta `services.dashboard` e `services.resources[moduleKey]`. Cada `resource` implementa `list`, `getById`, `create`, `update`, `remove`.
- **MockProvider**: `src/services/mock/index.ts` — cobre 30+ módulos, com fixtures reais quando disponíveis e `placeholder()` quando o módulo ainda depende do backend.
- **RestProvider**: `src/services/rest/index.ts` — Proxy lazy que monta CRUDs sobre o `httpClient`. Endpoints padrão `/{key}`; mapeamento por módulo em `RESOURCE_ENDPOINTS`.
- **Toggle**: `VITE_API_PROVIDER=mock|rest` em `.env.local`.

### Novas rotas

- **Públicas**: `/sobre`, `/como-funciona`, `/planos`, `/contato`, `/ajuda`, `/lgpd`, `/termos`, `/privacidade`. Usam o shell `src/components/public/PublicPage.tsx`.
- **Plataforma autenticada**: `/app/uploads` (Upload Center — UI apenas) e `/app/vision` (Vision AI — desabilitado via flag `vision.enabled` até a integração).
- **Módulos genéricos**: `/app/$module` e `/app/$module/$id` cobrem 30+ módulos configurados em `src/lib/modules.tsx`.

### Convenção de endpoints esperada do backend

| Operação | Método | Path |
| --- | --- | --- |
| Listar | `GET` | `/{resource}?page=&pageSize=&search=&sort=&<filtros>` |
| Detalhe | `GET` | `/{resource}/{id}` |
| Criar | `POST` | `/{resource}` |
| Atualizar | `PATCH` | `/{resource}/{id}` |
| Remover | `DELETE` | `/{resource}/{id}` |
| Dashboard | `GET` | `/dashboard/kpis`, `/dashboard/recent-auctions`, `/dashboard/recent-alerts`, `/dashboard/recent-jobs`, `/dashboard/top-organizers` |

A troca para o backend FastAPI não exige alterações em componentes React — basta apontar `VITE_API_BASE_URL` e setar `VITE_API_PROVIDER=rest`.

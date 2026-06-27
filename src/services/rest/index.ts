/**
 * REST providers — talk to the external FastAPI backend through the
 * centralized HTTP client. Endpoint convention:
 *
 *   GET    /{resource}              -> Page<T>
 *   GET    /{resource}/{id}         -> T
 *   POST   /{resource}              -> T
 *   PATCH  /{resource}/{id}         -> T
 *   DELETE /{resource}/{id}         -> void
 *
 * `restServices.resources` is a Proxy that lazily builds a CrudService for any
 * module key requested by the UI — adding a module is configuration only.
 * The default endpoint is `/<key>`; override via RESOURCE_ENDPOINTS below.
 */
import { http } from "@/lib/api/http-client";
import type {
  CrudService,
  ServiceRegistry,
  GenericRow,
  DashboardService,
} from "../interfaces";
import type { ListQuery, Page } from "../types";

const RESOURCE_ENDPOINTS: Record<string, string> = {
  organizadores: "organizers",
  leiloes: "auctions",
  lotes: "lots",
  veiculos: "vehicles",
  favoritos: "favorites",
  radar: "radar",
  resultados: "results",
  relatorios: "reports",
  documentos: "documents",
  uploads: "uploads",
  assets: "assets",
  notificacoes: "notifications",
  preferencias: "preferences",
  conta: "account",
  configuracoes: "settings",

  inteligencia: "intelligence/pipelines",
  opportunity: "intelligence/opportunity",
  risk: "intelligence/risk",
  pricing: "intelligence/pricing",
  liquidity: "intelligence/liquidity",
  vision: "intelligence/vision",
  "document-intelligence": "intelligence/documents",
  recommendations: "intelligence/recommendations",
  knowledge: "intelligence/knowledge",

  financeiro: "billing/overview",
  pagamentos: "billing/payments",
  faturas: "billing/invoices",
  assinaturas: "billing/subscriptions",
  cupons: "billing/coupons",
  produtos: "billing/products",
  planos: "billing/plans",
  billing: "billing/subscriptions",

  usuarios: "admin/users",
  roles: "admin/roles",
  permissoes: "admin/permissions",
  connectors: "admin/connectors",
  jobs: "admin/jobs",
  monitoring: "admin/monitoring",
  developer: "admin/developer-center",
  juridico: "admin/legal",
  auditoria: "admin/audit",
  logs: "admin/logs",
  "feature-flags": "admin/feature-flags",
  prompts: "admin/prompts",
  providers: "admin/providers",
  storage: "admin/storage",
  perfil: "me/profile",
};

function endpoint(key: string): string {
  return RESOURCE_ENDPOINTS[key] ?? key;
}

function makeCrud<T extends GenericRow>(key: string): CrudService<T> {
  const r = endpoint(key);
  return {
    list: (q: ListQuery = {}) =>
      http.get<Page<T>>(`/${r}`, {
        query: { page: q.page, pageSize: q.pageSize, search: q.search, sort: q.sort, ...(q.filters ?? {}) },
      }),
    getById: (id) => http.get<T | null>(`/${r}/${id}`),
    create: (input) => http.post<T>(`/${r}`, input),
    update: (id, input) => http.patch<T>(`/${r}/${id}`, input),
    remove: (id) => http.delete<void>(`/${r}/${id}`),
  };
}

const resources = new Proxy({} as Record<string, CrudService<GenericRow>>, {
  get(cache, key: string) {
    if (!cache[key]) cache[key] = makeCrud(key);
    return cache[key];
  },
});

const dashboard: DashboardService = {
  getKpis: () => http.get<Record<string, number | string>>("/dashboard/kpis"),
  getRecentAuctions: (limit = 6) =>
    http.get<GenericRow[]>("/dashboard/recent-auctions", { query: { limit } }),
  getRecentAlerts: (limit = 5) =>
    http.get<GenericRow[]>("/dashboard/recent-alerts", { query: { limit } }),
  getRecentJobs: (limit = 5) =>
    http.get<GenericRow[]>("/dashboard/recent-jobs", { query: { limit } }),
  getTopOrganizadores: (limit = 12) =>
    http.get<GenericRow[]>("/dashboard/top-organizers", { query: { limit } }),
};

export const restServices: ServiceRegistry = { dashboard, resources };

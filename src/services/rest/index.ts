/**
 * REST providers — talk to the external FastAPI backend through the
 * centralized HTTP client. Endpoints are derived from a per-resource prefix
 * and follow the standard REST shape:
 *
 *   GET    /{resource}              -> Page<T>
 *   GET    /{resource}/{id}         -> T
 *   POST   /{resource}              -> T
 *   PATCH  /{resource}/{id}         -> T
 *   DELETE /{resource}/{id}         -> void
 *
 * When the FastAPI team uses different paths, override per-service here —
 * the UI never has to change.
 */
import { http } from "@/lib/api/http-client";
import type { CrudService, ReadService, ServiceRegistry } from "../interfaces";
import type { GenericRow, ListQuery, Page } from "../types";

function makeRead<T extends GenericRow>(resource: string): ReadService<T> {
  return {
    list: (q: ListQuery = {}) =>
      http.get<Page<T>>(`/${resource}`, {
        query: {
          page: q.page,
          pageSize: q.pageSize,
          search: q.search,
          sort: q.sort,
          ...(q.filters ?? {}),
        },
      }),
    getById: (id) => http.get<T | null>(`/${resource}/${id}`),
  };
}

function makeCrud<T extends GenericRow>(resource: string): CrudService<T> {
  const base = makeRead<T>(resource);
  return {
    ...base,
    create: (input) => http.post<T>(`/${resource}`, input),
    update: (id, input) => http.patch<T>(`/${resource}/${id}`, input),
    remove: (id) => http.delete<void>(`/${resource}/${id}`),
  };
}

export const restServices: ServiceRegistry = {
  organizadores: makeCrud("organizers"),
  leiloes: makeCrud("auctions"),
  auctionNotices: makeCrud("auction-notices"),
  lotes: makeCrud("lots"),
  veiculos: makeCrud("vehicles"),
  favorites: makeCrud("favorites"),
  relatorios: makeRead("reports"),
  dashboard: {
    getKpis: () => http.get<Record<string, number | string>>("/dashboard/kpis"),
    getRecentAuctions: (limit = 6) =>
      http.get<GenericRow[]>("/dashboard/recent-auctions", { query: { limit } }),
  },
  billing: makeRead("billing/subscriptions"),
  pagamentos: makeRead("billing/payments"),
  monitoring: makeRead("monitoring/services"),
  jobs: makeCrud("jobs"),
  connectors: makeCrud("connectors"),
  intelligence: makeRead("intelligence/pipelines"),
  alertas: makeCrud("alerts"),
  auditoria: makeRead("audit"),
};

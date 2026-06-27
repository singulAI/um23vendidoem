/**
 * Mock providers — bridge between the existing in-memory mock dataset and the
 * service interfaces. They paginate, search and filter generically so the UI
 * can already consume the same shape that the REST provider will return.
 */
import {
  organizadores,
  leiloes,
  lotes,
  veiculos,
  pagamentos,
  assinaturas,
  connectors,
  alertas,
  jobs,
  auditoria,
  relatorios,
  usuarios,
} from "@/lib/mock";
import type {
  CrudService,
  ReadService,
  ServiceRegistry,
  GenericRow,
} from "../interfaces";
import type { ListQuery, Page, ID } from "../types";

function paginate<T extends GenericRow>(rows: T[], q: ListQuery = {}): Page<T> {
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 25;
  let out = rows;

  if (q.search) {
    const s = q.search.toLowerCase();
    out = out.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(s)),
    );
  }
  if (q.filters) {
    for (const [k, v] of Object.entries(q.filters)) {
      if (v === undefined || v === "" || v === null) continue;
      out = out.filter((r) => String(r[k] ?? "") === String(v));
    }
  }

  const total = out.length;
  const start = (page - 1) * pageSize;
  return { data: out.slice(start, start + pageSize), total, page, pageSize };
}

function makeRead<T extends GenericRow>(getAll: () => T[]): ReadService<T> {
  return {
    async list(query) {
      // Tiny artificial latency for realistic loading states
      await new Promise((r) => setTimeout(r, 80));
      return paginate(getAll(), query);
    },
    async getById(id) {
      await new Promise((r) => setTimeout(r, 50));
      return getAll().find((r) => String(r.id) === String(id)) ?? null;
    },
  };
}

function makeCrud<T extends GenericRow>(getAll: () => T[]): CrudService<T> {
  // In-memory mutable store keyed by the underlying array reference
  const base = makeRead(getAll);
  return {
    ...base,
    async create(input) {
      const id = `mock-${Date.now()}`;
      const row = { id, ...input } as T;
      getAll().unshift(row);
      return row;
    },
    async update(id, input) {
      const rows = getAll();
      const idx = rows.findIndex((r) => String(r.id) === String(id));
      if (idx === -1) throw new Error("Not found");
      rows[idx] = { ...rows[idx], ...input } as T;
      return rows[idx];
    },
    async remove(id) {
      const rows = getAll();
      const idx = rows.findIndex((r) => String(r.id) === String(id));
      if (idx !== -1) rows.splice(idx, 1);
    },
  };
}

const cast = <T,>(arr: T[]) => arr as unknown as GenericRow[];

export const mockServices: ServiceRegistry = {
  organizadores: makeCrud(() => cast(organizadores)),
  leiloes: makeCrud(() => cast(leiloes)),
  auctionNotices: makeCrud(() => cast(leiloes)), // placeholder source
  lotes: makeCrud(() => cast(lotes)),
  veiculos: makeCrud(() => cast(veiculos)),
  favorites: makeCrud(() => cast(lotes.slice(0, 20))),
  relatorios: makeRead(() => cast(relatorios)),
  dashboard: {
    async getKpis() {
      return {
        leiloesAtivos: leiloes.filter((l) => l.status === "Aberto").length,
        lotesMonitorados: lotes.length,
        scoreMedio: 78,
        receitaEstimada: 184000,
      };
    },
    async getRecentAuctions(limit = 6) {
      return cast(leiloes.slice(0, limit));
    },
  },
  billing: makeRead(() => cast(assinaturas)),
  pagamentos: makeRead(() => cast(pagamentos)),
  monitoring: makeRead(() => cast(connectors)),
  jobs: makeCrud(() => cast(jobs)),
  connectors: makeCrud(() => cast(connectors)),
  intelligence: makeRead(() =>
    cast(jobs.filter((j) => j.tipo === "Parser" || j.tipo === "OCR")),
  ),
  alertas: makeCrud(() => cast(alertas)),
  auditoria: makeRead(() => cast(auditoria)),
};

// Re-export the underlying datasets for legacy modules still referencing them.
export { usuarios };

export type { ID };

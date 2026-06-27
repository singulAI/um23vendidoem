/**
 * Mock providers — every module key returns a CRUD service. Modules with real
 * mock data (leiloes, lotes, veiculos, etc.) use it; modules without dedicated
 * fixtures get an empty list so the UI renders EmptyState until the backend
 * provides data.
 *
 * UI components never import @/lib/mock directly — all reads go through
 * `services[moduleKey]`.
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
  ServiceRegistry,
  GenericRow,
  DashboardService,
} from "../interfaces";
import type { ListQuery, Page } from "../types";

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

function makeCrud<T extends GenericRow>(getAll: () => T[]): CrudService<T> {
  return {
    async list(query) {
      await new Promise((r) => setTimeout(r, 60));
      return paginate(getAll(), query);
    },
    async getById(id) {
      await new Promise((r) => setTimeout(r, 40));
      return getAll().find((r) => String(r.id) === String(id)) ?? null;
    },
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
const empty = (): GenericRow[] => [];

// Generic fallback placeholder rows for modules pending backend integration.
function placeholder(prefix: string, n = 6): GenericRow[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    nome: `${prefix} ${i + 1}`,
    descricao: "Aguardando integração com o backend.",
    status: "Em breve",
    data: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  }));
}

const dashboard: DashboardService = {
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
  async getRecentAlerts(limit = 5) {
    return cast(alertas.slice(0, limit));
  },
  async getRecentJobs(limit = 5) {
    return cast(jobs.slice(0, limit));
  },
  async getTopOrganizadores(limit = 12) {
    return cast(organizadores.slice(0, limit));
  },
};

const resources: ServiceRegistry["resources"] = {
  // Operação / catálogo
  organizadores: makeCrud(() => cast(organizadores)),
  leiloes: makeCrud(() => cast(leiloes)),
  lotes: makeCrud(() => cast(lotes)),
  veiculos: makeCrud(() => cast(veiculos)),

  // Plataforma (usuário)
  favoritos: makeCrud(() => cast(lotes.slice(0, 18))),
  radar: makeCrud(() => cast(alertas)),
  resultados: makeCrud(() => placeholder("resultado", 8)),
  relatorios: makeCrud(() => cast(relatorios)),
  documentos: makeCrud(() => placeholder("documento", 12)),
  uploads: makeCrud(() => placeholder("upload", 10)),
  assets: makeCrud(() => placeholder("asset", 9)),
  notificacoes: makeCrud(() => cast(alertas.slice(0, 12))),
  preferencias: makeCrud(() => placeholder("preferencia", 4)),
  conta: makeCrud(() => placeholder("conta", 4)),
  configuracoes: makeCrud(() => placeholder("configuracao", 5)),

  // Inteligência
  inteligencia: makeCrud(() => cast(jobs.filter((j) => j.tipo === "Parser" || j.tipo === "OCR"))),
  opportunity: makeCrud(() => placeholder("opp", 10)),
  risk: makeCrud(() => placeholder("risk", 8)),
  pricing: makeCrud(() => placeholder("pricing", 6)),
  liquidity: makeCrud(() => placeholder("liquidity", 6)),
  vision: makeCrud(() => empty()),
  "document-intelligence": makeCrud(() => placeholder("docai", 8)),
  recommendations: makeCrud(() => placeholder("rec", 10)),
  knowledge: makeCrud(() => placeholder("kb", 12)),

  // Financeiro
  financeiro: makeCrud(() => cast(assinaturas)),
  pagamentos: makeCrud(() => cast(pagamentos)),
  faturas: makeCrud(() => placeholder("fatura", 12)),
  assinaturas: makeCrud(() => cast(assinaturas)),
  cupons: makeCrud(() => placeholder("cupom", 6)),
  produtos: makeCrud(() => placeholder("produto", 8)),
  planos: makeCrud(() => placeholder("plano", 4)),
  billing: makeCrud(() => cast(assinaturas)),

  // Admin / plataforma
  usuarios: makeCrud(() => cast(usuarios)),
  roles: makeCrud(() => placeholder("role", 5)),
  permissoes: makeCrud(() => placeholder("perm", 12)),
  connectors: makeCrud(() => cast(connectors)),
  jobs: makeCrud(() => cast(jobs)),
  monitoring: makeCrud(() =>
    [
      { id: "svc-1", servico: "API FastAPI", status: "Online", uptime: 99.98, latencia: 84 },
      { id: "svc-2", servico: "Postgres", status: "Online", uptime: 99.99, latencia: 12 },
      { id: "svc-3", servico: "Redis", status: "Online", uptime: 99.95, latencia: 4 },
      { id: "svc-4", servico: "Storage S3", status: "Degradado", uptime: 98.4, latencia: 220 },
      { id: "svc-5", servico: "Workers", status: "Online", uptime: 99.7, latencia: 130 },
      { id: "svc-6", servico: "Scheduler", status: "Online", uptime: 99.9, latencia: 22 },
      { id: "svc-7", servico: "OCR Pipeline", status: "Online", uptime: 99.2, latencia: 410 },
    ] as GenericRow[],
  ),
  developer: makeCrud(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: `key-${i}`,
      nome: `key_prod_${i.toString(16).padStart(4, "0")}`,
      escopo: ["read", "write", "admin"][i % 3],
      criadoEm: `2025-${String((i % 12) + 1).padStart(2, "0")}-15`,
      ultimoUso: `há ${i + 1}d`,
      status: i % 7 === 0 ? "Revogada" : "Ativa",
    })) as GenericRow[],
  ),
  juridico: makeCrud(() => placeholder("juridico", 6)),
  auditoria: makeCrud(() => cast(auditoria)),
  logs: makeCrud(() => cast(auditoria.slice(0, 30))),
  "feature-flags": makeCrud(() =>
    [
      { id: "ff-1", chave: "vision.enabled", valor: "false", escopo: "global", status: "Desativada" },
      { id: "ff-2", chave: "billing.cupons", valor: "true", escopo: "global", status: "Ativa" },
      { id: "ff-3", chave: "radar.realtime", valor: "true", escopo: "beta", status: "Ativa" },
      { id: "ff-4", chave: "docai.preview", valor: "true", escopo: "interno", status: "Ativa" },
    ] as GenericRow[],
  ),
  prompts: makeCrud(() => placeholder("prompt", 8)),
  providers: makeCrud(() => placeholder("provider", 6)),
  storage: makeCrud(() =>
    [
      { id: "b-1", bucket: "avatars", arquivos: 84, tamanho: "12 MB", publico: "Sim" },
      { id: "b-2", bucket: "logos", arquivos: 22, tamanho: "3.4 MB", publico: "Sim" },
      { id: "b-3", bucket: "assets", arquivos: 156, tamanho: "48 MB", publico: "Sim" },
      { id: "b-4", bucket: "editais", arquivos: 940, tamanho: "1.8 GB", publico: "Não" },
    ] as GenericRow[],
  ),

  // Admin perfil legado (mantido)
  perfil: makeCrud(() =>
    [
      { id: "p-1", item: "Dados pessoais", valor: "Atualizado", acao: "Editar" },
      { id: "p-2", item: "Segurança (2FA)", valor: "Ativada", acao: "Configurar" },
      { id: "p-3", item: "Plano atual", valor: "Business — R$ 499/mês", acao: "Alterar" },
      { id: "p-4", item: "Sessões ativas", valor: "3 dispositivos", acao: "Revisar" },
      { id: "p-5", item: "Preferências", valor: "PT-BR · Tema escuro", acao: "Editar" },
    ] as GenericRow[],
  ),
};

export const mockServices: ServiceRegistry = { dashboard, resources };


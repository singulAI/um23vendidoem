import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import type { ModuleConfig } from "@/lib/modules";
import { Card, EmptyState, PageHeader, SkeletonRows, StatusPill } from "./Primitives";
import { cn } from "@/lib/utils";
import { services } from "@/services";
import type { GenericRow } from "@/services/interfaces";

type ViewMode = "table" | "cards";

export function ModuleListPage({ module }: { module: ModuleConfig }) {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("table");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [all, setAll] = useState<GenericRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const svc = services.resources[module.key];
    if (!svc) {
      setAll([]);
      setLoading(false);
      return;
    }
    svc
      .list({ page: 1, pageSize: 500 })
      .then((res) => {
        if (cancelled) return;
        setAll(res.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Falha ao carregar dados");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [module.key]);

  const filtered = useMemo(() => {
    return all.filter((row) => {
      if (query) {
        const hay = module.searchKeys.map((k) => String(row[k] ?? "")).join(" ").toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      for (const [k, v] of Object.entries(filters)) {
        if (v && String(row[k]) !== v) return false;
      }
      return true;
    });
  }, [all, query, filters, module.searchKeys]);

  const pageSize = view === "cards" ? 12 : 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const filterOptions = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const f of module.filters ?? []) {
      out[f] = Array.from(
        new Set(all.map((r) => String(r[f] ?? "")).filter(Boolean)),
      ).sort();
    }
    return out;
  }, [all, module.filters]);


  return (
    <div>
      <PageHeader title={module.label} description={module.description}>
        <button
          onClick={() => navigate({ to: "/app/$module/$id", params: { module: module.key, id: "new" } })}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
          <Download className="h-4 w-4" /> Exportar
        </button>
      </PageHeader>

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Buscar em ${module.label.toLowerCase()}...`}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {(module.filters ?? []).map((f) => (
            <select
              key={f}
              value={filters[f] ?? ""}
              onChange={(e) => {
                setFilters((p) => ({ ...p, [f]: e.target.value }));
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-muted-foreground"
            >
              <option value="">{f}</option>
              {filterOptions[f]?.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ))}
          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
            <button
              onClick={() => setView("table")}
              className={cn("rounded p-1.5", view === "table" ? "bg-primary/15 text-primary" : "text-muted-foreground")}
              aria-label="Tabela"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("cards")}
              className={cn("rounded p-1.5", view === "cards" ? "bg-primary/15 text-primary" : "text-muted-foreground")}
              aria-label="Cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Avançado
          </button>
        </div>

        <div className="p-3">
          {loading ? (
            <SkeletonRows />
          ) : current.length === 0 ? (
            <EmptyState title="Nenhum resultado" hint="Ajuste os filtros ou a busca para visualizar registros." />
          ) : view === "table" ? (
            <TableView module={module} rows={current} />
          ) : (
            <CardsView module={module} rows={current} />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border p-3 text-sm text-muted-foreground">
          <p>
            Exibindo {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-border bg-background p-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-border bg-background p-1.5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TableView({ module, rows }: { module: ModuleConfig; rows: Record<string, unknown>[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            {module.columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.id)} className="border-b border-border/60 hover:bg-surface/60">
              {module.columns.map((c, i) => {
                const raw = row[c.key];
                const formatted = c.format ? c.format(raw) : String(raw ?? "");
                const isStatus = ["status", "severidade", "liquidez"].includes(c.key);
                return (
                  <td key={c.key} className="px-3 py-2.5">
                    {i === 0 ? (
                      <Link
                        to="/app/$module/$id"
                        params={{ module: module.key, id: String(row.id) }}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {formatted}
                      </Link>
                    ) : isStatus ? (
                      <StatusPill value={formatted} />
                    ) : (
                      <span className="text-muted-foreground">{formatted}</span>
                    )}
                  </td>
                );
              })}
              <td className="px-3 py-2.5 text-right">
                <Link
                  to="/app/$module/$id"
                  params={{ module: module.key, id: String(row.id) }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Abrir →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardsView({ module, rows }: { module: ModuleConfig; rows: Record<string, unknown>[] }) {
  const [titleCol, ...rest] = module.columns;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <Link
          key={String(row.id)}
          to="/app/$module/$id"
          params={{ module: module.key, id: String(row.id) }}
          className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{titleCol.label}</p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            {titleCol.format ? titleCol.format(row[titleCol.key]) : String(row[titleCol.key] ?? "")}
          </p>
          <dl className="mt-4 space-y-1.5 text-sm">
            {rest.slice(0, 4).map((c) => {
              const formatted = c.format ? c.format(row[c.key]) : String(row[c.key] ?? "");
              const isStatus = ["status", "severidade", "liquidez"].includes(c.key);
              return (
                <div key={c.key} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{c.label}</dt>
                  <dd>{isStatus ? <StatusPill value={formatted} /> : <span className="text-foreground">{formatted}</span>}</dd>
                </div>
              );
            })}
          </dl>
        </Link>
      ))}
    </div>
  );
}

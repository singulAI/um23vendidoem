import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Gavel, Package, Sparkles, TrendingUp } from "lucide-react";
import { Card, PageHeader, SkeletonRows, StatusPill } from "@/components/app/Primitives";
import { services } from "@/services";
import type { GenericRow } from "@/services/interfaces";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Dashboard — 123Vendido" }] }),
  component: DashboardPage,
});

type State = {
  kpis: Record<string, number | string>;
  recentes: GenericRow[];
  alertas: GenericRow[];
  jobs: GenericRow[];
  organizadores: GenericRow[];
};

const ICONS: Record<string, typeof Gavel> = {
  leiloesAtivos: Gavel,
  lotesMonitorados: Package,
  scoreMedio: Sparkles,
  receitaEstimada: TrendingUp,
};

const KPI_LABELS: Record<string, string> = {
  leiloesAtivos: "Leilões ativos",
  lotesMonitorados: "Lotes monitorados",
  scoreMedio: "Score médio",
  receitaEstimada: "Receita estimada",
};

function DashboardPage() {
  const [data, setData] = useState<State | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      services.dashboard.getKpis(),
      services.dashboard.getRecentAuctions(6),
      services.dashboard.getRecentAlerts(5),
      services.dashboard.getRecentJobs(5),
      services.dashboard.getTopOrganizadores(12),
    ])
      .then(([kpis, recentes, alertas, jobs, organizadores]) => {
        if (!cancelled) setData({ kpis, recentes, alertas, jobs, organizadores });
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Falha ao carregar dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard executivo" description={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Dashboard executivo" description="Carregando indicadores..." />
        <Card><SkeletonRows /></Card>
      </div>
    );
  }

  const { kpis, recentes, alertas, jobs, organizadores } = data;
  const kpiList = Object.entries(kpis).map(([key, value]) => ({
    key,
    label: KPI_LABELS[key] ?? key,
    value,
    icon: ICONS[key] ?? Sparkles,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard executivo"
        description="Visão geral da operação 123Vendido em tempo real."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiList.map((k) => (
          <Card key={k.key}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <div className="rounded-md border border-border bg-background p-1.5 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{String(k.value)}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Leilões recentes</h2>
            <Link
              to="/app/$module"
              params={{ module: "leiloes" }}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 font-medium">Nº</th>
                <th className="py-2 font-medium">Organizador</th>
                <th className="py-2 font-medium">Data</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((l) => (
                <tr key={String(l.id)} className="border-b border-border/60">
                  <td className="py-2.5">
                    <Link
                      to="/app/$module/$id"
                      params={{ module: "leiloes", id: String(l.id) }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {String(l.numero ?? l.id)}
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{String(l.organizador ?? "")}</td>
                  <td className="py-2.5 text-muted-foreground">{String(l.data ?? "")}</td>
                  <td className="py-2.5"><StatusPill value={String(l.status ?? "")} /></td>
                  <td className="py-2.5 text-right font-semibold text-primary">{String(l.score ?? "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-base font-semibold">Alertas</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {alertas.map((a) => (
                <li key={String(a.id)} className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
                  <div>
                    <p className="text-foreground">{String(a.titulo ?? "")}</p>
                    <p className="text-xs text-muted-foreground">{String(a.data ?? "")}</p>
                  </div>
                  <StatusPill value={String(a.severidade ?? "")} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-display text-base font-semibold">Jobs recentes</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {jobs.map((j) => (
                <li key={String(j.id)} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                  <div>
                    <p className="text-foreground">{String(j.tipo ?? "")} • {String(j.alvo ?? "")}</p>
                    <p className="text-xs text-muted-foreground">{String(j.duracao ?? 0)}s</p>
                  </div>
                  <StatusPill value={String(j.status ?? "")} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 font-display text-base font-semibold">Organizadores ativos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {organizadores.map((o) => (
            <Link
              key={String(o.id)}
              to="/app/$module/$id"
              params={{ module: "organizadores", id: String(o.id) }}
              className="rounded-lg border border-border bg-background p-3 text-center transition-colors hover:border-primary/40"
            >
              <p className="font-display text-sm font-semibold">{String(o.nome ?? "")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{String(o.leiloes ?? 0)} leilões</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

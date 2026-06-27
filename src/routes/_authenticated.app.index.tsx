import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Gavel, Package, Sparkles, TrendingUp } from "lucide-react";
import { Card, PageHeader, StatusPill } from "@/components/app/Primitives";
import { alertas, jobs, leiloes, organizadores } from "@/lib/mock";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — 123Vendido" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const kpis = [
    { label: "Leilões ativos", value: leiloes.filter((l) => l.status === "Aberto").length, hint: "+12% vs. mês ant.", icon: Gavel },
    { label: "Lotes monitorados", value: "1.2k", hint: "+8%", icon: Package },
    { label: "Score médio", value: "78", hint: "+4 pts", icon: Sparkles },
    { label: "Receita estimada", value: "R$ 184k", hint: "+22%", icon: TrendingUp },
  ];

  const recentes = leiloes.slice(0, 6);
  const proximosAlertas = alertas.slice(0, 5);
  const ultimosJobs = jobs.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard executivo"
        description="Visão geral da operação 123Vendido em tempo real."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <div className="rounded-md border border-border bg-background p-1.5 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{k.value}</p>
            <p className="mt-1 text-xs text-emerald-300">{k.hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Oportunidades por semana</h2>
            <span className="text-xs text-muted-foreground">Últimas 12 semanas</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {[40, 55, 30, 70, 90, 60, 75, 110, 85, 130, 95, 120].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${(h / 130) * 100}%`,
                  background: i === 11 ? "var(--primary)" : "color-mix(in oklab, var(--primary) 25%, transparent)",
                }}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-base font-semibold">Resumo financeiro</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              { l: "MRR atual", v: "R$ 184.230" },
              { l: "Novas assinaturas", v: "+24" },
              { l: "Churn", v: "1,8%" },
              { l: "Receita PIX", v: "R$ 56.412" },
              { l: "Inadimplência", v: "2,4%" },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">{r.l}</dt>
                <dd className="font-medium text-foreground">{r.v}</dd>
              </div>
            ))}
          </dl>
        </Card>
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
                <tr key={l.id} className="border-b border-border/60">
                  <td className="py-2.5">
                    <Link
                      to="/app/$module/$id"
                      params={{ module: "leiloes", id: l.id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {l.numero}
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{l.organizador}</td>
                  <td className="py-2.5 text-muted-foreground">{l.data}</td>
                  <td className="py-2.5"><StatusPill value={l.status} /></td>
                  <td className="py-2.5 text-right font-semibold text-primary">{l.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-base font-semibold">Alertas</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {proximosAlertas.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
                  <div>
                    <p className="text-foreground">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground">{a.data}</p>
                  </div>
                  <StatusPill value={a.severidade} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-display text-base font-semibold">Jobs recentes</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {ultimosJobs.map((j) => (
                <li key={j.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                  <div>
                    <p className="text-foreground">{j.tipo} • {j.alvo}</p>
                    <p className="text-xs text-muted-foreground">{j.duracao}s</p>
                  </div>
                  <StatusPill value={j.status} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 font-display text-base font-semibold">Organizadores ativos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {organizadores.slice(0, 12).map((o) => (
            <Link
              key={o.id}
              to="/app/$module/$id"
              params={{ module: "organizadores", id: o.id }}
              className="rounded-lg border border-border bg-background p-3 text-center transition-colors hover:border-primary/40"
            >
              <p className="font-display text-sm font-semibold">{o.nome}</p>
              <p className="mt-1 text-xs text-muted-foreground">{o.leiloes} leilões</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

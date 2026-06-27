import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({ meta: [{ title: "Como funciona — 123Vendido" }] }),
  component: ComoFuncionaPage,
});

function ComoFuncionaPage() {
  const steps = [
    { t: "1. Coleta e estruturação", d: "Editais, lotes e veículos são coletados de organizadores e estruturados automaticamente." },
    { t: "2. Inteligência aplicada", d: "Aplicamos modelos de oportunidade, risco, precificação, liquidez e visão computacional sobre o catálogo." },
    { t: "3. Operação e decisão", d: "Você acompanha radar, favoritos, relatórios e resultados em um painel único." },
    { t: "4. Integração externa", d: "Toda a inteligência roda em um backend FastAPI dedicado — sem lógica de negócio no frontend." },
  ];
  return (
    <PublicPage
      eyebrow="Como funciona"
      title="Da coleta de editais à decisão de arremate."
      description="Quatro etapas conectadas para transformar dados públicos de leilões em decisões mensuráveis."
    >
      <ol className="not-prose mt-6 space-y-4">
        {steps.map((s) => (
          <li key={s.t} className="rounded-lg border border-border bg-surface p-5">
            <p className="font-display text-lg font-semibold text-foreground">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>
    </PublicPage>
  );
}

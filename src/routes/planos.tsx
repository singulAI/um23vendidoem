import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos — 123Vendido" }] }),
  component: PlanosPage,
});

const PLANS = [
  {
    nome: "Starter",
    preco: "R$ 99",
    desc: "Para quem está iniciando no mercado de leilões.",
    features: ["Radar de editais", "Até 50 lotes/mês", "Relatórios essenciais", "Suporte por e-mail"],
  },
  {
    nome: "Business",
    preco: "R$ 499",
    desc: "Operação completa com inteligência aplicada.",
    features: ["Tudo do Starter", "Lotes ilimitados", "Scores de oportunidade e risco", "Vision AI (em breve)", "Suporte prioritário"],
    highlight: true,
  },
  {
    nome: "Enterprise",
    preco: "Sob consulta",
    desc: "Para operações de grande escala e integrações personalizadas.",
    features: ["Tudo do Business", "Connectors dedicados", "Multi-tenant", "SLA dedicado", "Onboarding assistido"],
  },
];

function PlanosPage() {
  return (
    <PublicPage
      eyebrow="Planos"
      title="Escolha o plano certo para a sua operação."
      description="Todos os planos incluem o painel completo da 123Vendido. Mude de plano a qualquer momento."
    >
      <div className="not-prose mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.nome}
            className={
              "rounded-xl border p-6 " +
              (p.highlight
                ? "border-primary/60 bg-primary/5"
                : "border-border bg-surface")
            }
          >
            <p className="font-display text-xl font-semibold text-foreground">{p.nome}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <p className="mt-5 font-display text-3xl font-bold text-foreground">
              {p.preco}
              {p.preco.startsWith("R$") && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className={
                "mt-6 block rounded-md px-4 py-2 text-center text-sm font-semibold transition-colors " +
                (p.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border text-foreground hover:bg-background")
              }
            >
              Começar agora
            </Link>
          </div>
        ))}
      </div>
    </PublicPage>
  );
}

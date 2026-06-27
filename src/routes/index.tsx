import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Gavel,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { BrandIntro } from "@/components/brand/BrandIntro";
import { Logo123Vendido } from "@/components/brand/Logo123Vendido";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "123Vendido — Inteligência que antecede. Decisões que concluem." },
      {
        name: "description",
        content:
          "Plataforma SaaS de inteligência para leilões. Analise editais, mensure riscos e antecipe oportunidades antes do lance.",
      },
      { property: "og:title", content: "123Vendido — Inteligência que antecede." },
      {
        property: "og:description",
        content: "Analise antes de arrematar. Mais inteligência. Menos risco.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {!introDone && <BrandIntro onComplete={() => setIntroDone(true)} />}

      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px]"
        style={{ background: "var(--gradient-hero)" }}
      />

      <Navbar visible={introDone} />

      <main className="relative">
        <Hero visible={introDone} />
        <Stats />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ visible }: { visible: boolean }) {
  return (
    <motion.header
      className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <Logo123Vendido size={28} />
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <Link to="/sobre" className="hover:text-foreground transition-colors">Sobre</Link>
        <Link to="/como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link>
        <Link to="/planos" className="hover:text-foreground transition-colors">Planos</Link>
        <Link to="/contato" className="hover:text-foreground transition-colors">Contato</Link>
        <Link to="/ajuda" className="hover:text-foreground transition-colors">Ajuda</Link>
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
          <Link to="/auth">Entrar</Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          <Link to="/auth">Abrir plataforma</Link>
        </Button>

      </div>
    </motion.header>
  );
}

function Hero({ visible }: { visible: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="mx-auto max-w-4xl text-center"
      >



        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Inteligência que antecede.{" "}
          <span className="text-primary">Decisões que concluem.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Analise editais, mensure riscos e antecipe oportunidades antes do lance.
          A 123Vendido transforma dados de leilões em decisões precisas.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Analisar meu primeiro edital
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-surface hover:bg-surface/70">
            Ver demonstração
          </Button>
        </div>
      </motion.div>

      {/* mock dashboard preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="relative mx-auto mt-16 max-w-5xl"
      >
        <div
          className="rounded-2xl border border-border bg-surface p-2 shadow-2xl"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="rounded-xl border border-border bg-background p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <Logo123Vendido size={22} />
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Metric label="Oportunidades" value="128" />
              <Metric label="Editais analisados" value="842" />
              <Metric label="Taxa de Sucesso" value="68%" />
              <Metric label="Risco médio" value="23%" />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Oportunidades por categoria
                </p>
                <div className="mt-4 flex h-32 items-end gap-3">
                  {[60, 90, 45, 75, 50, 110, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 5 ? "var(--primary)" : "color-mix(in oklab, var(--primary) 25%, transparent)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Score de oportunidade
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold text-primary">87</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">Muito Alto</p>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[87%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function Stats() {
  const items = [
    { value: "842", label: "Editais processados" },
    { value: "68%", label: "Taxa de sucesso" },
    { value: "<2min", label: "Análise por edital" },
    { value: "23%", label: "Redução de risco" },
  ];
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="bg-background px-6 py-10 text-center">
            <p className="font-display text-3xl font-bold text-primary md:text-4xl">{s.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Análise de dados",
      desc: "Processamento automático de editais com extração estruturada de informações críticas.",
    },
    {
      icon: ShieldCheck,
      title: "Avaliação de riscos",
      desc: "Score proprietário que mensura liquidez, concorrência e probabilidade de retorno.",
    },
    {
      icon: Target,
      title: "Precisão algorítmica",
      desc: "Modelos treinados em centenas de milhares de leilões para identificar padrões reais.",
    },
    {
      icon: TrendingUp,
      title: "Decisão estratégica",
      desc: "Recomendações claras: arrematar, observar ou descartar — com justificativa.",
    },
    {
      icon: Gavel,
      title: "Cobertura ampla",
      desc: "Imóveis, veículos, equipamentos e ativos diversos em leilões judiciais e extrajudiciais.",
    },
    {
      icon: Sparkles,
      title: "Oportunidades relevantes",
      desc: "Curadoria inteligente que filtra ruído e entrega apenas o que vale o seu tempo.",
    },
  ];
  return (
    <section id="plataforma" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Plataforma 123Vendido
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
          Mais inteligência. Menos risco.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Tudo o que você precisa para transformar dados em decisões — antes do lance.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="bg-background p-6 transition-colors hover:bg-surface">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contato" className="mx-auto max-w-7xl px-6 pb-24">
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 text-center md:p-16"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Seu próximo arremate começa <span className="text-primary">com informação.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Comece grátis. Analise editais reais. Decida com a precisão de quem tem dados do seu lado.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Criar conta gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-background hover:bg-background/70">
              Falar com vendas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <Logo123Vendido size={24} />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Inteligência que antecede. Decisões que concluem.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/sobre" className="hover:text-foreground">Sobre</Link>
          <Link to="/planos" className="hover:text-foreground">Planos</Link>
          <Link to="/ajuda" className="hover:text-foreground">Ajuda</Link>
          <Link to="/contato" className="hover:text-foreground">Contato</Link>
          <Link to="/lgpd" className="hover:text-foreground">LGPD</Link>
          <Link to="/termos" className="hover:text-foreground">Termos</Link>
          <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} 123Vendido. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

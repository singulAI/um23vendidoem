import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre — 123Vendido" }] }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <PublicPage
      eyebrow="Sobre"
      title="A 123Vendido nasceu para antecipar decisões em leilões."
      description="Combinamos inteligência de dados, automação e análise especializada para que arrematantes e operadores tomem decisões com confiança."
    >
      <p>
        A 123Vendido é uma plataforma SaaS de inteligência para leilões: agregamos editais
        de organizadores públicos e privados, estruturamos lotes e veículos, e aplicamos
        modelos de oportunidade, risco, precificação e liquidez sobre cada lance.
      </p>
      <h2>Nosso propósito</h2>
      <p>
        Reduzir a assimetria de informação do mercado de leilões — entregando análises
        consistentes, rastreáveis e auditáveis a quem opera no setor.
      </p>
      <h2>Como atuamos</h2>
      <ul>
        <li>Coleta automatizada de editais e documentos.</li>
        <li>Estruturação de lotes, veículos e cronogramas.</li>
        <li>Scores de oportunidade, risco e liquidez.</li>
        <li>Acompanhamento contínuo do mercado e do desempenho da carteira.</li>
      </ul>
    </PublicPage>
  );
}

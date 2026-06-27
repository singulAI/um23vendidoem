import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de Uso — 123Vendido" }] }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <PublicPage eyebrow="Termos de uso" title="Termos de uso da plataforma 123Vendido.">
      <p>
        Estes termos regem o uso da plataforma 123Vendido. Ao utilizar o serviço, o
        usuário concorda com as condições aqui descritas.
      </p>
      <h2>1. Objeto</h2>
      <p>
        A 123Vendido oferece um painel de inteligência para acompanhamento de leilões.
        As análises são estimativas e não substituem due diligence jurídica e mecânica.
      </p>
      <h2>2. Conta e acesso</h2>
      <p>
        O usuário é responsável pela confidencialidade de suas credenciais e por toda
        atividade realizada com sua conta.
      </p>
      <h2>3. Pagamento</h2>
      <p>Assinaturas são recorrentes e cobradas conforme o plano contratado.</p>
      <h2>4. Limitação de responsabilidade</h2>
      <p>
        A 123Vendido não se responsabiliza por decisões de arremate tomadas pelo usuário.
        Os scores são indicadores, não recomendações de investimento.
      </p>
      <h2>5. Disposições gerais</h2>
      <p>
        Estes termos podem ser atualizados periodicamente; mudanças relevantes serão
        comunicadas no painel.
      </p>
    </PublicPage>
  );
}

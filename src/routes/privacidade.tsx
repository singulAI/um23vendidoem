import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Política de Privacidade — 123Vendido" }] }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <PublicPage
      eyebrow="Privacidade"
      title="Política de Privacidade."
      description="Descrevemos quais dados coletamos, como tratamos e quais são seus direitos."
    >
      <h2>Dados coletados</h2>
      <ul>
        <li>Dados de cadastro: nome, e-mail, telefone, empresa.</li>
        <li>Dados de uso: interações com o painel, preferências e logs de acesso.</li>
        <li>Dados de pagamento: processados por terceiros certificados PCI.</li>
      </ul>
      <h2>Uso dos dados</h2>
      <p>
        Os dados são utilizados para operação do serviço, suporte, faturamento,
        segurança e melhoria contínua da plataforma.
      </p>
      <h2>Compartilhamento</h2>
      <p>
        Compartilhamos dados apenas com processadores essenciais (autenticação,
        pagamentos, infraestrutura) e quando exigido por lei.
      </p>
      <h2>Cookies</h2>
      <p>Usamos cookies estritamente necessários e cookies analíticos anonimizados.</p>
      <h2>Contato</h2>
      <p>
        Em caso de dúvidas, escreva para <strong>privacidade@123vendido.com.br</strong>.
      </p>
    </PublicPage>
  );
}

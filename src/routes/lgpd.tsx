import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/lgpd")({
  head: () => ({ meta: [{ title: "LGPD — 123Vendido" }] }),
  component: LgpdPage,
});

function LgpdPage() {
  return (
    <PublicPage
      eyebrow="LGPD"
      title="Conformidade com a Lei Geral de Proteção de Dados."
      description="A 123Vendido segue os princípios da LGPD (Lei nº 13.709/2018) no tratamento de dados pessoais."
    >
      <h2>Encarregado de dados (DPO)</h2>
      <p>Contato do encarregado: <strong>dpo@123vendido.com.br</strong>.</p>

      <h2>Seus direitos</h2>
      <ul>
        <li>Confirmação da existência de tratamento.</li>
        <li>Acesso e correção de dados.</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
        <li>Portabilidade dos dados.</li>
        <li>Revogação do consentimento.</li>
      </ul>

      <h2>Como exercer seus direitos</h2>
      <p>
        Solicite o exercício de qualquer direito previsto na LGPD enviando um e-mail
        para o encarregado, descrevendo o pedido e anexando documento de identificação.
      </p>

      <h2>Bases legais</h2>
      <p>
        Tratamos dados com base em execução de contrato, cumprimento de obrigação
        legal, exercício regular de direitos e legítimo interesse, conforme o caso.
      </p>
    </PublicPage>
  );
}

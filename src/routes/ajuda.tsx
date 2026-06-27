import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/ajuda")({
  head: () => ({ meta: [{ title: "Ajuda — 123Vendido" }] }),
  component: AjudaPage,
});

const FAQ = [
  {
    q: "Como funciona o radar de editais?",
    a: "O radar monitora continuamente os organizadores cadastrados e emite alertas quando há novos editais, erratas ou mudanças relevantes.",
  },
  {
    q: "Os scores são automatizados?",
    a: "Sim. Os scores de oportunidade, risco, precificação e liquidez são calculados pelo nosso backend a partir de modelos próprios e dados públicos.",
  },
  {
    q: "Posso integrar via API?",
    a: "Sim. Clientes Business e Enterprise têm acesso ao Developer Center para gerenciar chaves de API, webhooks e tokens.",
  },
  {
    q: "Como faço para cancelar?",
    a: "Você pode cancelar a qualquer momento no menu Minha Conta. O acesso permanece ativo até o fim do período já pago.",
  },
];

function AjudaPage() {
  return (
    <PublicPage
      eyebrow="Central de ajuda"
      title="Perguntas frequentes."
      description="Não encontrou o que procura? Fale com o nosso time pela página de contato."
    >
      <div className="not-prose mt-8 space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-lg border border-border bg-surface p-5 open:border-primary/40"
          >
            <summary className="cursor-pointer list-none font-display text-base font-semibold text-foreground">
              {item.q}
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </PublicPage>
  );
}

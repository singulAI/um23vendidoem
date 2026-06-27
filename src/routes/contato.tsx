import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PublicPage } from "@/components/public/PublicPage";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — 123Vendido" }] }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sent, setSent] = useState(false);
  return (
    <PublicPage
      eyebrow="Contato"
      title="Vamos conversar."
      description="Envie sua mensagem — respondemos em até 1 dia útil."
    >
      <div className="not-prose mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border border-border bg-surface p-6">
          {sent ? (
            <p className="text-sm text-foreground">
              Mensagem enviada. Em breve nosso time entrará em contato.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <Field label="Nome" name="nome" required />
              <Field label="E-mail" name="email" type="email" required />
              <Field label="Empresa" name="empresa" />
              <Field label="Telefone" name="telefone" />
              <div className="sm:col-span-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-muted-foreground">Mensagem</span>
                  <textarea
                    name="mensagem"
                    rows={5}
                    required
                    className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
                  />
                </label>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Enviar mensagem
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-3 rounded-xl border border-border bg-surface p-6 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" /> contato@123vendido.com.br
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" /> +55 (11) 0000-0000
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> São Paulo · Brasil
          </p>
        </aside>
      </div>
    </PublicPage>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
      />
    </label>
  );
}

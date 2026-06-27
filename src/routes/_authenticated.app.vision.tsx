import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Eye, ImagePlus, Sparkles, X } from "lucide-react";
import { Card, EmptyState, PageHeader, SkeletonRows, StatusPill } from "@/components/app/Primitives";
import { services } from "@/services";
import type { GenericRow } from "@/services/interfaces";

export const Route = createFileRoute("/_authenticated/app/vision")({
  head: () => ({ meta: [{ title: "Vision AI — 123Vendido" }] }),
  component: VisionPage,
});

// Toggled by backend feature-flag `vision.enabled`. Defaults to disabled.
const VISION_ENABLED = false;

function VisionPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [lote, setLote] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [extras, setExtras] = useState("");

  const [history, setHistory] = useState<GenericRow[] | null>(null);
  useEffect(() => {
    services.resources.vision.list({ pageSize: 20 }).then((r) => setHistory(r.data));
  }, []);

  return (
    <div>
      <PageHeader
        title="Vision AI"
        description="Envie imagens de um lote para receber uma estimativa de reparo gerada pelo backend."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300">
          <Eye className="h-3.5 w-3.5" /> {VISION_ENABLED ? "Habilitado" : "Indisponível"}
        </span>
      </PageHeader>

      {!VISION_ENABLED && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <div className="text-muted-foreground">
            <p className="font-medium text-foreground">Funcionalidade desabilitada</p>
            <p className="mt-1">
              A análise por visão computacional será habilitada após a integração com o
              backend FastAPI e a ativação da feature flag <code>vision.enabled</code>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Nova análise</h2>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-8 text-center hover:border-primary/40">
              <ImagePlus className="mb-2 h-7 w-7 text-primary" />
              <p className="font-display text-sm font-semibold text-foreground">
                Selecione imagens do lote
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG ou WebP</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {files.map((f, i) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-background">
                      <img src={url} alt={f.name} className="h-full w-full object-cover" />
                      <button
                        onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <Field label="Link do lote">
              <input
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                placeholder="ex.: /app/lotes/123"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </Field>

            <Field label="Observações do usuário">
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                placeholder="O que você observou ao avaliar o lote?"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </Field>

            <Field label="Informações adicionais">
              <textarea
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                rows={2}
                placeholder="Contexto adicional para o modelo (opcional)."
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </Field>

            <button
              disabled={!VISION_ENABLED}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              title={VISION_ENABLED ? "Enviar para análise" : "Indisponível até integração com o backend."}
            >
              <Sparkles className="h-4 w-4" /> Analisar com Vision AI
            </button>

            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Aviso legal:</strong> a análise é apenas
              uma estimativa baseada nas informações fornecidas e não substitui inspeção
              presencial, laudo mecânico ou parecer técnico.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-base font-semibold">Resultado</h2>
            <div className="mt-3 space-y-3 text-sm">
              <Row label="Estimativa média de reparo" value={VISION_ENABLED ? "—" : "Indisponível"} />
              <Row
                label="Grau de confiança"
                value={
                  <StatusPill value={VISION_ENABLED ? "Aguardando" : "Indisponível"} />
                }
              />
              <Row label="Itens identificados" value="—" />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-base font-semibold">Histórico</h2>
            <div className="mt-3">
              {history === null ? (
                <SkeletonRows />
              ) : history.length === 0 ? (
                <EmptyState title="Sem análises ainda" hint="As análises realizadas aparecerão aqui." />
              ) : (
                <ul className="space-y-2 text-sm">
                  {history.map((h) => (
                    <li key={String(h.id)} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                      <span className="text-foreground">{String(h.nome ?? h.id)}</span>
                      <span className="text-xs text-muted-foreground">{String(h.data ?? "")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

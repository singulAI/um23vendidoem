import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { ModuleConfig } from "@/lib/modules";
import { Card, EmptyState, PageHeader, SkeletonRows, StatusPill } from "./Primitives";
import { services } from "@/services";
import type { GenericRow } from "@/services/interfaces";

function useResource(moduleKey: string, id: string | undefined) {
  const [row, setRow] = useState<GenericRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const svc = services.resources[moduleKey];
    if (!svc || !id) {
      setRow(null);
      setLoading(false);
      return;
    }
    svc
      .getById(id)
      .then((r) => !cancelled && setRow(r))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [moduleKey, id]);
  return { row, loading };
}

export function ModuleDetailPage({ module, id }: { module: ModuleConfig; id: string }) {
  const { row, loading } = useResource(module.key, id);

  if (loading) {
    return (
      <div>
        <BackLink module={module} />
        <Card><SkeletonRows /></Card>
      </div>
    );
  }

  if (!row) {
    return (
      <div>
        <BackLink module={module} />
        <EmptyState title="Registro não encontrado" hint="Pode ter sido removido ou o identificador está incorreto." />
      </div>
    );
  }


  const titleCol = module.columns[0];
  const title = titleCol.format ? titleCol.format(row[titleCol.key]) : String(row[titleCol.key] ?? "");

  return (
    <div>
      <BackLink module={module} />
      <PageHeader title={title} description={`${module.label} • ${id}`}>
        <Link
          to="/app/$module/$id/edit"
          params={{ module: module.key, id }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4" /> Editar
        </Link>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/20">
          <Trash2 className="h-4 w-4" /> Remover
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold">Resumo</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {module.columns.map((c) => {
              const formatted = c.format ? c.format(row[c.key]) : String(row[c.key] ?? "—");
              const isStatus = ["status", "severidade", "liquidez"].includes(c.key);
              return (
                <div key={c.key} className="flex items-center justify-between border-b border-border/50 py-2 text-sm">
                  <dt className="text-muted-foreground">{c.label}</dt>
                  <dd>{isStatus ? <StatusPill value={formatted} /> : <span className="text-foreground">{formatted}</span>}</dd>
                </div>
              );
            })}
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-base font-semibold">Timeline</h2>
          <ol className="space-y-3 text-sm">
            {[
              { t: "Há 2h", e: "Registro atualizado" },
              { t: "Há 1d", e: "Documento anexado" },
              { t: "Há 3d", e: "Criado por sistema" },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-foreground">{item.e}</p>
                  <p className="text-xs text-muted-foreground">{item.t}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 font-display text-base font-semibold">Dados brutos</h2>
        <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 text-xs text-muted-foreground">
{JSON.stringify(row, null, 2)}
        </pre>
      </Card>
    </div>
  );
}

function BackLink({ module }: { module: ModuleConfig }) {
  return (
    <Link
      to="/app/$module"
      params={{ module: module.key }}
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> Voltar para {module.label}
    </Link>
  );
}

export function ModuleFormPage({
  module,
  id,
  mode,
}: {
  module: ModuleConfig;
  id?: string;
  mode: "new" | "edit";
}) {
  const navigate = useNavigate();
  const { row: existing } = useResource(module.key, mode === "edit" ? id : undefined);
  const isEdit = mode === "edit";


  return (
    <div className="mx-auto max-w-3xl">
      <BackLink module={module} />
      <PageHeader
        title={isEdit ? `Editar ${module.label}` : `Novo ${module.label}`}
        description={isEdit ? `Atualize os campos do registro ${id}` : `Crie um novo registro em ${module.label}`}
      />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/app/$module", params: { module: module.key } });
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {module.fields.map((f) => {
            const defaultValue = existing ? String(existing[f.key] ?? "") : "";
            return (
              <label key={f.key} className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">{f.label}</span>
                {f.type === "select" ? (
                  <select
                    defaultValue={defaultValue}
                    className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
                  >
                    <option value="">Selecione...</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    defaultValue={defaultValue}
                    rows={4}
                    className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
                  />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    defaultValue={defaultValue}
                    className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
                  />
                )}
              </label>
            );
          })}

          <div className="col-span-full mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/app/$module", params: { module: module.key } })}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isEdit ? "Salvar alterações" : "Criar registro"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

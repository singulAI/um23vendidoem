import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload as UploadIcon,
  XCircle,
} from "lucide-react";
import { Card, EmptyState, PageHeader, SkeletonRows, StatusPill } from "@/components/app/Primitives";
import { services } from "@/services";
import type { GenericRow } from "@/services/interfaces";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/uploads")({
  head: () => ({ meta: [{ title: "Upload Center — 123Vendido" }] }),
  component: UploadCenterPage,
});

type Tab = "editais" | "lotes" | "imagens" | "csv" | "xlsx" | "historico" | "fila" | "logs";
const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: "editais", label: "Editais (PDF)", icon: FileText },
  { key: "lotes", label: "Lotes", icon: FileText },
  { key: "imagens", label: "Imagens", icon: ImageIcon },
  { key: "csv", label: "CSV", icon: FileSpreadsheet },
  { key: "xlsx", label: "XLSX", icon: FileSpreadsheet },
  { key: "historico", label: "Histórico", icon: Clock },
  { key: "fila", label: "Fila", icon: Loader2 },
  { key: "logs", label: "Logs", icon: CheckCircle2 },
];

function UploadCenterPage() {
  const [tab, setTab] = useState<Tab>("editais");

  return (
    <div>
      <PageHeader
        title="Upload Center"
        description="Envio centralizado de editais, lotes, imagens e planilhas. Todo o processamento é executado pelo backend."
      />

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {tab === "historico" ? (
            <UploadHistory />
          ) : tab === "fila" ? (
            <UploadQueue />
          ) : tab === "logs" ? (
            <UploadLogs />
          ) : (
            <Dropzone kind={tab} />
          )}
        </div>
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Nenhum processamento é executado no navegador. Os arquivos são enviados ao backend
        para parsing, OCR e indexação.
      </p>
    </div>
  );
}

function Dropzone({ kind }: { kind: Tab }) {
  const [files, setFiles] = useState<File[]>([]);
  const accept =
    kind === "imagens"
      ? "image/*"
      : kind === "csv"
        ? ".csv"
        : kind === "xlsx"
          ? ".xlsx"
          : kind === "editais"
            ? "application/pdf"
            : undefined;

  return (
    <div>
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-10 text-center transition-colors hover:border-primary/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFiles((p) => [...p, ...Array.from(e.dataTransfer.files)]);
        }}
      >
        <UploadIcon className="mb-3 h-8 w-8 text-primary" />
        <p className="font-display text-lg font-semibold text-foreground">
          Arraste e solte arquivos aqui
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          ou clique para selecionar — tipo: {kind}
        </p>
        <input
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) =>
            setFiles((p) => [...p, ...Array.from(e.target.files ?? [])])
          }
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pré-visualização ({files.length})
          </p>
          <ul className="divide-y divide-border rounded-md border border-border bg-background text-sm">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="truncate text-foreground">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setFiles([])}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Limpar
            </button>
            <button
              disabled
              title="Disponível após integração com o backend."
              className="cursor-not-allowed rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground opacity-60"
            >
              Enviar para processamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadHistory() {
  const [rows, setRows] = useState<GenericRow[] | null>(null);
  useEffect(() => {
    services.resources.uploads.list({ pageSize: 50 }).then((r) => setRows(r.data));
  }, []);
  if (!rows) return <SkeletonRows />;
  if (rows.length === 0) return <EmptyState title="Sem uploads ainda" hint="Envie um arquivo para começar." />;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
          <th className="py-2 font-medium">Arquivo</th>
          <th className="py-2 font-medium">Descrição</th>
          <th className="py-2 font-medium">Status</th>
          <th className="py-2 font-medium">Data</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={String(r.id)} className="border-b border-border/60">
            <td className="py-2.5 text-foreground">{String(r.nome ?? r.id)}</td>
            <td className="py-2.5 text-muted-foreground">{String(r.descricao ?? "")}</td>
            <td className="py-2.5"><StatusPill value={String(r.status ?? "")} /></td>
            <td className="py-2.5 text-muted-foreground">{String(r.data ?? "")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UploadQueue() {
  return (
    <div className="space-y-2 text-sm">
      {[
        { f: "edital-2025-04.pdf", p: 78, s: "Processando" },
        { f: "lotes-leilao-22.csv", p: 100, s: "Concluído" },
        { f: "fotos-lote-104.zip", p: 32, s: "Processando" },
        { f: "planilha-veiculos.xlsx", p: 0, s: "Aguardando" },
      ].map((q) => (
        <div key={q.f} className="rounded-md border border-border bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground">{q.f}</span>
            <StatusPill value={q.s} />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-primary" style={{ width: `${q.p}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function UploadLogs() {
  return (
    <ul className="space-y-2 text-sm">
      {[
        { ok: true, m: "edital-2025-04.pdf · 184 lotes extraídos" },
        { ok: true, m: "lotes-leilao-22.csv · 312 linhas importadas" },
        { ok: false, m: "fotos-lote-104.zip · arquivo corrompido (item 12)" },
        { ok: true, m: "planilha-veiculos.xlsx · agendado para 14:30" },
      ].map((l, i) => (
        <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-background p-3">
          {l.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 text-rose-400" />
          )}
          <span className="text-muted-foreground">{l.m}</span>
        </li>
      ))}
    </ul>
  );
}

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-xl border border-border bg-surface/60 p-5 shadow-sm backdrop-blur-sm",
        className,
      )}
    />
  );
}

export function StatusPill({ value }: { value: string }) {
  const v = value.toLowerCase();
  const tone =
    v.includes("online") || v.includes("ativ") || v.includes("aberto") || v.includes("concluí") || v.includes("pago")
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : v.includes("degrad") || v.includes("pend") || v.includes("execu") || v.includes("trial") || v.includes("breve") || v.includes("revis")
        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
        : v.includes("offline") || v.includes("falha") || v.includes("cancel") || v.includes("inadim") || v.includes("estorn") || v.includes("revog")
          ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
          : "bg-primary/10 text-primary border-primary/30";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", tone)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="font-display text-xl font-bold">∅</span>
      </div>
      <p className="font-display text-lg font-semibold">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface", className)} />;
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

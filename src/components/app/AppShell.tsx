import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronRight, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Logo123Vendido } from "@/components/brand/Logo123Vendido";
import { NAV_GROUPS, MODULES_BY_KEY } from "@/lib/modules";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const seg = pathname.replace(/^\/app\/?/, "").split("/").filter(Boolean);
  const activeKey = seg[0] || "dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface/60 backdrop-blur transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link to="/app"><Logo123Vendido size={22} /></Link>
        </div>
        <nav className="flex h-[calc(100vh-4rem)] flex-col gap-6 overflow-y-auto p-4 text-sm">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const to = item.key === "dashboard" ? "/app" : `/app/${item.key}`;
                  const active = item.key === activeKey || (item.key === "dashboard" && activeKey === "dashboard");
                  const Icon = item.icon;
                  return (
                    <li key={item.key}>
                      <Link
                        to={to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-muted-foreground hover:bg-surface lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumbs segments={seg} />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground md:flex md:w-72">
              <Search className="h-4 w-4" />
              <input
                placeholder="Buscar em toda a plataforma..."
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
              />
              <kbd className="rounded border border-border bg-background px-1.5 text-[10px]">⌘K</kbd>
            </div>
            <button className="relative rounded-md border border-border bg-surface p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              AC
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

function Breadcrumbs({ segments }: { segments: string[] }) {
  const crumbs: { label: string; to: string }[] = [{ label: "Plataforma", to: "/app" }];
  if (segments[0]) {
    const mod = MODULES_BY_KEY[segments[0]];
    crumbs.push({ label: mod?.label ?? segments[0], to: `/app/${segments[0]}` });
  }
  if (segments[1] === "new") crumbs.push({ label: "Novo", to: "#" });
  else if (segments[1]) crumbs.push({ label: segments[1], to: "#" });
  if (segments[2] === "edit") crumbs.push({ label: "Editar", to: "#" });

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
          <span className={cn(i === crumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground")}>
            {c.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronRight, LogOut, Menu, Search, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Logo123Vendido } from "@/components/brand/Logo123Vendido";
import { NAV_GROUPS, MODULES_BY_KEY } from "@/lib/modules";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const seg = pathname.replace(/^\/app\/?/, "").split("/").filter(Boolean);


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
        <nav className="flex h-[calc(100vh-4rem)] flex-col gap-5 overflow-y-auto p-4 text-sm">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.sections.map((section, sIdx) => (
                <ul key={sIdx} className="space-y-0.5">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.to ||
                      (item.to !== "/app" && pathname.startsWith(item.to));
                    const Icon = item.icon;
                    return (
                      <li key={item.key}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-surface hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ))}
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
            <UserMenu />
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

const SPECIAL_LABELS: Record<string, string> = {
  perfil: "Meu Perfil",
  uploads: "Upload Center",
  vision: "Vision AI",
};

function Breadcrumbs({ segments }: { segments: string[] }) {
  const crumbs: { label: string; to: string }[] = [{ label: "Plataforma", to: "/app" }];
  if (segments[0]) {
    const label =
      SPECIAL_LABELS[segments[0]] ?? MODULES_BY_KEY[segments[0]]?.label ?? segments[0];
    crumbs.push({ label, to: `/app/${segments[0]}` });
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


function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = (profile?.display_name ?? user?.email ?? "??")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            initials || "?"
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm">{profile?.display_name ?? "Usuário"}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/app/perfil" })}>
          <UserCircle2 className="mr-2 h-4 w-4" /> Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            navigate({ to: "/auth", replace: true });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

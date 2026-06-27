import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { uploadUserFile } from "@/lib/storage";
import { PageHeader, Card } from "@/components/app/Primitives";

export const Route = createFileRoute("/_authenticated/app/perfil")({
  head: () => ({ meta: [{ title: "Perfil — 123Vendido" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, preferences, roles, updateProfile, updatePreferences, loading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (!user) return null;

  const initials = (profile?.display_name ?? user.email ?? "?")
    .split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");

  return (
    <div className="space-y-8">
      <PageHeader title="Perfil" description="Gerencie seus dados, avatar e preferências." />

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Conta</h2>
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xl font-semibold text-primary">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (initials || "?")}
          </div>
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const { publicUrl } = await uploadUserFile("avatars", user.id, file, `avatar.${file.name.split(".").pop()}`);
                  await updateProfile({ avatar_url: `${publicUrl}?t=${Date.now()}` });
                  toast.success("Avatar atualizado");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setUploading(false);
                }
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "Enviando..." : "Trocar avatar"}
            </Button>
            <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP — até 2 MB.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={user.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nome de exibição</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Papéis</Label>
            <div className="flex flex-wrap gap-2">
              {roles.length === 0 && <span className="text-xs text-muted-foreground">Sem papéis</span>}
              {roles.map((r) => (
                <span key={r} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{r}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try { await updateProfile({ display_name: displayName }); toast.success("Perfil atualizado"); }
              catch (err) { toast.error((err as Error).message); }
              finally { setSaving(false); }
            }}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Preferências</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Sidebar recolhida por padrão</p>
              <p className="text-xs text-muted-foreground">Aplicado ao abrir a plataforma</p>
            </div>
            <Switch
              checked={preferences?.sidebar_collapsed ?? false}
              onCheckedChange={(v) => updatePreferences({ sidebar_collapsed: v }).catch((e) => toast.error(e.message))}
            />
          </div>
          <div className="grid gap-2 md:max-w-xs">
            <Label htmlFor="lang">Idioma</Label>
            <Input
              id="lang"
              value={preferences?.language ?? "pt-BR"}
              onChange={(e) => updatePreferences({ language: e.target.value }).catch(() => {})}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

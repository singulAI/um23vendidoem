import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo123Vendido } from "@/components/brand/Logo123Vendido";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Nova senha — 123Vendido" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        className="w-full max-w-md space-y-5 rounded-xl border border-border bg-surface/60 p-6 backdrop-blur"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const { error } = await supabase.auth.updateUser({ password });
          setLoading(false);
          if (error) return toast.error(error.message);
          toast.success("Senha atualizada com sucesso.");
          navigate({ to: "/auth", replace: true });
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <Logo123Vendido size={24} />
          <h1 className="text-lg font-semibold">Definir nova senha</h1>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-pass">Nova senha</Label>
          <Input id="new-pass" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</Button>
      </form>
    </div>
  );
}

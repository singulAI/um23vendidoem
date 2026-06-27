import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Plataforma — 123Vendido" }] }),
  component: AppShell,
});

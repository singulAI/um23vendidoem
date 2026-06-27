import { createFileRoute, notFound } from "@tanstack/react-router";
import { ModuleListPage } from "@/components/app/ModuleListPage";
import { MODULES_BY_KEY } from "@/lib/modules";

export const Route = createFileRoute("/_authenticated/app/$module")({
  loader: ({ params }) => {
    const mod = MODULES_BY_KEY[params.module];
    if (!mod) throw notFound();
    return { moduleKey: params.module };
  },
  head: ({ params }) => ({
    meta: [{ title: `${MODULES_BY_KEY[params.module]?.label ?? "Módulo"} — 123Vendido` }],
  }),
  component: ModuleListRoute,
});

function ModuleListRoute() {
  const { moduleKey } = Route.useLoaderData();
  return <ModuleListPage module={MODULES_BY_KEY[moduleKey]} />;
}

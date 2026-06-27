import { createFileRoute, notFound } from "@tanstack/react-router";
import { ModuleDetailPage, ModuleFormPage } from "@/components/app/ModuleDetailPage";
import { MODULES_BY_KEY } from "@/lib/modules";

export const Route = createFileRoute("/_authenticated/app/$module/$id")({
  loader: ({ params }) => {
    const mod = MODULES_BY_KEY[params.module];
    if (!mod) throw notFound();
    return { moduleKey: params.module, id: params.id };
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.id} — ${MODULES_BY_KEY[params.module]?.label ?? ""} — 123Vendido` }],
  }),
  component: DetailRoute,
});

function DetailRoute() {
  const { moduleKey, id } = Route.useLoaderData();
  const module = MODULES_BY_KEY[moduleKey];
  if (id === "new") return <ModuleFormPage module={module} mode="new" />;
  return <ModuleDetailPage module={module} id={id} />;
}

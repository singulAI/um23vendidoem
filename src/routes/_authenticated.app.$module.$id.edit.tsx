import { createFileRoute, notFound } from "@tanstack/react-router";
import { ModuleFormPage } from "@/components/app/ModuleDetailPage";
import { MODULES_BY_KEY } from "@/lib/modules";

export const Route = createFileRoute("/app/$module/$id/edit")({
  loader: ({ params }) => {
    const mod = MODULES_BY_KEY[params.module];
    if (!mod) throw notFound();
    return { moduleKey: params.module, id: params.id };
  },
  head: () => ({ meta: [{ title: "Editar — 123Vendido" }] }),
  component: EditRoute,
});

function EditRoute() {
  const { moduleKey, id } = Route.useLoaderData();
  return <ModuleFormPage module={MODULES_BY_KEY[moduleKey]} id={id} mode="edit" />;
}

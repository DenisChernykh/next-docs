import { getCatalogItemWithVariant } from "@/entities/catalog-item/model";
import { createPreviewDocument } from "@/entities/catalog-item/model/preview-document";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ kind: string; slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { kind, slug } = await context.params;

  if (kind !== "block" && kind !== "component") {
    return new Response("Not found", { status: 404 });
  }

  const variant = new URL(request.url).searchParams.get("variant");
  const item = await getCatalogItemWithVariant(kind, slug, variant);

  if (!item) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(createPreviewDocument(item), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

import path from "node:path";

import { getBlockItems } from "./blocks";
import { getFoundationItems } from "./foundation";
import { readCatalogSource } from "./read-source";
import type { CatalogItem, CatalogKind } from "./types";

export async function getCatalogItems(): Promise<CatalogItem[]> {
  const [blocks, components] = await Promise.all([
    getBlockItems(),
    getFoundationItems(),
  ]);

  return [...blocks, ...components];
}

export async function getCatalogItem(kind: CatalogKind, slug: string) {
  const items = await getCatalogItems();
  return items.find((item) => item.kind === kind && item.slug === slug) ?? null;
}

export async function getDefaultCatalogItem() {
  const items = await getCatalogItems();
  return items.find((item) => item.kind === "block") ?? items[0] ?? null;
}

export async function getCatalogItemWithVariant(
  kind: CatalogKind,
  slug: string,
  variantSlug?: string | null,
) {
  const item = await getCatalogItem(kind, slug);
  if (!item || !variantSlug) return item;

  const example = item.examples.find((entry) => entry.slug === variantSlug);
  if (example) {
    return {
      ...item,
      preview: example.preview,
      sources: example.sources,
    };
  }

  const variant = item.variants.find((entry) => entry.slug === variantSlug);
  if (!variant) return item;

  const html = await readCatalogSource(item.sourceDir, "html", variant.htmlFile);

  return {
    ...item,
    preview: { html: html?.content ?? item.preview.html, variantSlug },
    sources: { ...item.sources, html },
  };
}

export function getItemRouteParams(item: CatalogItem) {
  return {
    kind: item.kind === "block" ? "blocks" : "components",
    slug: path.basename(item.slug),
  };
}

import fs from "node:fs/promises";
import path from "node:path";

import { blocksRoot, getKindHref } from "./paths";
import { readCatalogSource } from "./read-source";
import { hydrateReelsDemo } from "./reels-demo";
import type {
  BlockManifest,
  CatalogExample,
  CatalogItem,
  CatalogSource,
  CatalogVariant,
} from "./types";

async function readManifest(dir: string): Promise<BlockManifest> {
  const raw = await fs.readFile(path.join(dir, "manifest.json"), "utf8");
  return JSON.parse(raw) as BlockManifest;
}

function mapVariants(manifest: BlockManifest): CatalogVariant[] {
  return (manifest.variants ?? [])
    .map((variant) => ({
      slug: variant.variantId,
      title: variant.title ?? variant.variantId,
      description: variant.description ?? "",
      htmlFile: variant.source?.demoHtml ?? "",
    }))
    .filter((variant) => variant.htmlFile);
}

function getDefaultHtmlFile(manifest: BlockManifest, variants: CatalogVariant[]) {
  return manifest.source.demoHtml ?? variants[0]?.htmlFile ?? null;
}

async function readBlockHtml(dir: string, slug: string, fileName: string | null) {
  const source = await readCatalogSource(dir, "html", fileName);
  if (!source || slug !== "reels") return source;

  return {
    ...source,
    content: await hydrateReelsDemo(dir, source.content),
  };
}

function createExample(
  slug: string,
  title: string,
  description: string,
  html: CatalogSource | undefined,
  commonSources: Omit<CatalogExample["sources"], "html">,
): CatalogExample {
  return {
    slug,
    title,
    description,
    preview: { html: html?.content ?? "", variantSlug: slug === "default" ? undefined : slug },
    sources: { ...commonSources, html },
  };
}

async function mapBlock(slug: string): Promise<CatalogItem> {
  const dir = path.join(blocksRoot, slug);
  const manifest = await readManifest(dir);
  const variants = mapVariants(manifest);
  const htmlFile = getDefaultHtmlFile(manifest, variants);
  const html = await readBlockHtml(dir, manifest.blockId, htmlFile);
  const php = await readCatalogSource(dir, "php", manifest.source.blade);
  const scss = await readCatalogSource(dir, "scss", manifest.source.scss);
  const js = await readCatalogSource(dir, "js", manifest.source.js);
  const commonSources = { php, scss, js };
  const examples = variants.length
    ? await Promise.all(
        variants.map(async (variant) => {
          const variantHtml = await readBlockHtml(dir, manifest.blockId, variant.htmlFile);
          return createExample(
            variant.slug,
            variant.title,
            variant.description,
            variantHtml,
            commonSources,
          );
        }),
      )
    : [createExample("default", manifest.title, manifest.description, html, commonSources)];
  const firstExample = examples[0];

  return {
    kind: "block",
    slug: manifest.blockId,
    title: manifest.title,
    description: manifest.description,
    status: manifest.status,
    href: getKindHref("block", manifest.blockId),
    sourceDir: dir,
    variants,
    preview: firstExample.preview,
    examples,
    sources: firstExample.sources,
  };
}

export async function getBlockItems(): Promise<CatalogItem[]> {
  const entries = await fs.readdir(blocksRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return Promise.all(slugs.map(mapBlock));
}

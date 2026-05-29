export type CatalogKind = "block" | "component";

export type CodeLanguage = "html" | "php" | "scss" | "js";

export type CatalogSource = {
  language: CodeLanguage;
  label: string;
  relativePath: string | null;
  content: string;
  isMissing?: boolean;
};

export type CatalogVariant = {
  slug: string;
  title: string;
  description: string;
  htmlFile: string;
};

export type CatalogPreview = {
  html: string;
  variantSlug?: string;
  wrapperClass?: string;
  layout?: "component" | "foundation";
};

export type CatalogExample = {
  slug: string;
  title: string;
  description: string;
  preview: CatalogPreview;
  sources: Partial<Record<CodeLanguage, CatalogSource>>;
};

export type CatalogItem = {
  kind: CatalogKind;
  slug: string;
  title: string;
  description: string;
  status: string;
  href: string;
  sourceDir: string;
  variants: CatalogVariant[];
  preview: CatalogPreview;
  examples: CatalogExample[];
  sources: Partial<Record<CodeLanguage, CatalogSource>>;
};

export type ManifestSource = {
  blade: string | null;
  demoHtml: string | null;
  fixture: string | null;
  scss: string | null;
  js: string | null;
};

export type BlockManifest = {
  blockId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  source: ManifestSource;
  naming?: {
    cmsCompositeKey?: string | null;
    sectionClass?: string | null;
  };
  variants?: Array<{
    variantId: string;
    title?: string;
    description?: string;
    source?: { demoHtml?: string | null };
  }>;
};

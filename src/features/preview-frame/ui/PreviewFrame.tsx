import type { CatalogKind } from "@/entities/catalog-item/model";

type PreviewFrameProps = {
  kind: CatalogKind;
  slug: string;
  title: string;
  variantSlug?: string;
};

export function PreviewFrame({
  kind,
  slug,
  title,
  variantSlug,
}: PreviewFrameProps) {
  const params = variantSlug ? `?variant=${encodeURIComponent(variantSlug)}` : "";
  const src = `/preview/${kind}/${slug}${params}`;
  const width = kind === "block" || slug === "section" ? "1800px" : "820px";

  return (
    <div className="preview-frame">
      <iframe src={src} style={{ width }} title={`${title} preview`} loading="lazy" />
    </div>
  );
}

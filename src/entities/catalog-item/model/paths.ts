import path from "node:path";

export const templatesRoot = path.join(process.cwd(), "templates");
export const blocksRoot = path.join(templatesRoot, "blocks");
export const foundationRoot = path.join(templatesRoot, "foundation");

export function toTemplateRelativePath(filePath: string) {
  return path.relative(templatesRoot, filePath).replaceAll(path.sep, "/");
}

export function getKindHref(kind: "block" | "component", slug: string) {
  return kind === "block" ? `/blocks/${slug}` : `/components/${slug}`;
}

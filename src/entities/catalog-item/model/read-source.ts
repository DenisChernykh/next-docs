import fs from "node:fs/promises";
import path from "node:path";

import type { CatalogSource, CodeLanguage } from "./types";
import { toTemplateRelativePath } from "./paths";

const missingLabel: Record<CodeLanguage, string> = {
  html: "HTML source is not declared for this item.",
  php: "PHP source is not declared for this item.",
  scss: "SCSS source is not declared for this item.",
  js: "JS source is not declared for this item.",
};

export async function readCatalogSource(
  dir: string,
  language: CodeLanguage,
  fileName: string | null | undefined,
): Promise<CatalogSource | undefined> {
  if (!fileName) return undefined;

  const filePath = path.join(dir, fileName);
  const content = await fs.readFile(filePath, "utf8");

  return {
    language,
    label: path.basename(fileName),
    relativePath: toTemplateRelativePath(filePath),
    content,
  };
}

export function createMissingSource(language: CodeLanguage): CatalogSource {
  return {
    language,
    label: "Not declared",
    relativePath: null,
    content: missingLabel[language],
    isMissing: true,
  };
}

import { codeToHtml } from "shiki";

import { createMissingSource } from "@/entities/catalog-item/model";
import type { CodeLanguage, CatalogExample, CatalogItem } from "@/entities/catalog-item/model";

export type CodeTab = {
  value: CodeLanguage;
  label: string;
  copyValue: string;
  highlightedHtml: string;
  sourceLabel: string;
  isMissing: boolean;
};

const languageLabels: Record<CodeLanguage, string> = {
  html: "HTML",
  php: "PHP",
  scss: "SCSS",
  js: "JS",
};

const shikiLang: Record<CodeLanguage, string> = {
  html: "html",
  php: "php",
  scss: "scss",
  js: "javascript",
};

export async function getCodeTabs(item: CatalogItem | CatalogExample): Promise<CodeTab[]> {
  const languages: CodeLanguage[] = ["html", "php", "scss", "js"];

  return Promise.all(
    languages.map(async (language) => {
      const source = item.sources[language] ?? createMissingSource(language);
      const highlightedHtml = await codeToHtml(source.content, {
        lang: shikiLang[language],
        theme: "github-dark",
      });

      return {
        value: language,
        label: languageLabels[language],
        copyValue: source.isMissing ? "" : source.content,
        highlightedHtml,
        sourceLabel: source.relativePath ?? source.label,
        isMissing: Boolean(source.isMissing),
      };
    }),
  );
}

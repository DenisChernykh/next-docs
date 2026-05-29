import path from "node:path";

import { foundationRoot, getKindHref } from "./paths";
import { readCatalogSource } from "./read-source";
import type { CatalogExample, CatalogItem } from "./types";

type FoundationExample = {
  slug: string;
  title: string;
  description: string;
  html: string;
};

type FoundationEntry = {
  slug: string;
  title: string;
  description: string;
  dir: string;
  blade?: string;
  scss: string;
  html: string;
  examples?: FoundationExample[];
};

const sectionExamples: FoundationExample[] = [
  {
    slug: "base-split",
    title: "Base split",
    description: "Default flexible row: title on the left, supporting text on the right.",
    html: `<section class="section" aria-labelledby="section-header-base-title">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title" id="section-header-base-title">
        Заголовок секции в две строки
      </h2>
      <div class="section-text">
        Описание стоит рядом с заголовком на широких экранах и уходит ниже на мобильных.
      </div>
    </div>
  </div>
</section>`,
  },
  {
    slug: "centered-column",
    title: "Centered column",
    description: "Vertical centered stack for compact statement sections and media-led blocks.",
    html: `<section class="section" aria-labelledby="section-header-column-title">
  <div class="container">
    <div class="section-header section-header--column">
      <h2 class="section-title" id="section-header-column-title">
        Центрированный заголовок
      </h2>
      <div class="section-text">
        Текст ограничен общей шириной колонки и визуально работает как единый центрированный блок.
      </div>
    </div>
  </div>
</section>`,
  },
  {
    slug: "start-column",
    title: "Start column",
    description: "Vertical left-aligned stack for sidebars, asides, and narrow content columns.",
    html: `<section class="section" aria-labelledby="section-header-column-start-title">
  <div class="container">
    <div class="section-header section-header--column-start">
      <h2 class="section-title" id="section-header-column-start-title">
        Левый вертикальный заголовок
      </h2>
      <div class="section-text">
        Та же колонка, но без центрирования: удобно для aside-композиций и плотных layouts.
      </div>
    </div>
  </div>
</section>`,
  },
  {
    slug: "split-aside",
    title: "Grid split with aside",
    description: "Explicit grid: main title/text stack plus an aside slot for CTA, stats, or controls.",
    html: `<section class="section" aria-labelledby="section-header-split-title">
  <div class="container">
    <div class="section-header section-header--split">
      <div class="section-header__main">
        <h2 class="section-title" id="section-header-split-title">
          Заголовок с отдельным aside
        </h2>
        <div class="section-text">
          Основной текст остается в левой grid-колонке вместе с заголовком.
        </div>
      </div>
      <div class="section-header__aside">
        <a class="button button--primary" href="#foundation">
          Действие
        </a>
      </div>
    </div>
  </div>
</section>`,
  },
];

const sectionPreviewWrapperClass = "registry-entry__preview registry-foundation-demo__preview";

const items: FoundationEntry[] = [
  {
    slug: "section",
    title: "Section",
    description: "Layout primitives for section spacing, container and headers.",
    dir: "section",
    scss: "_section.scss",
    html: sectionExamples[0].html,
    examples: sectionExamples,
  },
  {
    slug: "button",
    title: "Button",
    description: "Primary, glass and block button primitives.",
    dir: "button",
    blade: "button.blade.php",
    scss: "_button.scss",
    html: `<button class="button button--primary" type="button">Записаться онлайн</button>
<button class="button button--glass-arrow" type="button">Связаться</button>`,
  },
  {
    slug: "video-play-button",
    title: "Video play button",
    description: "Inline media play control used by video sections.",
    dir: "button",
    blade: "video-play-button.blade.php",
    scss: "_video-play-button.scss",
    html: `<button class="video-play-button" type="button">
  <span class="video-play-button__text">Смотреть</span>
  <span class="video-play-button__icon" aria-hidden="true"></span>
</button>`,
  },
  {
    slug: "social-link",
    title: "Social link",
    description: "Compact social network link primitive.",
    dir: "social",
    scss: "_social-link.scss",
    html: `<a class="social-link social-link--vk" href="#" aria-label="VK">
  <span aria-hidden="true">VK</span>
</a>
<a class="social-link social-link--max" href="#" aria-label="MAX">
  <span aria-hidden="true">M</span>
</a>`,
  },
] as const;

export async function getFoundationItems(): Promise<CatalogItem[]> {
  return Promise.all(
    items.map(async (entry) => {
      const dir = path.join(foundationRoot, entry.dir);
      const php = await readCatalogSource(dir, "php", entry.blade);
      const scss = await readCatalogSource(dir, "scss", entry.scss);
      const sourceBase = { php, scss };
      const examples: CatalogExample[] = (entry.examples ?? [
        {
          slug: "default",
          title: entry.title,
          description: entry.description,
          html: entry.html,
        },
      ]).map((example) => {
        const html = {
          language: "html" as const,
          label:
            example.slug === "default"
              ? "Curated preview"
              : `Curated preview: ${example.title}`,
          relativePath: null,
          content: example.html,
        };

        return {
          slug: example.slug,
          title: example.title,
          description: example.description,
          preview: {
            html: example.html,
            variantSlug: example.slug === "default" ? undefined : example.slug,
            wrapperClass:
              entry.slug === "section" ? sectionPreviewWrapperClass : undefined,
            layout: entry.slug === "section" ? "foundation" : "component",
          },
          sources: {
            ...sourceBase,
            html,
          },
        };
      });
      const firstExample = examples[0];

      return {
        kind: "component",
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        status: "foundation",
        href: getKindHref("component", entry.slug),
        sourceDir: dir,
        variants: [],
        preview: firstExample.preview,
        examples,
        sources: firstExample.sources,
      };
    }),
  );
}

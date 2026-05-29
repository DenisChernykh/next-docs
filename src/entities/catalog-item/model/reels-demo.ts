import fs from "node:fs/promises";
import path from "node:path";

import { escapeHtml } from "./preview-document";

type ReelsFixtureItem = {
  id: string;
  title: string;
  text: string;
  preview: string;
  buttonText?: string;
  buttonLink?: string;
  buttonHasLink?: string;
  items?: Array<{ src: string; duration?: number }>;
};

function renderPreviewSlide(item: ReelsFixtureItem) {
  return `<div class="swiper-slide" data-reels-preview-trigger data-modal-id="reels">
  <div class="reels__item">
    <div class="reels__preview">
      <img src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.title)}" loading="lazy">
    </div>
    <div class="reels__description body-text-reg">${escapeHtml(item.title)}</div>
  </div>
</div>`;
}

function renderMedia(item: ReelsFixtureItem) {
  const mediaItems = item.items?.length ? item.items : [{ src: item.preview }];

  return mediaItems
    .map((mediaItem, index) => {
      const src = escapeHtml(mediaItem.src);
      const duration = escapeHtml(String(mediaItem.duration ?? 0));
      const className = index === 0 ? ' class="active"' : "";

      if (mediaItem.src.endsWith(".webm") || mediaItem.src.endsWith(".mp4")) {
        return `<div data-reel-media data-segment-index="${index}" data-duration="${duration}"${className}><video src="${src}" muted playsinline preload="metadata"></video></div>`;
      }

      return `<div data-reel-media data-segment-index="${index}" data-duration="${duration}"${className}><img src="${src}" alt="" loading="lazy"></div>`;
    })
    .join("");
}

function renderProgressBars(item: ReelsFixtureItem) {
  const count = item.items?.length || 1;

  return Array.from({ length: count }, (_item, index) => {
    return `<button type="button" data-reels-progress data-segment-index="${index}"></button>`;
  }).join("");
}

function renderButton(item: ReelsFixtureItem) {
  if (!item.buttonText) return "";
  if (item.buttonHasLink === "1" && item.buttonLink) {
    return `<a href="${escapeHtml(item.buttonLink)}" class="button button--primary button--arrow reels-modal__button">
  ${escapeHtml(item.buttonText)}
</a>`;
  }

  return `<button class="button button--primary button--arrow reels-modal__button" type="button">
  ${escapeHtml(item.buttonText)}
</button>`;
}

function renderModalSlide(item: ReelsFixtureItem) {
  return `<div class="swiper-slide">
  <div data-has-link="${escapeHtml(item.buttonHasLink ?? "0")}">
      <div class="reels-modal__item">
        <div class="reels-modal__header">
        <div class="reels-modal__bars" data-reel-progress-bars>${renderProgressBars(item)}</div>
        <div class="reels-modal__title"><div>${escapeHtml(item.title)}</div></div>
      </div>
      <div class="reels-modal__footer"><div>${escapeHtml(item.text)}</div></div>
      <div class="reels-modal__contents">${renderMedia(item)}</div>
    </div>
    ${renderButton(item)}
  </div>
</div>`;
}

export async function hydrateReelsDemo(dir: string, html: string) {
  const raw = await fs.readFile(path.join(dir, "fixture.json"), "utf8");
  const fixture = JSON.parse(raw) as ReelsFixtureItem[];
  const previews = fixture.map(renderPreviewSlide).join("\n");
  const modals = fixture.map(renderModalSlide).join("\n");

  return html
    .replace(
      /(<div class="swiper-wrapper" data-reels-preview-wrapper>\s*)<template>[\s\S]*?<\/template>/,
      `$1${previews}`,
    )
    .replace(
      /(<div class="swiper-wrapper" data-reels-modal-wrapper>\s*)<template>[\s\S]*?<\/template>/,
      `$1${modals}`,
    );
}

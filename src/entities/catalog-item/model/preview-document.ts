import path from "node:path";
import fs from "node:fs";
import * as sass from "sass";

import { foundationRoot, templatesRoot } from "./paths";
import type { CatalogItem } from "./types";

let cssCache: string | null = null;
let sectionCssCache: string | null = null;

const previewDependencyCss = [
  "node_modules/swiper/swiper.css",
  "node_modules/swiper/modules/free-mode.css",
  "node_modules/swiper/modules/grid.css",
  "node_modules/modules-vg-reels/dist/modules-vg-reels.css",
].map((filePath) => path.join(process.cwd(), filePath));

export function rewriteTemplateAssetUrls(html: string) {
  return html
    .replaceAll('="/blocks/', '="/api/template-assets/blocks/')
    .replaceAll("='/blocks/", "='/api/template-assets/blocks/")
    .replaceAll("url(/blocks/", "url(/api/template-assets/blocks/");
}

export function addFoundationSectionClass(html: string) {
  return html.replace(/^(\s*<section\b)([^>]*)(>)/i, (match, open, attrs, close) => {
    const classMatch = String(attrs).match(/\sclass=(["'])(.*?)\1/i);

    if (!classMatch) {
      return `${open} class="section"${attrs}${close}`;
    }

    const classValue = classMatch[2];
    const classes = classValue.split(/\s+/).filter(Boolean);

    if (classes.includes("section")) {
      return match;
    }

    const nextClassAttr = ` class=${classMatch[1]}section ${classValue}${classMatch[1]}`;

    return `${open}${String(attrs).replace(classMatch[0], nextClassAttr)}${close}`;
  });
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function getPreviewRuntimeScript() {
  return `(() => {
const modalHooks = new WeakMap();
const getModalHooks = (modal) => {
  if (!modalHooks.has(modal)) modalHooks.set(modal, { open: new Set(), close: new Set() });
  return modalHooks.get(modal);
};
const dispatchModalHook = (modal, type) => {
  const hooks = modalHooks.get(modal)?.[type];
  hooks?.forEach((callback) => callback(modal));
};
const getReelsSlides = (modal) => Array.from(modal?.querySelectorAll(".swiper-slide") || []);
const setReelsSlide = (modal, index) => {
  const slides = getReelsSlides(modal);
  if (!slides.length) return;
  const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("swiper-slide-active", slideIndex === safeIndex);
    slide.classList.toggle("swiper-slide-prev", slideIndex === safeIndex - 1);
    slide.classList.toggle("swiper-slide-next", slideIndex === safeIndex + 1);
    slide.querySelectorAll(".reels-modal__contents > *").forEach((content, contentIndex) => {
      content.classList.toggle("active", slideIndex === safeIndex && contentIndex === 0);
    });
  });
  modal.dataset.activeReelsIndex = String(safeIndex);
};
const resetReels = (modal) => {
  getReelsSlides(modal).forEach((slide) => {
    slide.classList.remove("swiper-slide-active", "swiper-slide-prev", "swiper-slide-next");
    slide.querySelectorAll("video").forEach((video) => {
      video.pause?.();
      video.currentTime = 0;
    });
  });
  delete modal.dataset.activeReelsIndex;
};
const openModal = (modal) => {
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("opened");
  dispatchModalHook(modal, "open");
};
const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("opened");
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;
  if (modal.classList.contains("reels-modal")) resetReels(modal);
  dispatchModalHook(modal, "close");
};
window.__VGMODALS_INITIALIZED__ = true;
window.Modals = window.Modals || {};
window.Modals.getModal = window.Modals.getModal || ((modalId) => {
  const modal = Array.from(document.querySelectorAll("[data-modal]")).find((item) => item.dataset.modal === String(modalId));
  if (!modal) return null;
  return {
    open: () => openModal(modal),
    close: () => closeModal(modal),
    onOpen: (callback) => getModalHooks(modal).open.add(callback),
    onClose: (callback) => getModalHooks(modal).close.add(callback),
  };
});
const fillVacancy = (card, modal) => {
  const title = card?.dataset.vacancyTitle || "";
  const tpl = card?.querySelector(".vacancy-card__modal-content");
  const titleTarget = modal?.querySelector("[data-vacancy-modal-title]");
  const descTarget = modal?.querySelector("[data-vacancy-modal-description]");
  if (titleTarget) titleTarget.textContent = title;
  if (descTarget && tpl instanceof HTMLTemplateElement) descTarget.innerHTML = tpl.innerHTML;
};
const fillReview = (trigger) => {
  const card = trigger.closest("[data-reviews-card]");
  const modal = document.querySelector('[data-modal="modalReviews"]');
  const content = modal?.querySelector("[data-reviews-modal-content]");
  const tpl = card?.querySelector("[data-reviews-modal-template]");
  if (content && tpl instanceof HTMLTemplateElement) {
    content.replaceChildren(tpl.content.cloneNode(true));
  }
};
document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const close = target.closest("[data-modal-close], .modal-close");
  if (close) return closeModal(close.closest("[data-modal]"));
  const reelsNav = target.closest("[data-reels-nav]");
  if (reelsNav && !window.__DOC_PREVIEW_SWIPER_READY__) {
    const modal = reelsNav.closest("[data-modal]");
    const current = Number(modal?.dataset.activeReelsIndex || 0);
    setReelsSlide(modal, current + (reelsNav.dataset.reelsNav === "prev" ? -1 : 1));
    return;
  }
  const reelsTrigger = target.closest("[data-reels-preview-trigger]");
  if (reelsTrigger && !window.__DOC_PREVIEW_SWIPER_READY__) {
    const modal = document.querySelector('[data-modal="reels"]');
    const triggers = Array.from(document.querySelectorAll("[data-reels-preview-trigger]"));
    setReelsSlide(modal, Math.max(0, triggers.indexOf(reelsTrigger)));
    openModal(modal);
    return;
  }
  const review = target.closest("[data-reviews-modal-open]");
  if (review) fillReview(review);
  const vacancy = target.closest('.vacancy-card__hitarea[data-modal-id="modalVacancy"]');
  if (vacancy) fillVacancy(vacancy.closest(".vacancy-card"), document.querySelector('[data-modal="modalVacancy"]'));
  const trigger = target.closest("[data-modal-id]");
  if (trigger) openModal(document.querySelector('[data-modal="' + trigger.dataset.modalId + '"]'));
});
document.querySelectorAll("video[data-lazyvideo]").forEach((video) => {
  const box = video.closest("[data-lazyvideo-click]");
  const start = () => {
    if (!box || box.classList.contains("is-started")) return;
    box.classList.add("is-started");
    video.controls = true;
    video.muted = false;
    video.play?.().catch?.(() => {});
  };
  box?.addEventListener("click", start);
  box?.querySelector("[data-lazyvideo-button]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    start();
  });
});
})();`;
}

export function getPreviewImportMap() {
  return JSON.stringify({
    imports: {
      swiper: "/api/vendor-assets/swiper/swiper.mjs",
      "swiper/modules": "/api/vendor-assets/swiper/modules/index.mjs",
      "modules-vg-reels": "/api/vendor-assets/modules-vg-reels/dist/index.js",
    },
  }, null, 2);
}

export function getPreviewModuleScript() {
  return `import { initReviews } from "/api/template-assets/blocks/reviews/reviews.js";
import { setupReels } from "modules-vg-reels";

const markSwiperReady = () => {
  window.__DOC_PREVIEW_SWIPER_READY__ = true;
  document.documentElement.classList.add("has-preview-swiper");
};

if (document.querySelector("[data-reviews]")) {
  initReviews(document);
  markSwiperReady();
}

if (document.querySelector("[data-reels-preview-wrapper]")) {
  setupReels([], {
    previewSwiper: {
      slidesPerView: 3.4,
      spaceBetween: 8,
      watchOverflow: true,
      centerInsufficientSlides: true,
      breakpoints: {
        768: { slidesPerView: 5, centerInsufficientSlides: true },
        1280: { slidesPerView: 8, spaceBetween: 40, centerInsufficientSlides: true },
      },
    },
    modalSwiper: {
      centeredSlides: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      spaceBetween: 24,
      breakpoints: {
        768: { slidesPerView: 2.2 },
        1200: { slidesPerView: 4 },
      },
    },
  }).then(markSwiperReady).catch((error) => {
    console.error("[preview] reels swiper init failed", error);
  });
}`;
}

export function getPreviewCss() {
  if (!cssCache) {
    const result = sass.compile(path.join(templatesRoot, "assets/scss/main.scss"), {
      loadPaths: [templatesRoot, path.join(templatesRoot, "assets/scss")],
      style: "compressed",
    });
    const dependencies = previewDependencyCss
      .map((filePath) => fs.readFileSync(filePath, "utf8"))
      .join("\n");
    cssCache = `${dependencies}\n${result.css}`;
  }

  return cssCache;
}

export function getPreviewSectionCss() {
  if (!sectionCssCache) {
    const result = sass.compile(path.join(foundationRoot, "section/_section.scss"), {
      loadPaths: [
        templatesRoot,
        path.join(templatesRoot, "assets/scss"),
        path.join(foundationRoot, "section"),
      ],
      style: "compressed",
    });
    sectionCssCache = result.css;
  }

  return sectionCssCache;
}

export function createPreviewDocument(item: CatalogItem) {
  const html =
    item.kind === "block" ? addFoundationSectionClass(item.preview.html) : item.preview.html;
  const contentHtml = item.preview.wrapperClass
    ? `<div class="${escapeHtml(item.preview.wrapperClass)}">${html}</div>`
    : html;
  const content = rewriteTemplateAssetUrls(contentHtml);
  const modeClass =
    item.kind === "block"
      ? "is-block"
      : item.preview.layout === "foundation"
        ? "is-foundation"
        : "is-component";

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(item.title)}</title>
<style>${getPreviewCss()}
${getPreviewSectionCss()}
html{background:var(--bg-muted,#f4f4f5)}body{min-width:320px}
.doc-preview{min-height:100vh}.doc-preview.is-component{display:flex;align-items:center;justify-content:center;gap:24rem;padding:48rem}
.doc-preview.is-component>*{margin-inline:8rem}.doc-preview.is-block>.section:first-child{margin-top:0}
.doc-preview.is-foundation{display:block;min-height:100vh;padding:48rem;background:var(--bg-muted,#e8e8e8)}
.doc-preview.is-foundation>.registry-entry__preview{width:min(100%,1802rem);margin-inline:auto}
html:not(.has-preview-swiper) .doc-preview .reels [data-reels-preview-wrapper]{display:flex;gap:40rem;align-items:flex-start;justify-content:center}
html:not(.has-preview-swiper) .doc-preview .reels [data-reels-preview-trigger]{width:110rem;flex:0 0 110rem}
html:not(.has-preview-swiper) .doc-preview .reels-modal .swiper-wrapper{display:flex;align-items:center;justify-content:center}
html:not(.has-preview-swiper) .doc-preview .reels-modal .swiper-slide{display:none;width:min(360rem,calc(100vw - 64rem));flex:0 0 min(360rem,calc(100vw - 64rem))}
html:not(.has-preview-swiper) .doc-preview .reels-modal .swiper-slide-active{display:flex}
html:not(.has-preview-swiper) .doc-preview .reels-modal .swiper-slide>[data-has-link]{width:100%;max-width:100%}
html:not(.has-preview-swiper) .doc-preview .reels-modal__item{width:100%;max-height:calc(100vh - var(--reels-modal-cta-height,48rem) - var(--reels-modal-cta-gap,14rem) - 96rem)}
html:not(.has-preview-swiper) .doc-preview .reels-modal .reels-modal__button{width:100%}
@media(max-width:767px){.doc-preview.is-component{align-items:flex-start;justify-content:flex-start;padding:24px;overflow:auto}}
@media(max-width:767px){.doc-preview.is-foundation{padding:20px}}
@media(max-width:767px){html:not(.has-preview-swiper) .doc-preview .reels [data-reels-preview-wrapper]{justify-content:flex-start;gap:12px;padding-inline:16px;overflow-x:auto}html:not(.has-preview-swiper) .doc-preview .reels [data-reels-preview-trigger]{width:72px;flex-basis:72px}html:not(.has-preview-swiper) .doc-preview .reels-modal .swiper-slide{width:min(320px,calc(100vw - 32px));flex-basis:min(320px,calc(100vw - 32px))}}
</style>
</head>
<body>
<main class="doc-preview ${modeClass}">${content}</main>
<script>${getPreviewRuntimeScript()}</script>
<script type="importmap">${getPreviewImportMap()}</script>
<script type="module">${getPreviewModuleScript()}</script>
</body>
</html>`;
}

import { describe, expect, it } from "vitest";

import {
  createPreviewDocument,
  getPreviewCss,
  getPreviewSectionCss,
} from "./preview-document";
import type { CatalogItem } from "./types";

function createItem(html: string, slug = "demo"): CatalogItem {
  return {
    kind: "block",
    slug,
    title: "Demo",
    description: "",
    status: "canonical",
    href: `/blocks/${slug}`,
    sourceDir: "",
    variants: [],
    preview: { html },
    examples: [],
    sources: {},
  };
}

describe("preview document", () => {
  it("adds the foundation section class to block preview sections that omit it", () => {
    const document = createPreviewDocument(
      createItem('<section class="reels section-reels"><div>Stories</div></section>', "reels"),
    );

    expect(document).toContain('<section class="section reels section-reels">');
  });

  it("includes swiper and reels dependency css used by template demos", () => {
    const css = getPreviewCss();

    expect(css).toContain(".swiper");
    expect(css).toContain(".reels-modal");
    expect(css).toContain("--r-preview-height");
  });

  it("adds foundation section css as an explicit preview layer", () => {
    const css = getPreviewSectionCss();

    expect(css).toContain(".section{position:relative;overflow:hidden;padding:80rem 0}");
    expect(css).toContain(".container{margin-inline:auto");
    expect(css).toContain(".section-header{display:flex");
  });

  it("includes browser module imports for swiper-backed preview blocks", () => {
    const document = createPreviewDocument(
      createItem('<section class="reviews" data-reviews></section>', "reviews"),
    );

    expect(document).toContain('<script type="importmap">');
    expect(document).toContain('"swiper": "/api/vendor-assets/swiper/swiper.mjs"');
    expect(document).toContain(
      '"modules-vg-reels": "/api/template-assets/vendor/modules-vg-reels/index.js"',
    );
    expect(document).toContain("initReviews(document)");
    expect(document).toContain("setupReels([],");
  });

  it("renders preview wrapper classes without changing source html", () => {
    const item = createItem('<section class="section">Section</section>');
    item.kind = "component";
    item.preview.wrapperClass = "registry-entry__preview registry-foundation-demo__preview";
    item.preview.layout = "foundation";

    const document = createPreviewDocument(item);

    expect(document).toContain('<main class="doc-preview is-foundation">');
    expect(document).toContain(
      '<div class="registry-entry__preview registry-foundation-demo__preview"><section class="section">',
    );
  });
});

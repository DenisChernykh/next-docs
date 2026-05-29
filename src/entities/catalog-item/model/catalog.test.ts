import { describe, expect, it } from "vitest";

import {
  getCatalogItem,
  getCatalogItemWithVariant,
  getCatalogItems,
  getDefaultCatalogItem,
} from "./catalog";

describe("catalog loader", () => {
  it("discovers blocks from templates manifests", async () => {
    const items = await getCatalogItems();
    const blockSlugs = items
      .filter((item) => item.kind === "block")
      .map((item) => item.slug);

    expect(blockSlugs).toContain("video");
    expect(blockSlugs).toContain("vacancies");
  });

  it("maps block variants to preview and html source", async () => {
    const vacancies = await getCatalogItem("block", "vacancies");

    expect(vacancies?.variants.map((variant) => variant.slug)).toEqual([
      "split-aside",
      "grid-cta",
    ]);
    expect(vacancies?.sources.html?.label).toBe("demo.split-aside.html");
  });

  it("exposes every variant as a separate catalog example", async () => {
    const vacancies = await getCatalogItem("block", "vacancies");

    expect(vacancies?.examples.map((example) => example.slug)).toEqual([
      "split-aside",
      "grid-cta",
    ]);
    expect(
      vacancies?.examples.map((example) => example.sources.html?.label),
    ).toEqual(["demo.split-aside.html", "demo.grid-cta.html"]);
  });

  it("hydrates reels demo html from fixture data", async () => {
    const reels = await getCatalogItem("block", "reels");

    expect(reels?.preview.html).toContain("Погружение в вкус Азии");
    expect(reels?.preview.html).toContain("data-reels-preview-trigger");
    expect(reels?.preview.html).toContain("data-reels-progress");
    expect(reels?.preview.html).toContain("data-reel-media");
    expect(reels?.preview.html).toContain(
      '<div class="reels-modal__contents"><div data-reel-media data-segment-index="0"',
    );
    expect(reels?.preview.html).not.toContain("<template>");
  });

  it("includes foundation components with curated preview html", async () => {
    const button = await getCatalogItem("component", "button");

    expect(button?.title).toBe("Button");
    expect(button?.preview.html).toContain("button--primary");
    expect(button?.sources.scss?.label).toBe("_button.scss");
  });

  it("exposes every section header variant as a separate example", async () => {
    const section = await getCatalogItem("component", "section");

    expect(section?.examples.map((example) => example.slug)).toEqual([
      "base-split",
      "centered-column",
      "start-column",
      "split-aside",
    ]);
    expect(section?.preview.html).toContain("section-header");
    expect(section?.preview.html).not.toContain("section-header--column");
    expect(section?.preview.wrapperClass).toBe(
      "registry-entry__preview registry-foundation-demo__preview",
    );
    expect(section?.preview.layout).toBe("foundation");
  });

  it("selects foundation component examples by variant slug", async () => {
    const section = await getCatalogItemWithVariant(
      "component",
      "section",
      "centered-column",
    );

    expect(section?.preview.html).toContain("section-header--column");
    expect(section?.preview.wrapperClass).toBe(
      "registry-entry__preview registry-foundation-demo__preview",
    );
    expect(section?.preview.layout).toBe("foundation");
    expect(section?.sources.html?.label).toBe("Curated preview: Centered column");
    expect(section?.sources.html?.content).not.toContain("registry-foundation-demo__preview");
  });

  it("selects the first block as default page", async () => {
    const item = await getDefaultCatalogItem();

    expect(item?.kind).toBe("block");
    expect(item?.slug.length).toBeGreaterThan(0);
  });
});

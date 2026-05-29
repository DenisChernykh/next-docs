import path from "node:path";

import { templatesRoot, toTemplateRelativePath } from "./paths";

import { describe, expect, it } from "vitest";

describe("template paths", () => {
  it("resolves vendored templates inside the project root", () => {
    expect(templatesRoot).toBe(path.join(process.cwd(), "templates"));
  });

  it("formats source paths relative to the vendored templates root", () => {
    expect(
      toTemplateRelativePath(path.join(templatesRoot, "blocks/video/demo.html")),
    ).toBe("blocks/video/demo.html");
  });
});

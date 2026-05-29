import { isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { CatalogPage } from "./CatalogPage";

function hasSourceFacts(node: unknown): boolean {
  if (Array.isArray(node)) {
    return node.some(hasSourceFacts);
  }

  if (!isValidElement<{ className?: string; children?: unknown }>(node)) {
    return false;
  }

  const typeName =
    typeof node.type === "function" ? node.type.name : String(node.type);
  const { children, className } = node.props;

  return (
    typeName === "SourceFacts" ||
    className === "source-facts" ||
    hasSourceFacts(children)
  );
}

describe("CatalogPage", () => {
  it("does not render source facts metadata", async () => {
    const page = await CatalogPage({ kind: "block", slug: "video" });

    expect(hasSourceFacts(page)).toBe(false);
  });
});

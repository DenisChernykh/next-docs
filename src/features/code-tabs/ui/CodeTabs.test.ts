import { createElement, isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { CodeTabs } from "./CodeTabs";

function collectClassNames(node: unknown): string[] {
  if (Array.isArray(node)) {
    return node.flatMap(collectClassNames);
  }

  if (!isValidElement<{ className?: string; children?: unknown }>(node)) {
    return [];
  }

  const classNames = node.props.className ? [node.props.className] : [];

  return [...classNames, ...collectClassNames(node.props.children)];
}

describe("CodeTabs", () => {
  it("marks the preview panel separately from source panels", () => {
    const tree = CodeTabs({
      tabs: [],
      preview: createElement("span", null, "Preview"),
    });

    expect(collectClassNames(tree)).toContain(
      "doc-tabs__panel doc-tabs__panel--preview",
    );
  });
});

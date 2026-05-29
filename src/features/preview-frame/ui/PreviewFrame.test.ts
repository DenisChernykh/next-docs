import { describe, expect, it } from "vitest";

import { PreviewFrame } from "./PreviewFrame";

describe("PreviewFrame", () => {
  it("renders block previews on a desktop-width canvas", () => {
    const frame = PreviewFrame({ kind: "block", slug: "video", title: "Video" });
    const iframe = frame.props.children;

    expect(iframe.props.style.width).toBe("1800px");
  });

  it("renders section foundation previews on a wide canvas", () => {
    const frame = PreviewFrame({ kind: "component", slug: "section", title: "Section" });
    const iframe = frame.props.children;

    expect(iframe.props.style.width).toBe("1800px");
  });
});

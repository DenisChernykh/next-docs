import { describe, expect, it } from "vitest";

import { GET } from "./route";

function context(assetPath: string[]) {
  return {
    params: Promise.resolve({ assetPath }),
  };
}

describe("vendor assets route", () => {
  it("serves allowed swiper modules as javascript", async () => {
    const response = await GET(
      new Request("http://localhost/api/vendor-assets/swiper/swiper.mjs"),
      context(["swiper", "swiper.mjs"]),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "text/javascript; charset=utf-8",
    );
    expect(await response.text()).toContain("Swiper");
  });

  it("blocks unsupported packages", async () => {
    const response = await GET(
      new Request("http://localhost/api/vendor-assets/next/package.json"),
      context(["next", "package.json"]),
    );

    expect(response.status).toBe(403);
  });

  it("does not expose vendored template runtime packages from node_modules", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/vendor-assets/modules-vg-reels/dist/index.js",
      ),
      context(["modules-vg-reels", "dist", "index.js"]),
    );

    expect(response.status).toBe(403);
  });
});

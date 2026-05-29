import fs from "node:fs/promises";
import path from "node:path";

import { templatesRoot } from "@/entities/catalog-item/model/paths";

export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

type RouteContext = {
  params: Promise<{ assetPath: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { assetPath } = await context.params;
  const filePath = path.resolve(templatesRoot, ...assetPath);
  const safeRoot = `${templatesRoot}${path.sep}`;

  if (!filePath.startsWith(safeRoot)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return new Response(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const packageRoots: Record<string, string> = {
  "modules-vg-reels": path.join(process.cwd(), "node_modules/modules-vg-reels"),
  swiper: path.join(process.cwd(), "node_modules/swiper"),
};

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
};

type RouteContext = {
  params: Promise<{ assetPath: string[] }>;
};

function isInsideRoot(filePath: string, rootPath: string) {
  return filePath === rootPath || filePath.startsWith(`${rootPath}${path.sep}`);
}

export async function GET(_request: Request, context: RouteContext) {
  const { assetPath } = await context.params;
  const [packageName, ...packagePath] = assetPath;
  const packageRoot = packageRoots[packageName];

  if (!packageRoot || !packagePath.length) {
    return new Response("Forbidden", { status: 403 });
  }

  const requestedPath = path.resolve(packageRoot, ...packagePath);

  try {
    const [rootRealPath, fileRealPath] = await Promise.all([
      fs.realpath(packageRoot),
      fs.realpath(requestedPath),
    ]);

    if (!isInsideRoot(fileRealPath, rootRealPath)) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = await fs.readFile(fileRealPath);
    const ext = path.extname(fileRealPath).toLowerCase();

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

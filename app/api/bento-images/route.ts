import { NextResponse } from "next/server";
import path from "node:path";
import { readdir } from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".avif",
]);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "images", "bento_grid");
    const entries = await readdir(dir, { withFileTypes: true });

    const images = entries
      .filter(
        (e) => e.isFile() && ALLOWED_EXT.has(path.extname(e.name).toLowerCase())
      )
      .map((e) => `/images/bento_grid/${e.name}`);

    return NextResponse.json(
      { images },
      {
        headers: {
          // Prevent caching to allow new randomization and new files to appear
          "Cache-Control":
            "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read bento images" },
      { status: 500 }
    );
  }
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Readable } from "node:stream";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET" && _req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method not allowed");
  }

  const rawTag = typeof _req.query.tag === "string" ? _req.query.tag : "";\n  if (rawTag && !/^v\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?$/.test(rawTag)) return res.status(400).send("Invalid release tag");\n\n  try {
    const upstream = await fetch(
      rawTag ? `https://github.com/Bivanjit/SMART-PREP-AXOM-APP/releases/download/${rawTag}/app-release.apk` : "https://github.com/Bivanjit/SMART-PREP-AXOM-APP/releases/latest/download/app-release.apk",
      { redirect: "follow", headers: { "User-Agent": "SmartPrep-Axom-Download/1.0" } }
    );

    if (!upstream.ok || !upstream.body) {
      return res.status(upstream.status || 503).send("The latest SmartPrep Axom APK is not available yet. Please try again shortly.");
    }

    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", 'attachment; filename="SmartPrep-Axom.apk"');
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    const length = upstream.headers.get("content-length");
    if (length) res.setHeader("Content-Length", length);

    if (_req.method === "HEAD") return res.status(200).end();
    res.status(200);
    Readable.fromWeb(upstream.body as import("node:stream/web").ReadableStream).pipe(res);
  } catch (error) {
    console.error("APK proxy failed:", error);
    return res.status(502).send("Unable to fetch the APK right now. Please try again shortly.");
  }
}

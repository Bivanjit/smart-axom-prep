import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const upstream = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/latest", {
      headers: { "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "SmartPrep-Axom-Download-Stats/1.0" },
      next: { revalidate: 300 } as any
    });
    if (!upstream.ok) return res.status(502).json({ error: "Download statistics are temporarily unavailable" });
    const release = await upstream.json() as { tag_name?: string; assets?: Array<{ name: string; download_count: number }> };
    const asset = (release.assets || []).find(x => x.name === "app-release.apk");
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    return res.status(200).json({ downloads: asset?.download_count ?? 0, version: release.tag_name ?? null, source: "GitHub release asset downloads" });
  } catch {
    return res.status(502).json({ error: "Download statistics are temporarily unavailable" });
  }
}
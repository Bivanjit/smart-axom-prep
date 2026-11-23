import type { VercelRequest, VercelResponse } from "@vercel/node";
type Release = { tag_name?: string; assets?: Array<{ name: string; download_count: number }> };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const upstream = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases?per_page=100", {
      headers: { "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "SmartPrep-Axom-Download-Stats/1.0" }
    });
    if (!upstream.ok) return res.status(502).json({ error: "Download statistics are temporarily unavailable" });
    const releases = await upstream.json() as Release[];
    const apkAssets = releases.flatMap(release => (release.assets || []).filter(asset => asset.name.toLowerCase().endsWith(".apk")));
    const downloads = apkAssets.reduce((total, asset) => total + Number(asset.download_count || 0), 0);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    return res.status(200).json({ downloads, releases: apkAssets.length, source: "GitHub APK release downloads" });
  } catch {
    return res.status(502).json({ error: "Download statistics are temporarily unavailable" });
  }
}
type VercelRequest = { method?: string };
type VercelResponse = { status: (code: number) => VercelResponse; setHeader: (key: string, value: string) => void; json: (body: unknown) => void };
type GithubRelease = { tag_name?: string; prerelease?: boolean; draft?: boolean; html_url?: string; assets?: Array<{ name: string; browser_download_url: string; size: number; state?: string }> };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  try {
    const response = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/latest", {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "SmartPrep-Axom-Website/1.0" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(503).json({ error: "Latest GitHub release unavailable" });
    const release = await response.json() as GithubRelease;
    const apk = release.assets?.find(asset => asset.name.toLowerCase().endsWith(".apk") && asset.state === "uploaded");
    if (release.draft || release.prerelease || !release.tag_name || !/^v\d+\.\d+\.\d+$/.test(release.tag_name) || !apk) {
      return res.status(503).json({ error: "No published Android APK release available" });
    }
    return res.status(200).json({
      version_name: release.tag_name.slice(1),
      release_tag: release.tag_name,
      download_url: apk.browser_download_url,
      size_bytes: apk.size,
      release_url: release.html_url
    });
  } catch {
    return res.status(503).json({ error: "Could not check latest Android release" });
  }
}

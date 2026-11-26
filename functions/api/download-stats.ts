// Cloudflare Pages Function: mirrors the Vercel download-statistics endpoint.
type Release = { assets?: Array<{ name: string; download_count: number }> };
const SUPABASE_URL = "https://yydstdwknkgqelbxnvre.supabase.co";
const SUPABASE_KEY = "sb_publishable_zPHi6yA--NsNBJmXQy0Rhg_gwgP-Xbd";

export const onRequestGet = async ({ request }: { request: Request }) => {
  try {
    const [githubResponse, settingResponse] = await Promise.all([
      fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases?per_page=100", {
        headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "SmartPrep-Axom-Download-Stats/1.0" }
      }),
      fetch(SUPABASE_URL + "/rest/v1/app_content_settings?select=setting_value&setting_key=eq.apk_download_stats&is_public=eq.true", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, Accept: "application/json" }
      })
    ]);
    if (!githubResponse.ok || !settingResponse.ok) throw new Error("Download statistics source unavailable");
    const releases = await githubResponse.json() as Release[];
    const setting = await settingResponse.json() as Array<{ setting_value?: { historical_baseline?: number } }>;
    const historicalBaseline = Number(setting[0]?.setting_value?.historical_baseline ?? 0);
    const liveDownloads = releases.flatMap(r => r.assets || [])
      .filter(asset => asset.name.toLowerCase().endsWith(".apk"))
      .reduce((total, asset) => total + Number(asset.download_count || 0), 0);
    return Response.json(
      { downloads: historicalBaseline + liveDownloads, historicalBaseline, liveDownloads, source: "Restored historical baseline + live GitHub APK release downloads" },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } }
    );
  } catch {
    return Response.json({ error: "Download statistics are temporarily unavailable" }, { status: 502 });
  }
};

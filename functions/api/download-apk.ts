type ReleaseSettings = { version_name: string; version_code: number; release_tag: string; is_available: boolean };
type GithubRelease = { tag_name?: string; draft?: boolean; prerelease?: boolean; assets?: Array<{ name: string; state?: string }> };
type Env = { VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string };

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  try {
    const base = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key) throw new Error("App release configuration unavailable");
    const settingsResponse = await fetch(base + "/rest/v1/app_release_settings?id=eq.1&select=release_tag,is_available", {
      headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store"
    });
    if (!settingsResponse.ok) throw new Error("Could not read app release settings");
    const rows = await settingsResponse.json() as ReleaseSettings[];
    const settings = rows[0];
    const tag = settings?.release_tag || "";
    if (!settings || settings.is_available !== true || !/^v\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(tag)) {
      throw new Error("No available app release is configured");
    }
    const githubResponse = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/tags/" + encodeURIComponent(tag), {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "SmartPrep-Axom-Download/1.0" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store"
    });
    if (!githubResponse.ok) throw new Error("Configured release was not found");
    const release = await githubResponse.json() as GithubRelease;
    const apk = release.assets?.find(asset => asset.name.toLowerCase() === "app-release.apk" && asset.state === "uploaded");
    if (release.draft || release.prerelease || release.tag_name !== tag || !apk) throw new Error("Configured release has no published APK");
    const target = "https://github.com/Bivanjit/SMART-PREP-AXOM-APP/releases/download/" + encodeURIComponent(tag) + "/app-release.apk";
    return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", "CDN-Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response("The configured SmartPrep Axom APK is temporarily unavailable. Please try again shortly.", { status: 503, headers: { "Cache-Control": "no-store", "CDN-Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  }
};
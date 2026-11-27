type ReleaseSettings = { version_name: string; version_code: number; release_tag: string; is_available: boolean };
type GithubRelease = { tag_name?: string; draft?: boolean; prerelease?: boolean; assets?: Array<{ name: string; size: number; state?: string }> };
type Env = { VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string };

async function getConfiguredRelease(env: Env) {
  const base = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error("App release configuration unavailable");
  const settingsResponse = await fetch(base + "/rest/v1/app_release_settings?id=eq.1&select=version_name,version_code,release_tag,is_available", {
    headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store"
  });
  if (!settingsResponse.ok) throw new Error("Could not read app release settings");
  const rows = await settingsResponse.json() as ReleaseSettings[];
  const settings = rows[0];
  if (!settings || settings.is_available !== true || !/^v\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(settings.release_tag)) {
    throw new Error("No available app release is configured");
  }
  const githubResponse = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/tags/" + encodeURIComponent(settings.release_tag), {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "SmartPrep-Axom-Website/1.0" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store"
  });
  if (!githubResponse.ok) throw new Error("Configured GitHub release was not found");
  const github = await githubResponse.json() as GithubRelease;
  const apk = github.assets?.find(asset => asset.name.toLowerCase() === "app-release.apk" && asset.state === "uploaded");
  if (github.draft || github.prerelease || github.tag_name !== settings.release_tag || !apk) {
    throw new Error("Configured release does not contain a published APK");
  }
  return { settings, apk };
}

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { settings, apk } = await getConfiguredRelease(env);
    return Response.json(
      { version_name: settings.version_name, version_code: settings.version_code, release_tag: settings.release_tag, size_bytes: apk.size, app_name: "SmartPrep Axom" },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", "CDN-Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json({ error: "Latest configured SmartPrep Axom APK is unavailable" }, {
      status: 503,
      headers: { "Cache-Control": "no-store", "CDN-Cache-Control": "no-store" }
    });
  }
};
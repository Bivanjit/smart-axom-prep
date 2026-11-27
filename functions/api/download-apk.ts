type GithubRelease = { tag_name?: string; prerelease?: boolean; draft?: boolean; assets?: Array<{ name: string; size: number; state?: string }> };

export const onRequest = async ({ request }: { request: Request }) => {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  try {
    const response = await fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/latest", {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "SmartPrep-Axom-Download/1.0" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("GitHub release lookup failed");
    const release = await response.json() as GithubRelease;
    const tag = release.tag_name || "";
    const apk = release.assets?.find(asset => asset.name.toLowerCase() === "app-release.apk" && asset.state === "uploaded");
    if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(tag) || !apk) {
      throw new Error("No verified published APK found");
    }
    const target = "https://github.com/Bivanjit/SMART-PREP-AXOM-APP/releases/download/" + encodeURIComponent(tag) + "/app-release.apk";
    return new Response(null, {
      status: 302,
      headers: {
        Location: target,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new Response("The latest SmartPrep Axom APK is temporarily unavailable. Please try again shortly.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
    });
  }
};
type GithubRelease = {
  tag_name?: string;
  name?: string;
  prerelease?: boolean;
  draft?: boolean;
  published_at?: string;
  assets?: Array<{ name: string; size: number; state?: string }>;
};

export const onRequestGet = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "SmartPrep-Axom-Website/1.0"
        },
        signal: AbortSignal.timeout(8000)
      }
    );
    if (!response.ok) throw new Error("GitHub release lookup failed");
    const release = await response.json() as GithubRelease;
    const match = release.tag_name?.match(/^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);
    const apk = release.assets?.find(asset =>
      asset.name.toLowerCase() === "app-release.apk" && asset.state === "uploaded"
    );
    if (release.draft || release.prerelease || !match || !apk) {
      throw new Error("No published SmartPrep Axom APK release is available");
    }
    return Response.json(
      {
        app_name: "SmartPrep Axom",
        version_name: match[1],
        release_tag: release.tag_name,
        size_bytes: apk.size,
        published_at: release.published_at
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return Response.json(
      { error: "The latest SmartPrep Axom APK could not be verified. Please try again shortly." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store"
        }
      }
    );
  }
};
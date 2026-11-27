type GithubRelease = {
  tag_name?: string;
  prerelease?: boolean;
  draft?: boolean;
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
    if (!response.ok) {
      return Response.json({ error: "Latest app release unavailable" }, { status: 503 });
    }

    const release = await response.json() as GithubRelease;
    const versionMatch = release.tag_name?.match(/^v(\d+\.\d+\.\d+)(?:-[0-9A-Za-z.-]+)?$/);
    const apk = release.assets?.find(
      asset => asset.name.toLowerCase().endsWith(".apk") && asset.state === "uploaded"
    );

    if (release.draft || release.prerelease || !versionMatch || !apk) {
      return Response.json({ error: "No published Android APK release available" }, { status: 503 });
    }

    return Response.json(
      {
        version_name: versionMatch[1],
        release_tag: release.tag_name,
        size_bytes: apk.size
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return Response.json({ error: "Could not check latest app release" }, { status: 503 });
  }
};

type GithubRelease = {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: Array<{
    name: string;
    state?: string;
    browser_download_url?: string;
  }>;
};

const TAG_PATTERN = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?$/;

export const onRequest = async ({ request }: { request: Request }) => {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" }
    });
  }

  const tag = new URL(request.url).searchParams.get("tag") || "";
  if (tag && !TAG_PATTERN.test(tag)) {
    return new Response("Invalid release tag", { status: 400 });
  }

  try {
    const endpoint = tag
      ? `https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/tags/${encodeURIComponent(tag)}`
      : "https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases/latest";

    const metadata = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "SmartPrep-Axom-Download/1.0"
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!metadata.ok) {
      return new Response("The latest SmartPrep Axom APK is not available. Please try again shortly.", {
        status: metadata.status === 404 ? 404 : 503
      });
    }

    const release = await metadata.json() as GithubRelease;
    const apk = release.assets?.find(
      asset => asset.name.toLowerCase() === "app-release.apk" && asset.state === "uploaded"
    );
    if (release.draft || release.prerelease || !apk?.browser_download_url) {
      return new Response("No published SmartPrep Axom APK is available for this release.", { status: 404 });
    }

    const upstream = await fetch(apk.browser_download_url, {
      redirect: "follow",
      headers: { "User-Agent": "SmartPrep-Axom-Download/1.0" },
      signal: AbortSignal.timeout(30000)
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Unable to fetch the APK right now. Please try again shortly.", {
        status: upstream.status || 502
      });
    }

    const headers = new Headers({
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="SmartPrep-Axom.apk"',
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Content-Type-Options": "nosniff"
    });
    const length = upstream.headers.get("content-length");
    if (length) headers.set("Content-Length", length);

    return new Response(method === "HEAD" ? null : upstream.body, {
      status: 200,
      headers
    });
  } catch {
    return new Response("Unable to fetch the APK right now. Please try again shortly.", { status: 502 });
  }
};

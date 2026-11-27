type GithubRelease = {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: Array<{ name: string; state?: string; browser_download_url?: string }>;
};

const TAG_PATTERN = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?$/;

export const onRequest = async ({ request }: { request: Request }) => {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  const tag = new URL(request.url).searchParams.get("tag") || "";
  if (!TAG_PATTERN.test(tag)) return new Response("Invalid release tag", { status: 400 });
  const target = "https://github.com/Bivanjit/SMART-PREP-AXOM-APP/releases/download/" + encodeURIComponent(tag) + "/app-release.apk";
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "public, max-age=60", "X-Content-Type-Options": "nosniff" }
  });
};
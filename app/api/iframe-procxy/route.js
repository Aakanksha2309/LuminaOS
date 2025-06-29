export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("❌ URL parameter missing", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "text/html";
    let html = await response.text();

    // 👉 Base URL to resolve relative paths
    const baseUrl = new URL(targetUrl).origin;

    // 🔧 Convert relative CSS/JS/Image links to absolute
    html = html.replace(/(src|href)=["']\/(.*?)["']/g, `$1="${baseUrl}/$2"`);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *"
      }
    });

  } catch (err) {
    return new Response("❌ Failed to fetch the URL", { status: 500 });
  }
}

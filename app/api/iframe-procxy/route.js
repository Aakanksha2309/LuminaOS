// app/api/proxy/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("❌ URL parameter missing", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "text/html";
    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // 👇 Iframe ke liye allow karo
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *"
      }
    });

  } catch (err) {
    return new Response("❌ Failed to fetch the URL", { status: 500 });
  }
}

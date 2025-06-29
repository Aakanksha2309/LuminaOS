export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  if (!targetUrl) {
    return new Response('Missing ?url param', { status: 400 });
  }
  // Block localhost for security
  if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
    return new Response('URL blocked for security.', { status: 403 });
  }
  try {
    const fetchRes = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    // Remove problematic headers
    const headers = new Headers(fetchRes.headers);
    headers.delete('x-frame-options');
    headers.delete('content-security-policy');
    headers.delete('content-security-policy-report-only');
    const body = await fetchRes.arrayBuffer();
    return new Response(body, {
      status: fetchRes.status,
      headers,
    });
  } catch (e) {
    return new Response('Proxy failed', { status: 500 });
  }
} 
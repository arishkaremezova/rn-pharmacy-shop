const clientId = 'Ov23lik1CaFuva9oCsTC';
const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return new Response(null, { status: 415 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return new Response(null, { status: 400 });
  }

  try {
    if (body.action === 'start') {
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST', headers, body: JSON.stringify({ client_id: clientId }),
      });
      const data = await response.json();
      if (!response.ok || !data.device_code || !data.user_code) {
        return Response.json({ error: 'start_failed' }, { status: 502 });
      }
      return Response.json({
        deviceCode: data.device_code, userCode: data.user_code, expiresIn: data.expires_in,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (body.action !== 'check' || typeof body.deviceCode !== 'string' || !body.deviceCode) {
      return new Response(null, { status: 400 });
    }
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers,
      body: JSON.stringify({
        client_id: clientId, device_code: body.deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    });
    const data = await response.json();
    if (data.error) return Response.json({ error: data.error }, { status: 400 });
    if (!response.ok || !data.access_token) return new Response(null, { status: 502 });

    const profile = await fetch('https://api.github.com/user', {
      headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + data.access_token },
    });
    const user = await profile.json();
    if (!profile.ok || !Number.isSafeInteger(user.id)) return new Response(null, { status: 502 });
    return Response.json({ userId: user.id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'github_unavailable' }, { status: 502 });
  }
}

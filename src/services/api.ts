const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

// ── Token helpers ────────────────────────────────────────────────────────────

export function getTokens() {
  return {
    accessToken: localStorage.getItem('innoma_access_token'),
    refreshToken: localStorage.getItem('innoma_refresh_token'),
  };
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('innoma_access_token', accessToken);
  localStorage.setItem('innoma_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('innoma_access_token');
  localStorage.removeItem('innoma_refresh_token');
  localStorage.removeItem('innoma_user');
}

// ── Token refresh (shared promise prevents duplicate refresh calls) ──────────

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token available');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const json = await res.json();
  setTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  requiresAuth = true,
): Promise<any> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const { accessToken } = getTokens();
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, { ...options, headers });

  // On 401, attempt a single token refresh then retry the original request
  if (res.status === 401 && requiresAuth) {
    try {
      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } catch {
      throw new Error('Session expired. Please log in again.');
    }
  }

  const json = await res.json();

  if (!res.ok) {
    // Normalise all backend error shapes into a single message
    const message =
      json.error ??
      json.errors?.[0]?.message ??
      `Request failed (${res.status})`;
    const err = new Error(message) as Error & { status: number; body: unknown };
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

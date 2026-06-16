const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccessTokenPayload() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    );
    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getAccessTokenPayload()?.role ?? null;
}

export function saveAuthTokens(tokenResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasAuthToken() {
  return Boolean(getAccessToken());
}

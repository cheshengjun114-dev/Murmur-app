const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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

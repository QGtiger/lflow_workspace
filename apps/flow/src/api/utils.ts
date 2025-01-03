export const ACCESS_TOKEN_KEY = "lflow_access_token";
export const REFRESH_TOKEN_KEY = "lflow_refresh_token";

export function userLoginBySetToken(config: {
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, config.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, config.refreshToken);
}

export function userLogoutByRemoveToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

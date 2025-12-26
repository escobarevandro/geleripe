export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Default values for environment variables
const DEFAULT_ENV = {
  APP_TITLE: "Grupo Escoteiro Leripe",
  APP_LOGO: "/logos/leripe_sem_fundo.png",
  OAUTH_PORTAL_URL: "http://localhost:3000",
  APP_ID: "leripe-local",
  ANALYTICS_ENDPOINT: "http://localhost:3000",
  ANALYTICS_WEBSITE_ID: "leripe-local"
};

// Safe environment getter
const getEnvVar = (key: string, defaultValue: string) => {
  const envValue = import.meta.env[`VITE_${key}`];
  return typeof envValue === 'string' ? envValue : defaultValue;
};

export const APP_TITLE = getEnvVar('APP_TITLE', DEFAULT_ENV.APP_TITLE);
export const APP_LOGO = getEnvVar('APP_LOGO', DEFAULT_ENV.APP_LOGO);

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = getEnvVar('OAUTH_PORTAL_URL', DEFAULT_ENV.OAUTH_PORTAL_URL);
  const appId = getEnvVar('APP_ID', DEFAULT_ENV.APP_ID);
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (error) {
    console.error('Error generating login URL:', error);
    // Fallback to a basic login URL if something goes wrong
    return '/login';
  }
};
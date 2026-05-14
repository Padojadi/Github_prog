
const browserDpctBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
const browserConferencesBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL_CONFERENCES || "/conferences-api/v1";

const serverDpctBaseUrl =
  process.env.BACKEND_URL_INTERNAL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:5002/api";

const serverConferencesBaseUrl =
  process.env.BACKEND_URL_CONFERENCES_INTERNAL ||
  process.env.NEXT_PUBLIC_BACKEND_URL_CONFERENCES ||
  "http://127.0.0.1:5003/v1";

/**
 * Browser calls stay on public/reverse-proxy routes while server calls prefer
 * internal/private URLs for better reliability.
 */
export const Backend_URL =
  typeof window === "undefined" ? serverDpctBaseUrl : browserDpctBaseUrl;
export const BACKEND_URL_CONFERENCES =
  typeof window === "undefined"
    ? serverConferencesBaseUrl
    : browserConferencesBaseUrl;


export const JSON_DEMO_URL = "https://json-placeholder-xi.vercel.app";

export const PARTICIPANT_TOKEN_KEY = "participant_token"
// export const JSON_DEMO_URL = "http://localhost:3004";
